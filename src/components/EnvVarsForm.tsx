
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const EnvVarsForm = () => {
  const { toast } = useToast();
  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseAnonKey, setSupabaseAnonKey] = useState("");
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    // Check if variables are already set in localStorage
    const savedUrl = localStorage.getItem("VITE_SUPABASE_URL");
    const savedKey = localStorage.getItem("VITE_SUPABASE_ANON_KEY");
    
    if (savedUrl && savedKey) {
      setSupabaseUrl(savedUrl);
      setSupabaseAnonKey(savedKey);
      setIsConfigured(true);
    }
  }, []);

  const handleSave = () => {
    if (!supabaseUrl || !supabaseAnonKey) {
      toast({
        title: "Missing Information",
        description: "Please provide both Supabase URL and Anon Key.",
        variant: "destructive",
      });
      return;
    }

    // Save to localStorage
    localStorage.setItem("VITE_SUPABASE_URL", supabaseUrl);
    localStorage.setItem("VITE_SUPABASE_ANON_KEY", supabaseAnonKey);
    
    // Update environment variables (Note: This won't change import.meta.env during runtime)
    // We'll need to reload the page for changes to take effect
    setIsConfigured(true);
    
    toast({
      title: "Configuration Saved",
      description: "Supabase credentials have been saved. Please reload the page for changes to take effect.",
    });
  };

  const handleClear = () => {
    localStorage.removeItem("VITE_SUPABASE_URL");
    localStorage.removeItem("VITE_SUPABASE_ANON_KEY");
    setSupabaseUrl("");
    setSupabaseAnonKey("");
    setIsConfigured(false);
    
    toast({
      title: "Configuration Cleared",
      description: "Supabase credentials have been removed. Please reload the page for changes to take effect.",
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Supabase Configuration</CardTitle>
        <CardDescription>
          Enter your Supabase URL and Anon Key to connect to your Supabase project.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="supabaseUrl">Supabase URL</Label>
          <Input
            id="supabaseUrl"
            type="text"
            value={supabaseUrl}
            onChange={(e) => setSupabaseUrl(e.target.value)}
            placeholder="https://your-project-id.supabase.co"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="supabaseAnonKey">Supabase Anon Key</Label>
          <Input
            id="supabaseAnonKey"
            type="password"
            value={supabaseAnonKey}
            onChange={(e) => setSupabaseAnonKey(e.target.value)}
            placeholder="your-anon-key"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleClear}>
          Clear
        </Button>
        <Button onClick={handleSave}>Save Configuration</Button>
      </CardFooter>
    </Card>
  );
};

export default EnvVarsForm;
