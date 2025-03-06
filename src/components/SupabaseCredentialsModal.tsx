
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Eye, EyeOff } from "lucide-react";

interface SupabaseCredentialsModalProps {
  onCredentialsSubmit: (url: string, key: string) => void;
}

export const SupabaseCredentialsModal = ({ onCredentialsSubmit }: SupabaseCredentialsModalProps) => {
  const [open, setOpen] = useState(false);
  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseKey, setSupabaseKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  
  useEffect(() => {
    // Check if credentials are already in localStorage
    const storedUrl = localStorage.getItem("supabase_url");
    const storedKey = localStorage.getItem("supabase_anon_key");
    
    if (!storedUrl || !storedKey) {
      setOpen(true);
    } else {
      // If credentials exist, use them
      onCredentialsSubmit(storedUrl, storedKey);
    }
  }, [onCredentialsSubmit]);
  
  const handleSubmit = () => {
    if (!supabaseUrl || !supabaseKey) {
      toast({
        title: "Missing credentials",
        description: "Please enter both Supabase URL and Anon Key",
        variant: "destructive"
      });
      return;
    }
    
    // Store credentials in localStorage
    localStorage.setItem("supabase_url", supabaseUrl);
    localStorage.setItem("supabase_anon_key", supabaseKey);
    
    onCredentialsSubmit(supabaseUrl, supabaseKey);
    setOpen(false);
    
    toast({
      title: "Credentials saved",
      description: "Supabase credentials have been saved"
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Supabase Credentials</DialogTitle>
          <DialogDescription>
            Enter your Supabase project URL and Anon Key to connect to your database.
            These will be stored locally in your browser.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="supabase-url">Supabase URL</Label>
            <Input
              id="supabase-url"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              placeholder="https://your-project-id.supabase.co"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="supabase-key">Supabase Anon Key</Label>
            <div className="relative">
              <Input
                id="supabase-key"
                type={showKey ? "text" : "password"}
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                placeholder="your-anon-key"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Note: The Anon Key is safe to use in frontend code - it has limited permissions.
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={handleSubmit}>Save Credentials</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
