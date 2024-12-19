"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Loader2, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import DashboardContentLayout from "../components/dashboard-content-layout";
import MagicInput from "../components/magic-input";
import ProcessedPrompt from "../components/processed-prompt";

const TransferPage = () => {
  const [prompt, setPrompt] = useState<string>();
  const [output, setOutput] = useState<ITransfer>();
  const aiCallMutation = useMutation({
    mutationFn: (inputValue: string) =>
      axios.post<{
        status: string;
        processed: ITransfer;
      }>("/api/gemini/transfer", {
        prompt: inputValue,
      }),
    onSuccess: (data) => {
      const res = data.data;
      if (res) {
        setOutput(res.processed);
      }
    },
  });

  const addNewPageMutation = useMutation({
    mutationFn: () =>
      axios.post<{ status: string; id: string }>("/api/notion/transfer", {
        ...output,
      }),
    onSuccess: (res) => {
      toast(res.data.id);
      setOutput(undefined);
      setPrompt(undefined);
    },
  });

  const handleOnCallAI = (inputValue: string) => {
    if (inputValue.trim() === "") {
      toast.error("Invalid input");
      return;
    }
    setOutput(undefined);
    setPrompt(inputValue);
    aiCallMutation.mutate(inputValue.trim());
  };

  const handleOnAdd = () => {
    addNewPageMutation.mutate();
  };

  return (
    <DashboardContentLayout headerText="Transfer">
      <div className="w-full">
        <MagicInput onSubmit={handleOnCallAI} />
      </div>
      <div className="flex w-full flex-col gap-8">
        {output && (
          <ProcessedPrompt
            data={output}
            onConfirm={handleOnAdd}
            isLoading={addNewPageMutation.isPending}
            type="transfer"
          />
        )}
        {prompt && (
          <div className="flex w-full items-center gap-2 px-4 text-start">
            <div className="flex items-center gap-2">
              <span className={cn(aiCallMutation.isPending && "animate-pulse")}>
                {prompt}
              </span>
              {aiCallMutation.isPending && (
                <Loader2 className="size-4 animate-spin" />
              )}
              {prompt && !aiCallMutation.isPending && (
                <Button
                  size={"icon"}
                  className="size-6 bg-amber-300/10 text-amber-600 hover:bg-amber-300/40 [&_svg]:size-3"
                  onClick={() => handleOnCallAI(prompt)}
                >
                  <RotateCcw />
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardContentLayout>
  );
};

export default TransferPage;
