
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Index from "./pages/Index";
import SupabaseCredentialsModal from "./components/SupabaseCredentialsModal";
import { Button } from "./components/ui/button";
import { Settings } from "lucide-react";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [credentialsModalOpen, setCredentialsModalOpen] = useState(false);

  useEffect(() => {
    // Check if Supabase credentials exist
    const url = localStorage.getItem('supabase_url');
    const key = localStorage.getItem('supabase_anon_key');
    
    // Open credentials modal if credentials are missing
    if (!url || !key) {
      setCredentialsModalOpen(true);
    } else {
      loadSession();
    }
  }, []);

  const loadSession = async () => {
    try {
      // Check active session
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
      
      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setSession(session);
        }
      );
      
      return () => subscription.unsubscribe();
    } catch (error) {
      console.error("Error loading session:", error);
      setLoading(false);
    }
  };

  const handleCredentialsSubmit = () => {
    loadSession();
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="fixed top-4 right-4 z-50">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCredentialsModalOpen(true)}
            title="Supabase Settings"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
        <SupabaseCredentialsModal 
          open={credentialsModalOpen} 
          onOpenChange={setCredentialsModalOpen}
          onCredentialsSubmit={handleCredentialsSubmit}
        />
        <BrowserRouter>
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
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
