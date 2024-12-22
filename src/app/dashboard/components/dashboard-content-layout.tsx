"use client";

import { cn } from "@/lib/utils";

const DashboardContentLayout = ({
  children,
  headerText = "",
  className = "",
}: Readonly<{
  children: React.ReactNode;
  headerText?: string;
  className?: string;
}>) => {
  return (
    <>
      <header className="container fixed left-1/2 top-0 z-50 mx-auto flex h-16 w-full max-w-screen-sm -translate-x-1/2 items-center justify-between bg-background/20 backdrop-blur-lg">
        <p className="text-lg font-bold">{headerText}</p>
        <span className="inline-flex size-10 items-center justify-center rounded-full bg-indigo-400 font-bold text-white">
          S
        </span>
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
