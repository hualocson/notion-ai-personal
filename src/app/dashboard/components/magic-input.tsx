"use client";

import { FC, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import AIIndicator from "./ai-indicator";

interface IMagicInputProps {
  onSubmit?: (inputValue: string) => void;
}

const MagicInput: FC<IMagicInputProps> = ({ onSubmit }) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [focusInput, setFocusInput] = useState<boolean>(false);

  const handleFocusInput = () => {
    setFocusInput(true);
    const input = inputRef.current;

    input?.focus();
  };

  useEffect(() => {
    const handleFocus = () => setFocusInput(true);
    const handleBlur = () => setFocusInput(false);

    const inputElement = inputRef.current;

    if (inputElement) {
      inputElement.addEventListener("focus", handleFocus);
      inputElement.addEventListener("blur", handleBlur);
    }

    return () => {
      if (inputElement) {
        inputElement.removeEventListener("focus", handleFocus);
        inputElement.removeEventListener("blur", handleBlur);
      }
    };
  }, []);

  return (
    <>
      <div
        className={cn(
          "relative flex flex-col items-center justify-center rounded-xl opacity-0 shadow",
          focusInput && "opacity-100"
        )}
      >
        <Textarea
          ref={inputRef}
          rows={1}
          style={{
            lineHeight: 2,
          }}
          onChange={() => {
            // Auto resize the textarea
            const textarea = inputRef.current;
            if (!textarea) return;

            setInputValue(textarea.value);

            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
          }}
          data-focus={focusInput}
          className={cn(
            "h-[48px] min-h-[48px] w-0 resize-none overflow-hidden rounded-2xl border-none pl-14 pr-8 shadow-none outline-none ring-0 focus-visible:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 data-[focus=true]:w-full"
          )}
          value={inputValue}
          placeholder="Enter prompt"
        />

        <Button
          size={"icon"}
          className="absolute bottom-0.5 right-2 -translate-y-1 [&_svg]:size-5"
          variant={"ghost"}
          disabled={inputValue.trim() === ""}
          onClick={() => {
            const value = inputValue;
            setInputValue("");
            onSubmit?.(value);
          }}
        >
          <Send
            className={cn(
              "transition-all duration-300",
              inputValue.trim() !== "" && "-translate-x-0.5 rotate-45"
            )}
          />
        </Button>
      </div>
      <div
        className={cn(
          "absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center transition-all duration-300",
          focusInput &&
            "left-1 top-[calc(100%-8px)] -translate-y-full translate-x-0"
        )}
      >
        <AIIndicator onClick={handleFocusInput} />
      </div>
    </>
  );
};

export default MagicInput;
