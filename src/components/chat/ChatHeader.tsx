
import { Avatar } from "@/components/ui/avatar";
import { ChatUser } from "@/types/chat.types";

interface ChatHeaderProps {
  selectedUser: ChatUser | null;
}

export const ChatHeader = ({ selectedUser }: ChatHeaderProps) => {
  if (!selectedUser) return null;

  return (
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
    </div>
  );
};
