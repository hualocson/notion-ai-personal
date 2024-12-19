"use client";

import { FC } from "react";

import formatAmount from "@/lib/format-amount";
import getAccountId from "@/lib/get-account-id";
import { ArrowRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import ACCOUNT_STYLE from "./account-style";

interface IProcessedPromptProps {
  data: ITransfer;
  onConfirm?: () => void;
  isLoading?: boolean;
}

const TransferAIOutput: FC<IProcessedPromptProps> = ({
  data: { name, date, amount, fromAccount, toAccount },
  onConfirm = () => {},
  isLoading,
}) => {
  return (
    <div
      style={
        {
          "--color-bg": ACCOUNT_STYLE[getAccountId(fromAccount)],
          "--color-bg-trans": ACCOUNT_STYLE[getAccountId(fromAccount)] + "4d",
        } as React.CSSProperties
      }
      className="relative w-full"
    >
      <span className="absolute left-1/2 h-20 w-2/3 -translate-x-1/2 rounded-full bg-[--color-bg] blur-xl"></span>
      <div className="relative inline-flex w-full flex-col items-center rounded-3xl bg-gradient-to-b from-[--color-bg-trans] to-white/20 p-2 shadow-lg ring-1 ring-white/25 backdrop-blur-md">
        {/* description and account display */}
        <div className="flex w-full flex-col items-center justify-between p-4">
          <div className="flex w-full items-center justify-between">
            <span className="inline-block bg-gradient-to-r from-slate-600 to-slate-300 bg-clip-text text-3xl font-bold uppercase text-transparent">
              {fromAccount}
            </span>
            <ArrowRight className="size-8" />
            <span className="inline-block bg-gradient-to-r from-slate-600 to-slate-300 bg-clip-text text-3xl font-bold uppercase text-transparent">
              {toAccount}
            </span>
          </div>

          <div className="w-full text-start">
            <p className="text-gray-500">{name}</p>
          </div>
        </div>
        {/* display amount, date and button */}
        <div className="flex w-full items-center justify-between rounded-2xl bg-card p-4 pb-8 ring-1 ring-gray-300/10 backdrop-blur-md">
          <span className="text-2xl font-bold">{formatAmount(amount)}</span>
          <span className="text-gray-400">{date}</span>
        </div>
        <Button
          size={"lg"}
          className="absolute bottom-1 translate-y-1/2 rounded-full ring ring-background ring-offset-2 transition-[width] duration-500 disabled:opacity-100"
          disabled={isLoading}
          onClick={onConfirm}
        >
          {isLoading ? (
            <Loader2 className="size-4 animate-spin text-gray-500" />
          ) : (
            "Add to notion"
          )}
        </Button>
      </div>
    </div>
  );
};

export default TransferAIOutput;
