
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;


if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  throw new Error('Missing Supabase environment variables');
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Helper functions for file upload
export const uploadFile = async (file: File, senderId: string, receiverId: string): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    
    // Create path with sender and receiver IDs for better organization
    const filePath = `users/${senderId}/conversations/${receiverId}/${fileName}`;
    
    const { data, error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      return null;
    }

      // Generate signed URL
      const { data: { signedUrl }, error: signedUrlError } = await supabase.storage
        .from('media')
        .createSignedUrl(filePath, 6000000); // URL valid for 60 seconds

      
    return signedUrl;
  } catch (error) {
    console.error('Error in uploadFile:', error);
    return null;
  }
};

export const getFileType = (file: File): "image" | "video" | "audio" | "document" | null => {
  const fileType = file.type.split('/')[0];
  
  switch (fileType) {
    case 'image':
      return 'image';
    case 'video':
      return 'video';
    case 'audio':
      return 'audio';
    default:
      if (file.type.includes('pdf') || 
          file.type.includes('doc') || 
          file.type.includes('sheet') || 
          file.type.includes('presentation')) {
        return 'document';
      }
      return null;
  }
};
