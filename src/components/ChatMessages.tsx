
import { useState, useEffect, useRef } from "react";
import { useChat } from "@/contexts/ChatContext";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import { MessageInput } from "./chat/MessageInput";
import { MessageGroup } from "./chat/MessageGroup";
import { ChatHeader } from "./chat/ChatHeader";

export const ChatMessages = () => {
  const { currentUser, selectedUser, messages, sendMessage, markMessagesAsRead } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mark messages as read when viewing the conversation
  useEffect(() => {
    if (selectedUser) {
      // Slight delay to ensure UI update
      const timer = setTimeout(() => {
        markMessagesAsRead();
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [selectedUser, messages, markMessagesAsRead]);

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups: { date: string; messages: any[] }[] = [];
    
    messages.forEach((message, index) => {
      const messageDate = parseISO(message.created_at);
      const dateString = format(messageDate, "yyyy-MM-dd");
      
      // Check if we need to create a new date group
      const lastGroup = groups.length > 0 ? groups[groups.length - 1] : null;
      if (!lastGroup || lastGroup.date !== dateString) {
        groups.push({
          date: dateString,
          messages: [message]
        });
      } else {
        lastGroup.messages.push(message);
      }
    });
    
    return groups;
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <p>Select a chat to start messaging</p>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate();

  return (
    <div className="flex-1 flex flex-col">
      <ChatHeader selectedUser={selectedUser} />

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-muted">
            <p>No messages yet. Say hello!</p>
          </div>
        ) : (
          messageGroups.map((group, groupIndex) => (
            <MessageGroup 
              key={group.date}
              date={group.date}
              messages={group.messages}
              currentUser={currentUser}
              selectedUser={selectedUser}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput onSendMessage={sendMessage} />
    </div>
  );
};
