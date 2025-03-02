
import { Search, Plus } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface Profile {
  id: string;
  username: string;
  avatar_url: string;
  created_at: string;
  unread_count?: number;
  last_message?: string;
  last_message_time?: string;
}

export const ChatSidebar = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const navigate = useNavigate();
  const { receiverId } = useParams<{ receiverId: string }>();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setCurrentUser(data.user);
      }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    
    const fetchProfilesAndMessages = async () => {
      // Fetch all profiles except current user
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", currentUser.id);
      
      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        return;
      }

      // Fetch all messages for the current user
      const { data: messagesData, error: messagesError } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
        .order("created_at", { ascending: false });
      
      if (messagesError) {
        console.error("Error fetching messages:", messagesError);
        return;
      }

      // Process the profiles to include last message and unread count
      const processedProfiles = profilesData.map((profile) => {
        // Get all messages between current user and this profile
        const conversationMessages = messagesData.filter(
          msg => 
            (msg.sender_id === currentUser.id && msg.receiver_id === profile.id) || 
            (msg.sender_id === profile.id && msg.receiver_id === currentUser.id)
        );
        
        // Count unread messages
        const unreadCount = conversationMessages.filter(
          msg => msg.sender_id === profile.id && !msg.read
        ).length;
        
        // Get last message
        const lastMessage = conversationMessages[0];
        
        return {
          ...profile,
          unread_count: unreadCount,
          last_message: lastMessage ? lastMessage.content : "",
          last_message_time: lastMessage ? lastMessage.created_at : null
        };
      });
      
      // Sort profiles based on last message time and unread count
      const sortedProfiles = processedProfiles.sort((a, b) => {
        // First by unread count
        if (a.unread_count && b.unread_count) {
          if (a.unread_count > b.unread_count) return -1;
          if (a.unread_count < b.unread_count) return 1;
        }
        
        // Then by last message time
        if (a.last_message_time && b.last_message_time) {
          return new Date(b.last_message_time).getTime() - new Date(a.last_message_time).getTime();
        }
        
        return 0;
      });
      
      setProfiles(sortedProfiles);
    };
    
    fetchProfilesAndMessages();
    
    // Set up subscription for real-time updates to messages
    const messagesSubscription = supabase
      .channel('messages-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'messages',
        filter: `receiver_id=eq.${currentUser.id}` 
      }, () => {
        // Refetch data when any message changes
        fetchProfilesAndMessages();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(messagesSubscription);
    };
  }, [currentUser]);

  const filteredProfiles = searchQuery
    ? profiles.filter(profile => 
        profile.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : profiles;

  const handleSelectProfile = (profileId: string) => {
    navigate(`/${profileId}`);
  };
  
  return (
    <div className="w-80 h-screen glass p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <img 
              src={currentUser?.user_metadata?.avatar_url || "https://images.unsplash.com/photo-1649972904349-6e44c42644a7"} 
              alt="Me" 
              className="object-cover"
            />
          </Avatar>
          <span className="font-medium">{currentUser?.email || "Me"}</span>
        </div>
        <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
          <Plus className="w-5 h-5" />
        </button>
      </div>
      
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-white/5 rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-1 ring-white/20 transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto scrollbar-hide">
        {filteredProfiles.map((profile) => (
          <div
            key={profile.id}
            className={`flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors ${receiverId === profile.id ? 'bg-white/10' : ''}`}
            onClick={() => handleSelectProfile(profile.id)}
          >
            <Avatar className="w-10 h-10 relative">
              <img src={profile.avatar_url || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"} alt={profile.username} className="object-cover" />
              {profile.last_message_time && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></span>
              )}
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <span className="font-medium">{profile.username}</span>
                {profile.last_message_time && (
                  <span className="text-xs text-muted">
                    {new Date(profile.last_message_time).toLocaleDateString(undefined, { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted truncate">
                  {profile.last_message ? 
                    (profile.last_message === "Image" ? "📷 Image" : profile.last_message) 
                    : "No messages yet"}
                </span>
                {profile.unread_count ? (
                  <Badge variant="default" className="ml-2">
                    {profile.unread_count}
                  </Badge>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
