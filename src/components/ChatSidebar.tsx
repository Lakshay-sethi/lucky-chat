import { Search, Plus } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

interface User {
  id: string;
  name: string;
  avatar: string;
  status: string;
}

const users: User[] = [
  { 
    id: "1", 
    name: "Sarah Parker", 
    avatar: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158", 
    status: "Working on the new design" 
  },
  { 
    id: "2", 
    name: "Mike Johnson", 
    avatar: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952", 
    status: "In a meeting" 
  },
  { 
    id: "3", 
    name: "Emma Wilson", 
    avatar: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d", 
    status: "Available" 
  },
  { 
    id: "4", 
    name: "Tom Anderson", 
    avatar: "https://images.unsplash.com/photo-1582562124811-c09040d0a901", 
    status: "Busy" 
  },
];

export const ChatSidebar = () => {
  return (
    <div className="w-80 h-screen glass p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <img 
              src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7" 
              alt="Me" 
              className="object-cover"
            />
          </Avatar>
          <span className="font-medium">Me</span>
        </div>
        <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
          <Plus className="w-5 h-5" />
        </button>
      </div>
      
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-white/5 rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-1 ring-white/20 transition-all"
        />
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto scrollbar-hide">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
          >
            <Avatar className="w-10 h-10">
              <img src={user.avatar} alt={user.name} className="object-cover" />
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-muted truncate">{user.status}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};