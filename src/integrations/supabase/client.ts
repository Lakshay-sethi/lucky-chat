
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Get values from localStorage if available, otherwise from env vars
const getSupabaseUrl = () => localStorage.getItem('supabase_url') || import.meta.env.VITE_SUPABASE_URL;
const getSupabaseKey = () => localStorage.getItem('supabase_key') || import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseUrl = getSupabaseUrl();
let supabaseKey = getSupabaseKey();

if (!supabaseUrl || !supabaseKey) {
  console.warn('Missing Supabase credentials. Please set them in the credentials modal.');
}

// Create the Supabase client
let supabaseClient = createClient<Database>(
  supabaseUrl || '',
  supabaseKey || ''
);

// Export the supabase client
export const supabase = supabaseClient;

// Function to update the Supabase client with new credentials
export const updateSupabaseClient = (url: string, key: string) => {
  supabaseUrl = url;
  supabaseKey = key;
  supabaseClient = createClient<Database>(url, key);
  return supabaseClient;
};

// Helper functions for file upload
export const uploadFile = async (file: File, senderId: string, receiverId: string): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    
    // Create path with sender and receiver IDs for better organization
    const filePath = `users/${senderId}/conversations/${receiverId}/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, file);
      
    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      return null;
    }
    
    const { data } = supabase.storage
      .from('media')
      .getPublicUrl(filePath);
      
    return data.publicUrl;
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
