"use client";

const DashboardContentLayout = ({
  children,
  headerText = "",
}: Readonly<{
  children: React.ReactNode;
  headerText?: string;
}>) => {
  return (
    <div className="flex flex-col justify-between">
      <div className="flex h-16 items-center justify-between">
        <p className="text-lg font-bold">{headerText}</p>
        <span className="inline-flex size-10 items-center justify-center rounded-full bg-indigo-400 font-bold text-white">
          S
        </span>
      </div>
      <div className="mx-auto flex h-[calc(100svh-106px-64px)] w-full max-w-screen-sm flex-col-reverse items-center gap-6 lg:h-[calc(100dvh-120px-64px)]">
        {children}
      </div>
    </div>
  );
};

export default DashboardContentLayout;
