"use client";

import { FC } from "react";

import formatAmount from "@/lib/format-amount";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import TransactionIcon from "@/components/icons/transctions-icon";

interface IProcessedPromptProps extends ITransaction {}

const ProcessedPrompt: FC<IProcessedPromptProps> = ({
  name,
  date,
  amount,
  account,
}) => {
  return (
    <Card className="w-full rounded-3xl">
      <CardHeader>
        <CardTitle className="flex w-full items-center justify-center">
          {/* <ReceiptText className="size-10" /> */}
          <TransactionIcon className="size-20" />
        </CardTitle>
        <CardDescription className="hidden"></CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center gap-1">
          <span className="text-xl font-bold">{name}</span>
          <span className="text-gray-400">{date}</span>
          <span className="my-2 text-4xl font-bold">
            {formatAmount(amount)}
          </span>
          <div className="flex w-full items-center justify-between gap-2 text-lg">
            <span>From</span>
            <span>{account}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="*:w-full">
        <Button size="lg" className="rounded-full">
          Add to notion
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProcessedPrompt;
