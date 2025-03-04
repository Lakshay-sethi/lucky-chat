import { Search, Plus, ArrowLeft, Settings } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { UserSettingsModal } from "./UserSettings";
import { Button } from "@/components/ui/button";
import { useChat } from "@/contexts/ChatContext";
import { NewConversationDialog } from "./NewConversationDialog";
import { Input } from "./ui/input";

export const ChatSidebar = () => {
  const { 
    currentUser, 
    activeConversations, 
    selectedUser, 
    setSelectedUser, 
    getUnreadCount,
    setIsNewConversationOpen
  } = useChat();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredConversations, setFilteredConversations] = useState(activeConversations);
  const [isChatVisible, setIsChatVisible] = useState(false);

  // Update filtered conversations when activeConversations or searchTerm changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredConversations(activeConversations);
      return;
    }
    
    const filtered = activeConversations.filter(user => 
      user.username?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredConversations(filtered);
  }, [activeConversations, searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };
  
  const handleUserClick = (user: any) => {
    setSelectedUser(user);
    if (window.innerWidth < 768) {
      setIsChatVisible(true);
    } else {
      setIsChatVisible(false);
    }
  };

  const handleBackClick = () => {
    setSelectedUser(null);
    setIsChatVisible(false);
  };

  return (
    <div className="w-80 glass p-4 flex flex-col gap-4">
      <div className={`sidebar ${isChatVisible ? 'hidden' : 'block'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <img 
                src={currentUser?.avatar_url || "https://placeholder.com/avatar"} 
                alt={currentUser?.username || "Me"} 
                className="object-cover"
              />
            </Avatar>
            <span className="font-medium">{currentUser?.username || "Me"}</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSettingsOpen(true)}
          >
            <Settings className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsNewConversationOpen(true)}
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" />
          <Input
            type="text"
            placeholder="Search conversations..."
            className="w-full bg-white/5 pl-10 pr-8 py-2 outline-none border-none focus:ring-1 ring-white/20 transition-all"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <button 
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted"
            >
              <span className="text-sm">×</span>
            </button>
          )}
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto scrollbar-hide">
          {filteredConversations.length === 0 ? (
            <div className="flex justify-center items-center py-4 text-muted text-sm">
              {searchTerm ? "No conversations found" : "No active conversations"}
            </div>
          ) : (
            filteredConversations.map((user) => {
              const unreadCount = getUnreadCount(user.id);
              const isSelected = selectedUser?.id === user.id;
              
              return (
                <div
                  key={user.id}
                  className={`flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 cursor-pointer transition-colors ${isSelected ? 'user-active' : ''}`}
                  onClick={() => handleUserClick(user)}
                >
                  <Avatar className="w-10 h-10">
                    <img 
                      src={user.avatar_url || "https://placeholder.com/avatar"} 
                      alt={user.username} 
                      className="object-cover" 
                    />
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{user.username}</div>
                  </div>
                  {unreadCount > 0 && (
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <UserSettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          currentUser={currentUser}
          onUserUpdate={() => {}}
        />
        <NewConversationDialog />
      </div>

      <div className={`chat ${isChatVisible ? 'block' : 'hidden'}`}>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBackClick}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        {/* Chat messages component goes here */}
      </div>
    </div>
  );
};