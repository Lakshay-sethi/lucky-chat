import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatMessages } from "@/components/ChatMessages";

const Index = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <ChatSidebar />
      <ChatMessages />
    </div>
  );
};

export default Index;