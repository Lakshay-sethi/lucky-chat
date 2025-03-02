
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
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="bg-background border-b border-border p-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-accent">Lucky Chat</h1>
        <div className="flex items-center gap-2">
          {user && (
            <span className="text-sm text-muted mr-2">
              {user.email}
            </span>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            className="text-muted hover:text-foreground"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <ChatSidebar />
        <Routes>
          <Route path="/" element={
            <div className="flex-1 flex items-center justify-center bg-muted/10">
              <div className="text-center p-8">
                <h2 className="text-2xl font-semibold mb-2">Welcome to Lucky Chat</h2>
                <p className="text-muted mb-4">Select a conversation or start a new one to begin chatting</p>
              </div>
            </div>
          } />
          <Route path="/:receiverId" element={<ChatMessages />} />
        </Routes>
      </div>
    </div>
  );
};

export default Index;
