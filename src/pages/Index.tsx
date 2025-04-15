import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatMessages } from "@/components/ChatMessages";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { LogOut } from "lucide-react";
import { ChatProvider } from "@/contexts/ChatContext";
import { Analytics } from "@vercel/analytics/react"; // Import Analytics

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

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
    <ChatProvider>
      <div className="flex flex-col h-screen overflow-hidden">
        <header className="bg-background border-b border-border p-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-accent">Lucky Chat</h1>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            className="text-muted hover:text-foreground"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </header>
        <div className="flex flex-1 overflow-hidden">
          <ChatSidebar />
          <ChatMessages />
        </div>
      </div>
      <Analytics /> {/* Add Analytics here */}
    </ChatProvider>
  );
};

export default Index;