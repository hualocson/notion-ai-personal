"use client";

import { cn } from "@/lib/utils";

const AIIndicator = ({
  onClick,
  className = "",
}: {
  onClick?: () => void;
  className?: string;
}) => {
  return (
    <div
      onClick={onClick}
      className={cn("relative size-8 rounded-full", className)}
    >
      <span className="ai-sphere-box animate-rotate inset-0"></span>
      <span className="ai-sphere-box animate-rotate_rev inset-0"></span>
    </div>
  );
};

export default AIIndicator;
