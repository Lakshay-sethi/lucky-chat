import { Search, Plus, Settings, LogOut } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { UserSettingsModal } from "./UserSettings";
import { Button } from "@/components/ui/button";

interface User {
  id: string;
  username: string;
  avatar_url: string;
}

export const ChatSidebar = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const fetchUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: userData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching current user:', error);
        return;
      }

      setCurrentUser(userData);
    }
  };

  useEffect(() => {
    // Fetch current user and all users
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching current user:', error);
          return;
        }

        setCurrentUser(userData);
      }
    };

    const getUsers = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) {
        console.error('Error fetching users:', error);
        return;
      }

      setUsers(data || []);
    };

    // Set up real-time subscription
    const channel = supabase
      .channel('profiles-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setUsers(current => [...current, payload.new as User]);
          } else if (payload.eventType === 'UPDATE') {
            setUsers(current =>
              current.map(user => 
                user.id === payload.new.id ? payload.new as User : user
              )
            );
            // Update currentUser if it's the one being modified
            if (currentUser?.id === payload.new.id) {
              setCurrentUser(payload.new as User);
            }
          } else if (payload.eventType === 'DELETE') {
            setUsers(current =>
              current.filter(user => user.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    // Initial fetch
    getCurrentUser();
    getUsers();

    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // Handle post-logout navigation or state updates
  };

  return (
    <div className="w-80 h-screen glass p-4 flex flex-col gap-4">
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
            //onClick={handleLogout}
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>
      
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-white/5 rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-1 ring-white/20 transition-all"
        />
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto scrollbar-hide">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
          >
            <Avatar className="w-10 h-10">
              <img src={user.avatar_url} alt={user.username} className="object-cover" />
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-medium">{user.username}</div>
            </div>
          </div>
        ))}
      </div>
      <UserSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentUser={currentUser}
        onUserUpdate={fetchUserData}
      />
    </div>
  );
};
