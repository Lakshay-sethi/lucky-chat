
import React from 'react';
import { cn } from "@/lib/utils";
import { CircleDot } from "lucide-react";

interface BadgeProps {
  count: number;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ count, className }) => {
  if (count <= 0) return null;
  
  return (
    <div className={cn(
      "text-primary flex items-center justify-center",
      className
    )}>
      <CircleDot className="w-4 h-4 text-primary" />
    </div>
  );
};
