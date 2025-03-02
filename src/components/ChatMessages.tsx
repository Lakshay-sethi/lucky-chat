import { Avatar } from "@/components/ui/avatar";
import { Check } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  read: boolean;
}

const messages: Message[] = [
  { id: "1", content: "Yo", sender: "me", timestamp: "08:08", read: true },
  { id: "2", content: "😊😊😊😊😊😊", sender: "me", timestamp: "08:09", read: true },
  { id: "3", content: "oi", sender: "me", timestamp: "11:52", read: true },
  { id: "4", content: "Hello", sender: "me", timestamp: "14:57", read: true },
  { id: "5", content: "yo", sender: "me", timestamp: "16:17", read: true },
  { id: "6", content: "hui", sender: "me", timestamp: "11:46", read: true },
  { id: "7", content: "hiuii", sender: "me", timestamp: "11:46", read: true },
];

export const ChatMessages = () => {
  return (
    <div className="flex-1 flex flex-col h-screen">
      <div className="glass p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <img src="/avatars/buke.png" alt="Buke" />
          </Avatar>
          <div>
            <div className="font-medium">Buke</div>
            <div className="text-sm text-muted">Active now</div>
          </div>
        </div>
        <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
          <Info className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.map((message) => (
          <div key={message.id} className="flex items-end gap-2">
            <Avatar className="w-8 h-8">
              <img src="/avatars/elin.png" alt="Elin" />
            </Avatar>
            <div className="flex flex-col gap-1">
              <div className="message-bubble received">
                {message.content}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted">
                {message.timestamp}
                {message.read && <Check className="w-3 h-3" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4">
        <div className="glass rounded-full p-2 flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-transparent outline-none px-2"
          />
          <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};