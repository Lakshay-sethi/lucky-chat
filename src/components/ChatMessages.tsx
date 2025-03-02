import { Avatar } from "@/components/ui/avatar";
import { Check, Info } from "lucide-react";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  content: string;
  sender: "me" | "other";
  timestamp: string;
  read: boolean;
}

const initialMessages: Message[] = [
  { id: "1", content: "Hey! How's your day going?", sender: "other", timestamp: "09:15", read: true },
  { id: "2", content: "Pretty good! Just working on some new designs. How about you?", sender: "me", timestamp: "09:17", read: true },
  { id: "3", content: "That's great! I'm actually looking for some design inspiration. Mind sharing what you're working on?", sender: "other", timestamp: "09:20", read: true },
  { id: "4", content: "Of course! I'm designing a new chat interface with a minimalist Apple-inspired look.", sender: "me", timestamp: "09:22", read: true },
  { id: "5", content: "That sounds amazing! I love Apple's design philosophy. Would love to see it when it's ready!", sender: "other", timestamp: "09:25", read: true },
];

export const ChatMessages = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: "me",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");
    toast({
      description: "Message sent",
      duration: 2000,
    });
  };

  return (
    <div className="flex-1 flex flex-col h-screen">
      <div className="glass p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" alt="User" className="object-cover" />
          </Avatar>
          <div>
            <div className="font-medium">Sarah Parker</div>
            <div className="text-sm text-muted">Active now</div>
          </div>
        </div>
        <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
          <Info className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.map((message) => (
          <div key={message.id} className={`flex items-end gap-2 ${message.sender === "me" ? "flex-row-reverse" : ""}`}>
            <Avatar className="w-8 h-8">
              <img 
                src={message.sender === "me" 
                  ? "https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
                  : "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
                } 
                alt={message.sender === "me" ? "Me" : "Other"} 
                className="object-cover"
              />
            </Avatar>
            <div className="flex flex-col gap-1">
              <div className={`message-bubble ${message.sender === "me" ? "sent" : "received"}`}>
                {message.content}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted">
                {message.timestamp}
                {message.sender === "me" && message.read && <Check className="w-3 h-3" />}
              </div>
            </div>
          </div>
        ))}
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