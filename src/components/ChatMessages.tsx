
import { Avatar } from "@/components/ui/avatar";
import { Info } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "@/components/ui/use-toast";
import { useChat } from "@/contexts/ChatContext";
import { format } from "date-fns";

export const ChatMessages = () => {
  const { currentUser, selectedUser, messages, sendMessage, markMessagesAsRead } = useChat();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mark messages as read when viewing the conversation
  useEffect(() => {
    if (selectedUser) {
      markMessagesAsRead();
    }
  }, [selectedUser, messages, markMessagesAsRead]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      await sendMessage(newMessage);
      setNewMessage("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Format timestamp
  const formatMessageTime = (timestamp: string) => {
    try {
      return format(new Date(timestamp), "HH:mm");
    } catch (e) {
      return "";
    }
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-screen text-muted">
        <p>Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen">
      <div className="glass p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <img 
              src={selectedUser.avatar_url || "https://placeholder.com/avatar"} 
              alt={selectedUser.username} 
              className="object-cover" 
            />
          </Avatar>
          <div>
            <div className="font-medium">{selectedUser.username}</div>
            <div className="text-sm text-muted">
              {selectedUser.last_seen ? 'Last seen recently' : ''}
            </div>
          </div>
        </div>
        <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
          <Info className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-muted">
            <p>No messages yet. Say hello!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isMe = message.sender_id === currentUser?.id;
            const sender = isMe ? currentUser : selectedUser;
            
            return (
              <div key={message.id} className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : ""}`}>
                <Avatar className="w-8 h-8">
                  <img 
                    src={sender?.avatar_url || "https://placeholder.com/avatar"} 
                    alt={sender?.username || ""} 
                    className="object-cover"
                  />
                </Avatar>
                <div className="flex flex-col gap-1">
                  <div className={`message-bubble ${isMe ? "sent" : "received"}`}>
                    {message.content}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted">
                    {formatMessageTime(message.created_at)}
                    {isMe && message.read && <span className="w-3 h-3">✓</span>}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4">
        <div className="glass rounded-full p-2 flex items-center gap-2">
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
            disabled={!newMessage.trim()}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};
