"use client";

import { FC } from "react";

import formatAmount from "@/lib/format-amount";

import ACCOUNT_STYLE from "./account-style";

interface IAccountCardProps {
  name: string;
  id: string;
  balance: number;
}

const AccountCard: FC<IAccountCardProps> = ({ name, id, balance }) => {
  return (
    <div
      style={
        {
          "--color-bg": ACCOUNT_STYLE[id as keyof typeof ACCOUNT_STYLE],
          "--color-bg-trans":
            ACCOUNT_STYLE[id as keyof typeof ACCOUNT_STYLE] + "10",
          "--color-border":
            ACCOUNT_STYLE[id as keyof typeof ACCOUNT_STYLE] + "4d",
        } as React.CSSProperties
      }
      className="flex w-full select-none flex-col items-center justify-between overflow-hidden rounded-3xl border border-[--color-border] bg-[--color-bg-trans] p-6 text-lg text-[--color-bg]"
    >
      <p className="w-full text-start text-2xl font-bold">
        {formatAmount(balance)}
      </p>
      <p className="w-full text-end text-gray-500">{name}</p>
    </div>
  );
};

export default AccountCard;
