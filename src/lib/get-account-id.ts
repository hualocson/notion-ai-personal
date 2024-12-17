import { ACCOUNT_ID } from "@/constants/notion";

const getAccountId = (account: string) => {
  return ACCOUNT_ID[account.toUpperCase() as keyof typeof ACCOUNT_ID];
};

export default getAccountId;
