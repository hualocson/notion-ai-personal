"use client";

import { useState } from "react";

import Link from "next/link";

import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link2, Loader2, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import AccountCarousel from "./components/account-carousel";
import AIIndicator from "./components/ai-indicator";
import DashboardContentLayout from "./components/dashboard-content-layout";
import MagicInput from "./components/magic-input";
import TransactionAIOutput from "./components/transaction-ai-output ";

const Dashboard = () => {
  const { data, isPending } = useQuery({
    queryKey: ["accounts"],
    queryFn: () =>
      axios
        .get<{
          message: string;
          data: Array<{ account: string; accountId: string; balance: number }>;
        }>("/api/notion/account")
        .then((res) => res.data),
  });

  const [promptData, setPromptData] = useState<{
    prompt?: string;
    url?: string;
  }>();
  const [output, setOutput] = useState<IGeminiOutput>();
  const aiCallMutation = useMutation({
    mutationFn: (inputValue: string) =>
      axios.post<{
        status: string;
        processed: IGeminiOutput;
      }>("/api/gemini/supper", {
        prompt: inputValue,
      }),
    onSuccess: (data) => {
      const res = data.data;
      if (res) {
        setOutput(res.processed);
      }
    },
  });

  const handleOnCallAI = (inputValue: string) => {
    if (inputValue.trim() === "") {
      toast.error("Invalid input");
      return;
    }
    setOutput(undefined);
    setPromptData({
      prompt: inputValue,
      url: undefined,
    });
    aiCallMutation.mutate(inputValue.trim());
  };

  const accounts = data?.data ?? [];

  const onAddPageSuccess = (url: string) => {
    setPromptData((prev) => ({ ...prev, url }));
  };

  return (
    <DashboardContentLayout headerText="Dashboard">
      {isPending ? (
        <div className="inline-flex size-full min-h-[118px] items-center justify-center">
          <Loader2 className="size-4 animate-spin" />
        </div>
      ) : (
        <div className="container">
          <AccountCarousel data={accounts} />
        </div>
      )}

      <div className="container mt-6 flex w-full flex-col gap-4">
        {promptData && (
          <div className="flex w-full items-center gap-2 text-start">
            <div className="flex items-center gap-2">
              <span className={cn(aiCallMutation.isPending && "animate-pulse")}>
                {promptData.prompt}
              </span>
              {promptData.url && (
                <Link
                  href={promptData.url}
                  target="_blank"
                  className="flex size-8 items-center justify-center rounded-lg bg-teal-300/10 text-teal-400"
                >
                  <Link2 className="size-4" />
                </Link>
              )}
              {aiCallMutation.isPending && (
                <AIIndicator className="ml-4 size-6" />
              )}
              {promptData.prompt && !aiCallMutation.isPending && (
                <Button
                  size={"icon"}
                  className="size-8 bg-amber-300/10 text-amber-600 hover:bg-amber-300/40 [&_svg]:size-4"
                  onClick={() => handleOnCallAI(promptData.prompt!)}
                >
                  <RotateCcw />
                </Button>
              )}
            </div>
          </div>
        )}
        {output && (
          <TransactionAIOutput
            data={output}
            onAddPageSuccess={onAddPageSuccess}
          />
        )}
      </div>

      <div className="fixed inset-x-6 bottom-12 mx-auto max-w-screen-sm">
        <MagicInput onSubmit={handleOnCallAI} />
      </div>
    </DashboardContentLayout>
  );
};

export default Dashboard;
