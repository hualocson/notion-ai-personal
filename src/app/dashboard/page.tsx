"use client";

import MagicInput from "./components/magic-input";
import ProcessedPrompt from "./components/processed-prompt";

const sampleData = {
  name: "Eating",
  date: "2024-12-18",
  amount: 20000000,
  account: "bidv",
};
const Dashboard = () => {
  return (
    <div className="mx-auto flex h-[calc(100svh-110px)] w-full max-w-screen-sm flex-col-reverse items-center gap-6 lg:h-[calc(100dvh-120px)]">
      <div className="w-full">
        <MagicInput />
      </div>

      <ProcessedPrompt {...sampleData} />
    </div>
  );
};

export default Dashboard;
