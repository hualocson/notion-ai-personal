"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { Atom, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MagicInput = () => {
  const [inputValue, setInputValue] = useState<string>("");
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2">
        <Atom
          className="size-5 animate-spin"
          style={{
            animationDuration: "2s",
          }}
        />
      </span>
      <Input
        className="h-14 rounded-full px-12"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter prompt"
      />
      <Button
        size={"icon"}
        className="absolute right-4 top-1/2 -translate-y-1/2 [&_svg]:size-5"
        variant={"ghost"}
        disabled={inputValue.trim() === ""}
      >
        <Send
          className={cn(
            "transition-all duration-300",
            inputValue.trim() !== "" && "-translate-x-0.5 rotate-45"
          )}
        />
      </Button>
    </div>
  );
};

export default MagicInput;
