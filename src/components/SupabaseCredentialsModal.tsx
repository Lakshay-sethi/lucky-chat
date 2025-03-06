
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Key } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SupabaseCredentialsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCredentialsSubmit: (url: string, key: string) => void;
}

const SupabaseCredentialsModal = ({ open, onOpenChange, onCredentialsSubmit }: SupabaseCredentialsModalProps) => {
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    // Load values from localStorage if they exist
    const savedUrl = localStorage.getItem('supabase_url');
    const savedKey = localStorage.getItem('supabase_key');
    
    if (savedUrl) setSupabaseUrl(savedUrl);
    if (savedKey) setSupabaseKey(savedKey);
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!supabaseUrl.trim() || !supabaseKey.trim()) {
      toast({
        title: "Error",
        description: "Both Supabase URL and Anon Key are required",
        variant: "destructive",
      });
      return;
    }

    // Save to localStorage
    localStorage.setItem('supabase_url', supabaseUrl);
    localStorage.setItem('supabase_key', supabaseKey);
    
    onCredentialsSubmit(supabaseUrl, supabaseKey);
    toast({
      title: "Success",
      description: "Supabase credentials have been saved",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Supabase Credentials</DialogTitle>
          <DialogDescription>
            Enter your Supabase project URL and anon/public key to connect to your Supabase instance.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="supabase-url">Supabase URL</Label>
            <Input
              id="supabase-url"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              placeholder="https://your-project.supabase.co"
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="supabase-key">Supabase Anon Key</Label>
            <div className="flex relative">
              <Input
                id="supabase-key"
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                type={showKey ? "text" : "password"}
                placeholder="your-anon-key"
                className="w-full pr-10"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button type="submit" className="flex items-center gap-2">
              <Key size={16} />
              Save Credentials
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SupabaseCredentialsModal;
