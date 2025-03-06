
import { MessageBubble } from "./MessageBubble";
import { ChatUser } from "@/types/chat.types";
import { format, parseISO } from "date-fns";

interface MessageGroupProps {
  date: string;
  messages: any[];
  currentUser: ChatUser | null;
  selectedUser: ChatUser | null;
}

// Helper to check if messages are from the same sender in a short time window
const shouldGroupMessages = (curr: any, prev: any) => {
  if (!prev) return false;
  if (curr.sender_id !== prev.sender_id) return false;
  
  // Group messages sent within 5 minutes of each other
  const currDate = parseISO(curr.created_at);
  const prevDate = parseISO(prev.created_at);
  const diffInMinutes = Math.abs(currDate.getTime() - prevDate.getTime()) / (1000 * 60);
  
  return diffInMinutes < 5;
};

// Helper function to format dates for message groups
const formatMessageDate = (dateString: string) => {
  const date = parseISO(dateString);
  if (new Date().toDateString() === date.toDateString()) {
    return "Today";
  } else if (new Date(Date.now() - 86400000).toDateString() === date.toDateString()) {
    return "Yesterday";
  } else {
    return format(date, "MMMM d, yyyy");
  }
};

export const MessageGroup = ({ date, messages, currentUser, selectedUser }: MessageGroupProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <div className="px-3 py-1 text-xs bg-black/20 text-white/70 rounded-full">
          {formatMessageDate(parseISO(date).toISOString())}
        </div>
      </div>
      
      {messages.map((message, messageIndex) => {
        const isMe = message.sender_id === currentUser?.id;
        const sender = isMe ? currentUser : selectedUser;
        const showAvatar = messageIndex === 0 || 
          !shouldGroupMessages(message, messages[messageIndex - 1]);
        const isGrouped = messageIndex > 0 && 
          shouldGroupMessages(message, messages[messageIndex - 1]);
        
        return (
          <div key={message.id} className={isGrouped ? 'mt-1' : 'mt-4'}>
            <MessageBubble 
              message={message}
              isMe={isMe}
              sender={sender}
              showAvatar={showAvatar}
            />
          </div>
        );
      })}
    </div>
  );
};
