
import React from 'react';
import { cn } from "@/lib/utils";

interface BadgeProps {
  count: number;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ count, className }) => {
  if (count <= 0) return null;
  
  return (
    <div className={cn(
      "bg-primary text-white text-xs font-medium rounded-full px-2 py-0.5 min-w-5 flex items-center justify-center",
      className
    )}>
      {count > 99 ? '99+' : count}
    </div>
  );
};
