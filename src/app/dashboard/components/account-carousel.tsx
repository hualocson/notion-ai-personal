"use client";

import { FC, useEffect, useState } from "react";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import AccountCard from "./account-card";

interface IAccountCarouselProps {
  data: Array<{ account: string; accountId: string; balance: number }>;
}

const AccountCarousel: FC<IAccountCarouselProps> = ({ data }) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="relative pt-2">
      {current > 1 && (
        <span className="absolute left-0 z-50 h-full w-12 bg-gradient-to-r from-white to-transparent" />
      )}
      {current < count && (
        <span className="absolute right-0 z-50 h-full w-12 bg-gradient-to-l from-white to-transparent" />
      )}
      <Carousel
        opts={{
          align: "center",
        }}
        setApi={setApi}
      >
        <CarouselContent className="-ml-1">
          {data.map((t) => (
            <CarouselItem key={t.accountId} className="flex-[0_0_80%] pl-2">
              <div className="pt-2">
                <AccountCard
                  id={t.accountId}
                  name={t.account}
                  balance={t.balance}
                  key={t.accountId}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default AccountCarousel;
