
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
};

type ChatUser = {
  id: string;
  username: string;
  avatar_url: string;
  last_seen?: string;
};

interface ChatContextType {
  currentUser: ChatUser | null;
  selectedUser: ChatUser | null;
  users: ChatUser[];
  messages: Message[];
  setSelectedUser: (user: ChatUser | null) => void;
  sendMessage: (content: string) => Promise<void>;
  markMessagesAsRead: () => Promise<void>;
  getUnreadCount: (userId: string) => number;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<ChatUser | null>(null);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

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
          // Update currentUser if it's the one being modified
          if (currentUser?.id === payload.new.id) {
            setCurrentUser(prev => ({ ...prev, ...payload.new } as ChatUser));
          }
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
  }, [currentUser]);

  // Fetch messages when selectedUser changes
  useEffect(() => {
    if (!currentUser || !selectedUser) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      const { data, error } = await (supabase
        .from('messages') as any)
        .select('*')
        .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      // Filter messages for the selected conversation
      const conversationMessages = (data as any[]).filter(
        (msg: Message) => (msg.sender_id === currentUser.id && msg.receiver_id === selectedUser.id) || 
               (msg.sender_id === selectedUser.id && msg.receiver_id === currentUser.id)
      );
      
      setMessages(conversationMessages as Message[]);
    };

    fetchMessages();

    // Subscribe to new messages
    const messageChannel = supabase
      .channel('messages-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages'
      }, async (payload) => {
        const message = payload.new as Message;
        
        // Only update if the message belongs to the current conversation
        if ((message.sender_id === currentUser.id && message.receiver_id === selectedUser.id) ||
            (message.sender_id === selectedUser.id && message.receiver_id === currentUser.id)) {
          
          if (payload.eventType === 'INSERT') {
            setMessages(current => [...current, message]);
          } else if (payload.eventType === 'UPDATE') {
            setMessages(current =>
              current.map(msg => msg.id === message.id ? message : msg)
            );
          } else if (payload.eventType === 'DELETE') {
            setMessages(current =>
              current.filter(msg => msg.id !== payload.old.id)
            );
          }
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(messageChannel);
    };
  }, [currentUser, selectedUser]);

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

  // Mark messages as read
  const markMessagesAsRead = async () => {
    if (!currentUser || !selectedUser) return;

    const unreadMessages = messages.filter(
      msg => msg.sender_id === selectedUser.id && msg.receiver_id === currentUser.id && !msg.read
    );

    if (unreadMessages.length === 0) return;

    const { error } = await (supabase
      .from('messages') as any)
      .update({ read: true })
      .in('id', unreadMessages.map(msg => msg.id));

    if (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  // Get unread messages count for a specific user
  const getUnreadCount = (userId: string): number => {
    if (!currentUser) return 0;
    
    return messages.filter(
      msg => msg.sender_id === userId && msg.receiver_id === currentUser.id && !msg.read
    ).length;
  };

  return (
    <ChatContext.Provider
      value={{
        currentUser,
        selectedUser,
        users,
        messages,
        setSelectedUser,
        sendMessage,
        markMessagesAsRead,
        getUnreadCount
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
