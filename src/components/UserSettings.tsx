import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface UserSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: { id: string; username: string; avatar_url: string } | null;
  onUserUpdate: () => void;
}

interface Profile {
  id: string;
  username: string;
  avatar_url: string;
  updated_at: string;
}


export const UserSettingsModal = ({ isOpen, onClose, currentUser, onUserUpdate }: UserSettingsModalProps) => {
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Update state when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.username || "");
      setAvatarUrl(currentUser.avatar_url || "");
    }
  }, [currentUser]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      
      // First, delete the old avatar if it exists
      if (currentUser?.avatar_url) {
        const oldAvatarPath = currentUser.avatar_url.split('/').pop();
        if (oldAvatarPath) {
          await supabase.storage
            .from('user_avatars')
            .remove([oldAvatarPath]);
        }
      }

      // Upload new image to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${currentUser?.id}-${Math.random()}.${fileExt}`;
      
      const { data, error: uploadError } = await supabase.storage
        .from('user_avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Generate signed URL
    const { data: { signedUrl }, error: signedUrlError } = await supabase.storage
      .from('user_avatars')
      .createSignedUrl(fileName, 6000000); // URL valid for 60 seconds

    if (signedUrlError) throw signedUrlError;

    console.log("Signed URL:", signedUrl);
    setAvatarUrl(signedUrl);
      
      
    } catch (error: unknown) {
      toast({
        title: "Error uploading avatar",
        description: (error as Error).message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      // Get the current user's ID from auth
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("No authenticated user found");
      console.log("Image url:", avatarUrl);
      // Update user profile
      const updateData = {
        username: name,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      };
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (updateError) throw updateError;

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });

      onUserUpdate(); // Refresh user data
      onClose(); // Close modal
    } catch (error: unknown) {
      toast({
        title: "Error updating profile",
        description: (error as Error).message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="w-24 h-24">
              <img
                src={avatarUrl || "https://placeholder.com/avatar"}
                alt={name}
                className="object-cover w-full h-full"
              />
            </Avatar>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                id="avatar-upload"
              />
              <Label
                htmlFor="avatar-upload"
                className="cursor-pointer bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
              >
                Change Avatar
              </Label>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>

        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
