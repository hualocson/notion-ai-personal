"use client";

import { cn } from "@/lib/utils";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import { Loader2, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

const DashboardContentLayout = ({
  children,
  headerText = "",
  className = "",
}: Readonly<{
  children: React.ReactNode;
  headerText?: string;
  className?: string;
}>) => {
  const queryClient = useQueryClient();
  const handleOnRefresh = () => {
    queryClient.invalidateQueries({
      queryKey: ["accounts"],
      refetchType: "all",
    });
  };

  // check is query is fetching
  const isFetching = useIsFetching({ queryKey: ["accounts"] }) > 0;

  return (
    <>
      <header className="container fixed left-1/2 top-0 z-50 mx-auto flex h-16 w-full max-w-screen-sm -translate-x-1/2 items-center justify-between bg-background/20 backdrop-blur-lg">
        <p className="text-lg font-bold">{headerText}</p>
        <Button
          className="inline-flex size-10 items-center justify-center rounded-full bg-indigo-400/10 font-bold text-indigo-400 hover:bg-indigo-400/30"
          onClick={handleOnRefresh}
          disabled={isFetching}
        >
          {
            // show loading icon if fetching
            isFetching ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <RotateCcw size={16} />
            )
          }
        </Button>
      </header>
      <div
        className={cn(
          "mx-auto flex max-w-screen-sm flex-col justify-between pb-24 pt-16",
          className
        )}
      >
        {children}
      </div>
    </>
  );
};

export default DashboardContentLayout;
