
import { Search, Plus } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useParams } from "react-router-dom";

interface Profile {
  id: string;
  username: string;
  avatar_url: string;
  created_at: string;
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
    
    const fetchProfiles = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", currentUser.id); // Don't include current user
      
      if (error) {
        console.error("Error fetching profiles:", error);
      } else if (data) {
        setProfiles(data);
      }
    };
    
    fetchProfiles();
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
            <Avatar className="w-10 h-10">
              <img src={profile.avatar_url || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"} alt={profile.username} className="object-cover" />
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-medium">{profile.username}</div>
              <div className="text-sm text-muted truncate">Last seen {new Date(profile.created_at).toLocaleDateString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
