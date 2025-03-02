
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatMessages } from "@/components/ChatMessages";
import { Button } from "@/components/ui/button";
import { useNavigate, Routes, Route } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    
    navigate("/landing");
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <ChatSidebar />
      <Routes>
        <Route path="/" element={
          <div className="flex-1 flex items-center justify-center bg-background">
            <div className="text-center p-8">
              <h2 className="text-2xl font-semibold mb-2">Welcome to Lucky Chat</h2>
              <p className="text-muted mb-4">Select a conversation or start a new one to begin chatting</p>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        } />
        <Route path="/:receiverId" element={<ChatMessages />} />
      </Routes>
    </div>
  );
};

export default Index;
