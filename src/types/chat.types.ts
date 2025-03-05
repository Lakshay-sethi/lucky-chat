
export type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
  file_url?: string | null;
  file_type?: "image" | "video" | "audio" | "document" | null;
};

export type ChatUser = {
  id: string;
  username: string;
  avatar_url: string;
  last_seen?: string;
};

export interface ChatContextType {
  currentUser: ChatUser | null;
  selectedUser: ChatUser | null;
  users: ChatUser[];
  messages: Message[];
  activeConversations: ChatUser[];
  nonConversationUsers: ChatUser[];
  setSelectedUser: (user: ChatUser | null) => void;
  sendMessage: (content: string, file?: File) => Promise<void>;
  markMessagesAsRead: () => Promise<void>;
  getUnreadCount: (userId: string) => number;
  isNewConversationOpen: boolean;
  setIsNewConversationOpen: (isOpen: boolean) => void;
}
