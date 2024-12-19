"use client";

import { FC } from "react";

import TransactionAIOutput from "./transaction-ai-output ";
import TransferAIOutput from "./transfer-ai-output";

interface IProcessedPromptProps {
  data: ITransaction | ITransfer;
  onConfirm?: () => void;
  isLoading?: boolean;
  type: "transfer" | "transaction";
}

const ProcessedPrompt: FC<IProcessedPromptProps> = ({
  data,
  onConfirm = () => {},
  isLoading,
  type,
}) => {
  if (type === "transaction") {
    return (
      <TransactionAIOutput
        data={data as ITransaction}
        onConfirm={onConfirm}
        isLoading={isLoading}
      />
    );
  }
  if (type === "transfer") {
    return (
      <TransferAIOutput
        data={data as ITransfer}
        onConfirm={onConfirm}
        isLoading={isLoading}
      />
    );
  }
};

export default ProcessedPrompt;
