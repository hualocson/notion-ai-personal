"use client";

import { useState } from "react";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Loader2, RotateCcw, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface IResponse {
  date: string;
  name: string;
  amount: number;
  account: string;
}

const ExpenseTransactionPage = () => {
  const [inputValue, setInputValue] = useState("");
  const [output, setOutput] = useState<IResponse>();
  const aiCallMutation = useMutation({
    mutationFn: () =>
      axios.post<{
        status: string;
        processed: IResponse;
      }>("/api/gemini", {
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
      axios.post<{ status: string; id: string }>("/api/notion/expense", {
        ...output,
      }),
    onSuccess: (res) => toast(res.data.id),
  });

  const handleOnCallAI = () => {
    if (inputValue.trim() === "") {
      toast.error("Invalid input");
      return;
    }
    setOutput(undefined);
    aiCallMutation.mutate();
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <Card className="w-full max-w-screen-sm">
        <CardHeader>
          <CardTitle>Expense</CardTitle>
          <CardDescription>Gen + Add expense transaction</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="relative w-full">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="pr-4"
              />
              {inputValue !== "" && (
                <Button
                  size={"icon"}
                  onClick={() => {
                    setInputValue("");
                  }}
                  variant={"ghost"}
                  className="absolute right-2 top-1/2 size-6 -translate-y-1/2"
                >
                  <X className="size-4" />
                </Button>
              )}
            </div>
            {inputValue.trim() !== "" && (
              <Button
                size={"icon"}
                onClick={() => {
                  handleOnCallAI();
                }}
              >
                <RotateCcw className="size-5" />
              </Button>
            )}
          </div>
          {output && (
            <div className="mt-4 flex flex-col gap-4">
              <span>Processed</span>
              <div className="flex items-center gap-2">
                <span>Date:</span>
                <span>{output.date}</span>
              </div>

              <div className="flex items-center gap-2">
                <span>Name:</span>
                <span>{output.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Amount:</span>
                <span>{output.amount}</span>
              </div>

              <div className="flex items-center gap-2">
                <span>Account:</span>
                <span>{output.account}</span>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => {
              if (output) {
                addNewPageMutation.mutate();
              } else {
                handleOnCallAI();
              }
            }}
            className="w-full"
            disabled={aiCallMutation.isPending || addNewPageMutation.isPending}
          >
            {aiCallMutation.isPending || addNewPageMutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : output ? (
              "Add to notion"
            ) : (
              "Generate output"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ExpenseTransactionPage;
