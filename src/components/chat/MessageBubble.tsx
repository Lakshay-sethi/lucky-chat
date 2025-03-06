
import { format, parseISO } from "date-fns";
import { MediaMessage } from "@/components/MediaMessage";
import { ChatUser } from "@/types/chat.types";
import { Avatar } from "@/components/ui/avatar";

interface MessageBubbleProps {
  message: {
    id: string;
    content: string;
    created_at: string;
    sender_id: string;
    file_url?: string | null;
    file_type?: "image" | "video" | "audio" | "document" | null;
    read: boolean;
  };
  isMe: boolean;
  sender: ChatUser | null;
  showAvatar: boolean;
}

export const MessageBubble = ({ message, isMe, sender, showAvatar }: MessageBubbleProps) => {
  // Format timestamp
  const formatMessageTime = (timestamp: string) => {
    try {
      return format(parseISO(timestamp), "HH:mm");
    } catch (e) {
      return "";
    }
  };

  return (
    <div 
      className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : ""}`}
    >
      {showAvatar ? (
        <Avatar className="w-8 h-8">
          <img 
            src={sender?.avatar_url || "https://placeholder.com/avatar"} 
            alt={sender?.username || ""} 
            className="object-cover"
          />
        </Avatar>
      ) : (
        <div className="w-8 h-8" /> // Placeholder for alignment when avatar is hidden
      )}
      <div className={`flex flex-col gap-1 ${isMe ? "items-end" : "items-start"}`}>
        {/* Media content */}
        {message.file_url && message.file_type && (
          <div className={`media-message ${isMe ? "sent" : "received"}`}>
            <MediaMessage 
              fileUrl={message.file_url} 
              fileType={message.file_type} 
            />
          </div>
        )}
        
        {/* Text content */}
        {message.content && (
          <div className={`message-bubble ${isMe ? "sent" : "received"}`}>
            {message.content}
          </div>
        )}
        
        <div className="flex items-center gap-1 text-xs text-muted">
          {formatMessageTime(message.created_at)}
          {isMe && message.read && <span className="w-3 h-3">✓</span>}
        </div>
      </div>
    </div>
  );
};
