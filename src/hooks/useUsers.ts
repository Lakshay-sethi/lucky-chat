
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChatUser, Message } from '@/types/chat.types';

export const useUsers = (currentUser: ChatUser | null, allMessages: Message[]) => {
  const [users, setUsers] = useState<ChatUser[]>([]);
  
  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await (supabase
        .from('profiles') as any)
        .select('*');

      if (error) {
        console.error('Error fetching users:', error);
        return;
      }

      setUsers(data as ChatUser[] || []);
    };

    fetchUsers();

    // Subscribe to changes in profiles
    const channel = supabase
      .channel('profiles-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'profiles'
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setUsers(current => [...current, payload.new as ChatUser]);
        } else if (payload.eventType === 'UPDATE') {
          setUsers(current =>
            current.map(user =>
              user.id === payload.new.id ? { ...user, ...payload.new } as ChatUser : user
            )
          );
        } else if (payload.eventType === 'DELETE') {
          setUsers(current =>
            current.filter(user => user.id !== payload.old.id)
          );
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Get users with active conversations
  const activeConversations = users.filter(user => {
    if (!currentUser || user.id === currentUser.id) return false;
    
    return allMessages.some(
      msg => (msg.sender_id === currentUser.id && msg.receiver_id === user.id) || 
             (msg.sender_id === user.id && msg.receiver_id === currentUser.id)
    );
  });

  // Get users without active conversations
  const nonConversationUsers = users.filter(user => {
    if (!currentUser || user.id === currentUser.id) return false;
    
    return !allMessages.some(
      msg => (msg.sender_id === currentUser.id && msg.receiver_id === user.id) || 
             (msg.sender_id === user.id && msg.receiver_id === currentUser.id)
    );
  });

  return { users, activeConversations, nonConversationUsers };
};
