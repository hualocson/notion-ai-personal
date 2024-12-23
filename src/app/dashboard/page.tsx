"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import AccountCarousel from "./components/account-carousel";
import AIIndicator from "./components/ai-indicator";
import DashboardContentLayout from "./components/dashboard-content-layout";
import MagicInput from "./components/magic-input";
import TransactionAIOutput from "./components/transaction-ai-output ";

const Dashboard = () => {
  const { data, isPending, isFetching } = useQuery({
    queryKey: ["accounts"],
    queryFn: () =>
      axios
        .get<{
          message: string;
          data: Array<{ account: string; accountId: string; balance: number }>;
        }>("/api/notion/account")
        .then((res) => res.data),
  });

  const [prompt, setPrompt] = useState<string>();
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
    setPrompt(inputValue);
    aiCallMutation.mutate(inputValue.trim());
  };

  const accounts = data?.data ?? [];

  return (
    <DashboardContentLayout headerText="Dashboard">
      {isPending || isFetching ? (
        <div className="inline-flex size-full min-h-[118px] items-center justify-center">
          <Loader2 className="size-4 animate-spin" />
        </div>
      ) : (
        <div className="container">
          <AccountCarousel data={accounts} />
          {/* <AccountListing data={data?.data ?? []} /> */}
        </div>
      )}

      <div className="container mt-6 flex w-full flex-col gap-4">
        {prompt && (
          <div className="flex w-full items-center gap-2 text-start">
            <div className="flex items-center gap-2">
              <span className={cn(aiCallMutation.isPending && "animate-pulse")}>
                {prompt}
              </span>
              {aiCallMutation.isPending && (
                <AIIndicator className="ml-4 size-6" />
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
        {output && <TransactionAIOutput data={output} />}
      </div>

      <div className="fixed inset-x-6 bottom-12 mx-auto max-w-screen-sm">
        <MagicInput onSubmit={handleOnCallAI} />
      </div>
    </DashboardContentLayout>
  );
};

export default Dashboard;
