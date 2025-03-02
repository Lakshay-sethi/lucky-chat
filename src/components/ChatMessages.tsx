import { Avatar } from "@/components/ui/avatar";
import { Check, Info, Send } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  read: boolean;
  image_url?: string;
}

interface Profile {
  id: string;
  username: string;
  avatar_url: string;
}

export const ChatMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [receiver, setReceiver] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { receiverId } = useParams<{ receiverId: string }>();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      }
    };
    fetchUser();
  }, []);

  // Fetch receiver profile
  useEffect(() => {
    if (receiverId) {
      const fetchReceiver = async () => {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", receiverId)
          .single();

        if (error) {
          console.error("Error fetching receiver:", error);
        } else if (data) {
          setReceiver(data);
        }
      };
      fetchReceiver();
    }
  }, [receiverId]);

  // Fetch messages
  useEffect(() => {
    if (!user?.id || !receiverId) return;

    const fetchMessages = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .or(`sender_id.eq.${receiverId},receiver_id.eq.${receiverId}`)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        toast({
          description: "Failed to load messages",
          variant: "destructive",
        });
      } else if (data) {
        // Filter for messages between these two users only
        const filteredMessages = data.filter(
          msg => 
            (msg.sender_id === user.id && msg.receiver_id === receiverId) || 
            (msg.sender_id === receiverId && msg.receiver_id === user.id)
        );
        setMessages(filteredMessages);
        
        // Mark received messages as read
        const unreadMessages = filteredMessages.filter(
          msg => msg.sender_id === receiverId && !msg.read
        );
        
        if (unreadMessages.length > 0) {
          const unreadIds = unreadMessages.map(msg => msg.id);
          supabase
            .from("messages")
            .update({ read: true })
            .in("id", unreadIds)
            .then(({ error }) => {
              if (error) console.error("Error marking messages as read:", error);
            });
        }
      }
      setLoading(false);
    };

    fetchMessages();

    // Subscribe to new messages
    const subscription = supabase
      .channel('messages-channel')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `sender_id=eq.${receiverId},receiver_id=eq.${user.id}` 
      }, payload => {
        // Add new message to state
        setMessages(prevMessages => [...prevMessages, payload.new as Message]);
        
        // Mark as read automatically since we're in the chat
        supabase
          .from("messages")
          .update({ read: true })
          .eq("id", payload.new.id)
          .then(({ error }) => {
            if (error) console.error("Error marking message as read:", error);
          });
      })
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `sender_id=eq.${user.id},receiver_id=eq.${receiverId}` 
      }, payload => {
        setMessages(prevMessages => [...prevMessages, payload.new as Message]);
      })
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'messages',
        filter: `sender_id=eq.${receiverId},receiver_id=eq.${user.id}` 
      }, payload => {
        // Update message (e.g., read status)
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg.id === payload.new.id ? { ...msg, ...payload.new } : msg
          )
        );
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user?.id, receiverId, toast]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from('chat_images')
      .upload(filePath, file);

    if (uploadError) {
      toast({
        description: "Error uploading image",
        variant: "destructive",
      });
      return null;
    }

    return filePath;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !receiverId) return;
    if (!newMessage.trim() && !selectedImage) return;

    try {
      let imageUrl = null;
      if (selectedImage) {
        const filePath = await uploadImage(selectedImage);
        if (filePath) {
          const { data: { publicUrl } } = supabase.storage
            .from('chat_images')
            .getPublicUrl(filePath);
          imageUrl = publicUrl;
        }
      }

      const { error } = await supabase
        .from("messages")
        .insert({
          content: newMessage.trim() || (selectedImage ? "Image" : ""),
          sender_id: user.id,
          receiver_id: receiverId,
          image_url: imageUrl,
        });

      if (error) {
        console.error("Error sending message:", error);
        toast({
          description: "Failed to send message",
          variant: "destructive",
        });
      } else {
        setNewMessage("");
        setSelectedImage(null);
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        description: "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  if (loading && messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col h-screen items-center justify-center">
        <p>Loading conversation...</p>
      </div>
    );
  }

  if (!receiver && receiverId) {
    return (
      <div className="flex-1 flex flex-col h-screen items-center justify-center">
        <p>Select a conversation to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen bg-background">
      {receiver ? (
        <>
          <div className="border-b border-border p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <img src={receiver.avatar_url || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"} alt={receiver.username} className="object-cover" />
              </Avatar>
              <div>
                <div className="font-medium">{receiver.username}</div>
                <div className="text-sm text-muted">Active now</div>
              </div>
            </div>
            <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <Info className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex items-end gap-2 ${message.sender_id === user?.id ? "flex-row-reverse" : ""}`}
              >
                <Avatar className="w-8 h-8">
                  <img 
                    src={message.sender_id === user?.id 
                      ? (user?.user_metadata?.avatar_url || "https://images.unsplash.com/photo-1649972904349-6e44c42644a7")
                      : (receiver.avatar_url || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158")
                    } 
                    alt={message.sender_id === user?.id ? "Me" : receiver.username} 
                    className="object-cover"
                  />
                </Avatar>
                <div className="flex flex-col gap-1 max-w-[70%]">
                  <div className={`message-bubble ${message.sender_id === user?.id ? "sent" : "received"}`}>
                    {message.content}
                    {message.image_url && (
                      <div className="mt-2">
                        <img 
                          src={message.image_url} 
                          alt="Shared image" 
                          className="rounded-md max-w-full max-h-60 object-contain"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted">
                    {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {message.sender_id === user?.id && message.read && <Check className="w-3 h-3" />}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-border">
            <div className="bg-white/5 rounded-full p-2 flex items-center gap-2">
              <label htmlFor="image-upload" className="cursor-pointer p-2 hover:bg-white/5 rounded-full transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <input 
                  id="image-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageSelect} 
                />
              </label>
              {selectedImage && (
                <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full text-xs">
                  {selectedImage.name.length > 20 
                    ? `${selectedImage.name.substring(0, 20)}...` 
                    : selectedImage.name}
                  <button 
                    type="button" 
                    onClick={() => setSelectedImage(null)}
                    className="ml-1 text-muted hover:text-foreground"
                  >
                    ×
                  </button>
                </div>
              )}
              <form onSubmit={handleSendMessage} className="flex-1 flex">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent outline-none px-2"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button 
                  type="submit"
                  className="p-2 hover:bg-white/5 rounded-full transition-colors"
                  disabled={!newMessage.trim() && !selectedImage}
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-muted">Select a conversation to start chatting</p>
        </div>
      )}
    </div>
  );
};
