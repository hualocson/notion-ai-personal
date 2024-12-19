"use client";

import { useState } from "react";

import { usePathname } from "next/navigation";

import useRouterTransition from "@/hooks/useRouterTransition";
import { cn } from "@/lib/utils";
import {
  ArrowLeftRight,
  Home,
  LucideIcon,
  Rotate3D,
  Shrub,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const NavItem = ({
  icon: Icon,
  className,
  active,
  onClick,
  isLoading,
}: {
  icon: LucideIcon;
  className?: string;
  active?: boolean;
  onClick?: () => void;
  isLoading?: boolean;
}) => (
  <Button
    data-active={active}
    size={"icon"}
    className={cn(
      "relative size-14 rounded-xl text-gray-400 hover:bg-gray-200/80 [&_svg]:size-6",
      className
    )}
    variant={"ghost"}
    onClick={onClick}
  >
    <Icon />

    {(active || isLoading) && (
      <span
        className={cn(
          "absolute left-1/2 top-0 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-400",
          isLoading && "animate-pulse bg-gray-400"
        )}
      ></span>
    )}
  </Button>
);

const navs = [
  {
    id: "home",
    icon: Home,
    url: "/dashboard",
    className:
      "data-[active=true]:text-foreground data-[active=true]:bg-foreground/10",
  },
  {
    id: "expense",
    icon: Rotate3D,
    className:
      "data-[active=true]:text-destructive data-[active=true]:bg-destructive/10 hover:text-destructive/80",
    url: "/dashboard/expense",
  },
  {
    id: "transfer",
    icon: ArrowLeftRight,
    className:
      "data-[active=true]:text-amber-500 data-[active=true]:bg-amber-500/10 hover:text-amber-500/80",
    url: "/dashboard/transfer",
  },
  {
    id: "income",
    icon: Shrub,
    className:
      "data-[active=true]:text-teal-500 data-[active=true]:bg-teal-500/10 hover:text-teal-500/80",
    url: "/dashboard/income",
  },
];

const Navbar = () => {
  const router = useRouterTransition();
  const [nextUrl, setNextUrl] = useState<string | undefined>();
  const path = usePathname();
  return (
    <div className="container fixed inset-x-0 bottom-0 max-w-screen-sm bg-background/10 p-4 backdrop-blur-lg">
      <div className="flex items-center justify-between rounded-2xl px-4 py-2 lg:px-0">
        {navs.map((i) => (
          <NavItem
            key={i.id}
            icon={i.icon}
            className={i.className}
            active={path === i.url}
            isLoading={router.loading && nextUrl === i.url}
            onClick={() => {
              router.push(i.url);
              setNextUrl(i.url);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Navbar;
