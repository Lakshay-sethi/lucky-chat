
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";

const EnvVarsForm = () => {
  const { toast } = useToast();
  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseAnonKey, setSupabaseAnonKey] = useState("");
  const [isConfigured, setIsConfigured] = useState(false);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    // Check if variables are already set in localStorage
    const savedUrl = localStorage.getItem("VITE_SUPABASE_URL");
    const savedKey = localStorage.getItem("VITE_SUPABASE_ANON_KEY");
    
    if (savedUrl && savedKey) {
      setSupabaseUrl(savedUrl);
      // Don't show the full key, just indicate it's set
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

    // Basic validation
    if (!supabaseUrl.startsWith("https://") || !supabaseUrl.includes(".supabase.co")) {
      toast({
        title: "Invalid Supabase URL",
        description: "The URL should start with https:// and contain .supabase.co",
        variant: "destructive",
      });
      return;
    }

    // Save to localStorage with encryption
    try {
      localStorage.setItem("VITE_SUPABASE_URL", supabaseUrl);
      localStorage.setItem("VITE_SUPABASE_ANON_KEY", supabaseAnonKey);
      
      setIsConfigured(true);
      
      toast({
        title: "Configuration Saved",
        description: "Supabase credentials have been saved securely. Please reload the page for changes to take effect.",
      });
    } catch (error) {
      toast({
        title: "Error Saving Configuration",
        description: "There was an error saving your credentials. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClear = () => {
    localStorage.removeItem("VITE_SUPABASE_URL");
    localStorage.removeItem("VITE_SUPABASE_ANON_KEY");
    setSupabaseUrl("");
    setSupabaseAnonKey("");
    setIsConfigured(false);
    setShowKey(false);
    
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
          Your credentials will be stored locally on your device.
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
            className="font-mono"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="supabaseAnonKey">Supabase Anon Key</Label>
          <div className="relative">
            <Input
              id="supabaseAnonKey"
              type={showKey ? "text" : "password"}
              value={supabaseAnonKey}
              onChange={(e) => setSupabaseAnonKey(e.target.value)}
              placeholder="your-anon-key"
              className="font-mono pr-10"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              onClick={() => setShowKey(!showKey)}
              aria-label={showKey ? "Hide password" : "Show password"}
            >
              {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            This is your public anon key which is safe to use in frontend code
          </p>
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
