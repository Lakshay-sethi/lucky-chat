
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateSupabaseClient } from '@/integrations/supabase/client';

interface SupabaseCredentialsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCredentialsSubmit: () => void;
}

const SupabaseCredentialsModal: React.FC<SupabaseCredentialsModalProps> = ({
  open,
  onOpenChange,
  onCredentialsSubmit
}) => {
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');

  useEffect(() => {
    // Load saved values from localStorage if they exist
    const savedUrl = localStorage.getItem('supabase_url');
    const savedKey = localStorage.getItem('supabase_anon_key');
    
    if (savedUrl) setSupabaseUrl(savedUrl);
    if (savedKey) setSupabaseKey(savedKey);
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (supabaseUrl && supabaseKey) {
      // Save to localStorage
      localStorage.setItem('supabase_url', supabaseUrl);
      localStorage.setItem('supabase_anon_key', supabaseKey);
      
      // Update the Supabase client with new credentials
      updateSupabaseClient(supabaseUrl, supabaseKey);
      
      // Close modal and notify parent
      onCredentialsSubmit();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Supabase Credentials</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="supabase-url">Supabase URL</Label>
              <Input
                id="supabase-url"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="https://your-project.supabase.co"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="supabase-key">Supabase Anon Key</Label>
              <Input
                id="supabase-key"
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                placeholder="eyJh..."
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Credentials</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SupabaseCredentialsModal;
