
import React, { createContext, useContext, useState } from 'react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useMessages } from '@/hooks/useMessages';
import { useUsers } from '@/hooks/useUsers';
import { ChatContextType } from '@/types/chat.types';

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useCurrentUser();
  const [isNewConversationOpen, setIsNewConversationOpen] = useState(false);
  
  const {
    allMessages,
    messages,
    selectedUser,
    setSelectedUser,
    sendMessage,
    markMessagesAsRead,
    getUnreadCount
  } = useMessages(currentUser);

  const { users, activeConversations, nonConversationUsers } = useUsers(currentUser, allMessages);

  return (
    <ChatContext.Provider
      value={{
        currentUser,
        selectedUser,
        users,
        messages,
        activeConversations,
        nonConversationUsers,
        setSelectedUser,
        sendMessage,
        markMessagesAsRead,
        getUnreadCount,
        isNewConversationOpen,
        setIsNewConversationOpen
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
