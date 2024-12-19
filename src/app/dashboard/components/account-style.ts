import { ACCOUNT_ID } from "@/constants/notion";

const ACCOUNT_STYLE = {
  [ACCOUNT_ID.BADMINTON]: "#f87171",
  [ACCOUNT_ID.FUND_FOOD]: "#c084fc",
  [ACCOUNT_ID.KINDLE]: "#bae6fd",

  [ACCOUNT_ID.BIDV]: "#4ade80",
  [ACCOUNT_ID.MOMO]: "#f472b6",
  [ACCOUNT_ID.CASH]: "#818cf8",
  [ACCOUNT_ID.GP]: "#fbbf24",
} as const;

export default ACCOUNT_STYLE;
