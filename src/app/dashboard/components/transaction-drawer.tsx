"use client";

import { FC, useState } from "react";

import { Pencil } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { formSchema } from "./form/schema";
import TransactionForm from "./form/transaction-form";

interface ITransactionDrawerProps {
  initData: z.infer<typeof formSchema>;
  onSubmit: (data: z.infer<typeof formSchema>) => void;
}
const TransactionDrawer: FC<ITransactionDrawerProps> = ({
  initData,
  onSubmit,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button
          size={"icon"}
          className="rounded-full bg-amber-400/20 text-amber-500 duration-500 hover:bg-amber-400/40"
        >
          <Pencil />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="mx-auto w-full max-w-screen-md">
          <DrawerTitle>Edit transaction info</DrawerTitle>
          <DrawerDescription>Adjust data below</DrawerDescription>
        </DrawerHeader>
        <div className="mx-auto flex w-full max-w-screen-md items-center *:grow">
          <TransactionForm
            onSubmit={(data) => {
              onSubmit(data);
              setIsOpen(false);
            }}
            initData={initData}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default TransactionDrawer;
