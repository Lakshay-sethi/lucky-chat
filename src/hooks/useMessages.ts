
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Message, ChatUser } from '@/types/chat.types';

export const useMessages = (currentUser: ChatUser | null) => {
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);

  // Fetch all messages for the current user
  useEffect(() => {
    if (!currentUser) {
      setAllMessages([]);
      return;
    }

    const fetchAllMessages = async () => {
      const { data, error } = await (supabase
        .from('messages') as any)
        .select('*')
        .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching all messages:', error);
        return;
      }
      
      setAllMessages(data as Message[]);
    };

    fetchAllMessages();

    // Subscribe to message changes
    const messageChannel = supabase
      .channel('all-messages-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages'
      }, async (payload) => {
        const message = payload.new as Message;
        
        // Only update if the message is related to the current user
        if (message.sender_id === currentUser.id || message.receiver_id === currentUser.id) {
          if (payload.eventType === 'INSERT') {
            setAllMessages(current => [...current, message]);
          } else if (payload.eventType === 'UPDATE') {
            setAllMessages(current =>
              current.map(msg => msg.id === message.id ? message : msg)
            );
          } else if (payload.eventType === 'DELETE') {
            setAllMessages(current =>
              current.filter(msg => msg.id !== payload.old.id)
            );
          }
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(messageChannel);
    };
  }, [currentUser]);

  // Filter messages for the selected conversation
  useEffect(() => {
    if (!currentUser || !selectedUser) {
      setMessages([]);
      return;
    }

    const conversationMessages = allMessages.filter(
      (msg: Message) => (msg.sender_id === currentUser.id && msg.receiver_id === selectedUser.id) || 
              (msg.sender_id === selectedUser.id && msg.receiver_id === currentUser.id)
    );
    
    setMessages(conversationMessages);
  }, [currentUser, selectedUser, allMessages]);

  // Send message
  const sendMessage = async (content: string) => {
    if (!currentUser || !selectedUser || !content.trim()) return;

    const newMessage = {
      sender_id: currentUser.id,
      receiver_id: selectedUser.id,
      content,
      created_at: new Date().toISOString(),
      read: false
    };

    const { error } = await (supabase
      .from('messages') as any)
      .insert([newMessage]);

    if (error) {
      console.error('Error sending message:', error);
    }
  };

  const markMessagesAsRead = async () => {
    if (!currentUser || !selectedUser) {
      console.log('No current user or selected user');
      return;
    }

    const unreadMessages = messages.filter(
      msg => msg.sender_id === selectedUser.id && 
             msg.receiver_id === currentUser.id && 
             !msg.read
    );

    console.log('Unread messages found:', unreadMessages);
    
    if (unreadMessages.length === 0) {
      console.log('No unread messages to mark');
      return;
    }

    const messageIds = unreadMessages.map(msg => msg.id);
    console.log('Message IDs to update:', messageIds);

    const { error } = await (supabase
      .from('messages') as any)
      .update({ read: true })
      .in('id', messageIds);

    if (error) {
      console.error('Error marking messages as read:', error);
    } else {
      console.log('Successfully marked messages as read');
    }
  };

  // Get unread messages count for a specific user
  const getUnreadCount = (userId: string): number => {
    if (!currentUser) return 0;
    
    return allMessages.filter(
      msg => msg.sender_id === userId && msg.receiver_id === currentUser.id && !msg.read
    ).length;
  };

  return {
    allMessages,
    messages,
    selectedUser,
    setSelectedUser,
    sendMessage,
    markMessagesAsRead,
    getUnreadCount
  };
};
