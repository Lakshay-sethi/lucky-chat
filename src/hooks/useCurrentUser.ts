
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChatUser } from '@/types/chat.types';

export const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState<ChatUser | null>(null);
  
  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await (supabase
          .from('profiles') as any)
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching current user:', error);
          return;
        }

        setCurrentUser(data as ChatUser);
      }
    };

    fetchCurrentUser();
  }, []);

  // Update current user when profile changes
  useEffect(() => {
    if (!currentUser) return;
    
    const channel = supabase
      .channel('current-user-changes')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'profiles',
        filter: `id=eq.${currentUser.id}`
      }, (payload) => {
        setCurrentUser(prev => ({ ...prev, ...payload.new } as ChatUser));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser]);

  return { currentUser };
};
