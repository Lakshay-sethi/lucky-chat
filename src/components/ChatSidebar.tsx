import { Search, Plus, Info } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

interface User {
  id: string;
  name: string;
  avatar: string;
  status: string;
}

const users: User[] = [
  { id: "1", name: "Buke", avatar: "/avatars/1.png", status: "hgfjghjj" },
  { id: "2", name: "Joseph", avatar: "/avatars/2.png", status: "hello!" },
  { id: "3", name: "maryam", avatar: "/avatars/3.png", status: "hh" },
  { id: "4", name: "Matt", avatar: "/avatars/4.png", status: "Helo" },
];

export const ChatSidebar = () => {
  return (
    <div className="w-80 h-screen glass p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <img src="/avatars/elin.png" alt="Elin" />
          </Avatar>
          <span className="font-medium">Elin</span>
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
              <img src={user.avatar} alt={user.name} />
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