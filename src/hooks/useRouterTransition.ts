"use client";

import { useTransition } from "react";

import { useRouter } from "next/navigation";

const useRouterTransition = () => {
  const router = useRouter();
  const [loading, startTransition] = useTransition();

  return {
    loading,
    push: (...args: Parameters<typeof router.push>) => {
      startTransition(() => {
        router.push(...args);
      });
    },
    refresh: (...args: Parameters<typeof router.refresh>) => {
      startTransition(() => {
        router.refresh(...args);
      });
    },
    // Add more methods here if needed
  };
};

export default useRouterTransition;
