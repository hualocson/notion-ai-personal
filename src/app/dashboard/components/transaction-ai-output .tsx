"use client";

import { FC, useState } from "react";

import formatAmount from "@/lib/format-amount";
import getAccountId from "@/lib/get-account-id";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  ArrowLeftRight,
  ArrowRight,
  Loader2,
  Rotate3D,
  Shrub,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import ACCOUNT_STYLE from "./account-style";
import TransactionDrawer from "./transaction-drawer";

dayjs.extend(relativeTime);
dayjs.extend(isToday);

interface IProcessedPromptProps {
  data: IGeminiOutput;
  onAddPageSuccess: (url: string) => void;
}

const ROUTE = {
  TRANSFER: "/api/notion/transfer",
  EXPENSE: "/api/notion/expense",
  INCOME: "/api/notion/income",
} as const;

const TransactionAIOutput: FC<IProcessedPromptProps> = ({
  data,
  onAddPageSuccess,
}) => {
  const [processedData, setProcessedData] = useState<IGeminiOutput | null>(
    data
  );

  const queryClient = useQueryClient();

  const addNewPageMutation = useMutation({
    mutationFn: ({
      data,
      url,
    }: {
      url: string;
      data: IGeminiOutput | ITransaction;
    }) =>
      axios.post<{ status: string; id: string; url: string }>(url, {
        ...data,
      }),
    onSuccess: (res) => {
      toast.success("Transaction added successfully");
      setProcessedData(null);
      onAddPageSuccess(res.data.url);
    },
    onMutate: async (updatedItem) => {
      const queryKey = ["accounts"];
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      const { data, url } = updatedItem;
      const amount = data.amount;
      let updatedAccounts: Array<{
        accountId: string;
        amount: number;
      }>;
      let message = "";

      if (url === ROUTE.TRANSFER) {
        const fromAccount = (data as IGeminiOutput).fromAccount;
        const toAccount = (data as IGeminiOutput).toAccount;
        if (toAccount) {
          updatedAccounts = [
            {
              accountId: getAccountId(fromAccount),
              amount: -amount,
            },
            {
              accountId: getAccountId(toAccount),
              amount,
            },
          ];

          message = `Transfer ${amount} from ${fromAccount} to ${toAccount}`;
        }
      } else if (url === ROUTE.EXPENSE) {
        const account = (data as ITransaction).account;
        updatedAccounts = [
          {
            accountId: getAccountId(account),
            amount: -amount,
          },
        ];
        message = `Expense ${amount} from ${account}`;
      } else {
        const account = (data as ITransaction).account;
        updatedAccounts = [
          {
            accountId: getAccountId(account),
            amount,
          },
        ];

        message = `Income ${amount} to ${account}`;
      }

      // Snapshot the previous value
      const previousItems = queryClient.getQueryData<
        unknown,
        string[],
        {
          message: string;
          data: Array<{ account: string; accountId: string; balance: number }>;
        }
      >(queryKey);
      toast.info(message);

      // Optimistically update the cache
      queryClient.setQueryData(
        queryKey,
        (oldItems: {
          message: string;
          data: Array<{ account: string; accountId: string; balance: number }>;
        }) => ({
          message: oldItems.message,
          data: oldItems.data.map((item) => {
            const updatedAccount = updatedAccounts.find(
              (acc) => acc.accountId === item.accountId
            );
            if (updatedAccount) {
              return {
                ...item,
                balance: item.balance + updatedAccount.amount,
              };
            }
            return item;
          }),
        })
      );

      return { previousItems };
    },
    onError: (err, updatedItem, context) => {
      // Rollback on error

      console.log({ err, updatedItem, context });
      toast.error("Transaction failed. Rollback initiated");

      if (context) {
        queryClient.setQueryData(["accounts"], context.previousItems);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["accounts"],
        refetchType: "all",
      });
    },
  });

  const onAddTransfer = () => {
    addNewPageMutation.mutate({
      data,
      url: ROUTE.TRANSFER,
    });
  };

  const onAddExpense = () => {
    addNewPageMutation.mutate({
      data: {
        amount: data.amount,
        name: data.name,
        account: data.fromAccount,
        date: data.date,
      } as ITransaction,
      url: ROUTE.EXPENSE,
    });
  };

  const onAddIncome = () => {
    addNewPageMutation.mutate({
      data: {
        amount: data.amount,
        name: data.name,
        account: data.fromAccount,
        date: data.date,
      } as ITransaction,
      url: ROUTE.INCOME,
    });
  };

  if (!processedData) return null;

  const { fromAccount, toAccount, amount, name, date } = processedData;

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
            <span className="inline-block text-2xl font-bold uppercase text-slate-600">
              {fromAccount}
            </span>
            {toAccount && (
              <>
                <ArrowRight className="size-6" />
                <span className="inline-block text-2xl font-bold uppercase text-slate-600">
                  {toAccount}
                </span>
              </>
            )}
          </div>

          <div className="w-full text-start">
            <p className="text-gray-500">{name}</p>
          </div>
        </div>
        {/* display amount, date and button */}
        <div className="flex w-full items-center justify-between rounded-2xl bg-card p-4 pb-8 ring-1 ring-gray-300/10 backdrop-blur-md">
          <span className="text-2xl font-bold">{formatAmount(amount)}</span>
          <span className="text-gray-400">
            {date}
            {` (${dayjs(date).isToday() ? "today" : dayjs(date).fromNow(false)})`}
          </span>
        </div>
        <div className="absolute bottom-1 flex translate-y-1/2 items-center gap-2 rounded-xl bg-card p-2 shadow">
          <Button
            size={"icon"}
            className="rounded-full bg-[#FF8A8A1a] text-[#FF8A8A] duration-500 hover:bg-[#FF8A8A40] disabled:bg-slate-400 disabled:text-slate-800 disabled:opacity-40"
            disabled={!!processedData.toAccount || addNewPageMutation.isPending}
            onClick={onAddExpense}
          >
            {addNewPageMutation.isPending ? (
              <Loader2 className="size-4 animate-spin text-gray-500" />
            ) : (
              <Rotate3D />
            )}
          </Button>
          <Button
            size={"icon"}
            className="rounded-full bg-[#B1C29E1a] text-[#B1C29E] duration-500 hover:bg-[#B1C29E40] disabled:bg-slate-400 disabled:text-slate-800 disabled:opacity-40"
            disabled={!!processedData.toAccount || addNewPageMutation.isPending}
            onClick={onAddIncome}
          >
            {addNewPageMutation.isPending ? (
              <Loader2 className="size-4 animate-spin text-gray-500" />
            ) : (
              <Shrub />
            )}
          </Button>
          <Button
            size={"icon"}
            className="rounded-full bg-[#DEAA791a] text-[#DEAA79] duration-500 hover:bg-[#DEAA7940] disabled:bg-slate-400 disabled:text-slate-800 disabled:opacity-40"
            disabled={!processedData.toAccount || addNewPageMutation.isPending}
            onClick={onAddTransfer}
          >
            {addNewPageMutation.isPending ? (
              <Loader2 className="size-4 animate-spin text-gray-500" />
            ) : (
              <ArrowLeftRight />
            )}
          </Button>
          <TransactionDrawer
            initData={{
              fromAccount: fromAccount,
              toAccount: toAccount ?? "null",
              amount: amount,
              name: name,
              date: dayjs(date).toDate(),
            }}
            onSubmit={(data) => {
              setProcessedData({
                name: data.name,
                amount: data.amount,
                fromAccount: data.fromAccount,
                toAccount: data.toAccount === "null" ? null : data.toAccount,
                date: dayjs(data.date).format("YYYY-MM-DD"),
              });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TransactionAIOutput;
