
import { useChat } from "@/contexts/ChatContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar } from "@/components/ui/avatar";
import { Search } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

export const NewConversationDialog = () => {
  const { nonConversationUsers, isNewConversationOpen, setIsNewConversationOpen, setSelectedUser } = useChat();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = nonConversationUsers.filter(user => 
    user.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
    setIsNewConversationOpen(false);
  };

  return (
    <Dialog open={isNewConversationOpen} onOpenChange={setIsNewConversationOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Conversation</DialogTitle>
        </DialogHeader>
        
        <div className="relative my-4">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full bg-white/5 rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-1 ring-white/20 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="max-h-[60vh] overflow-y-auto space-y-2 py-2 scrollbar-hide">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-4 text-muted">
              No users found. Everyone is already in your conversations.
            </div>
          ) : (
            filteredUsers.map((user) => (
              <Button
                key={user.id}
                variant="ghost"
                className="w-full justify-start p-2 h-auto"
                onClick={() => handleSelectUser(user)}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <img 
                      src={user.avatar_url || "https://placeholder.com/avatar"} 
                      alt={user.username} 
                      className="object-cover" 
                    />
                  </Avatar>
                  <div className="font-medium text-left">{user.username}</div>
                </div>
              </Button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
