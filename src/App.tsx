
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase, updateSupabaseClient } from "@/integrations/supabase/client";
import SupabaseCredentialsModal from "@/components/SupabaseCredentialsModal";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Index from "./pages/Index";
import { toast } from "@/hooks/use-toast";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  
  // Check if Supabase credentials are set
  const hasCredentials = localStorage.getItem('supabase_url') && localStorage.getItem('supabase_key');

  useEffect(() => {
    // Show credentials modal if not set
    if (!hasCredentials) {
      setShowCredentialsModal(true);
    }

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    }).catch(error => {
      console.error("Error getting session:", error);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, [hasCredentials]);

  const handleCredentialsSubmit = (url: string, key: string) => {
    const newClient = updateSupabaseClient(url, key);
    
    // Test the connection
    newClient.auth.getSession()
      .then(() => {
        toast({
          title: "Connected",
          description: "Successfully connected to Supabase",
        });
        // Refresh the page to reinitialize with new credentials
        window.location.reload();
      })
      .catch(error => {
        console.error("Error connecting to Supabase:", error);
        toast({
          title: "Connection Error",
          description: "Could not connect to Supabase with the provided credentials",
          variant: "destructive",
        });
      });
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="fixed top-4 right-4 z-50">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setShowCredentialsModal(true)}
              title="Supabase Settings"
            >
              <Settings size={18} />
            </Button>
          </div>
          <Routes>
            <Route path="/landing" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route 
              path="/" 
              element={
                session ? <Index /> : <Navigate to="/landing" replace />
              } 
            />
          </Routes>
        </BrowserRouter>

        <SupabaseCredentialsModal
          open={showCredentialsModal}
          onOpenChange={setShowCredentialsModal}
          onCredentialsSubmit={handleCredentialsSubmit}
        />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
