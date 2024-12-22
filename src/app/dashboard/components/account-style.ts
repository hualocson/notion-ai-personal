import { ACCOUNT_ID } from "@/constants/notion";

const ACCOUNT_STYLE = {
  [ACCOUNT_ID.BADMINTON]: "#C7B7A3",
  [ACCOUNT_ID.FUND_FOOD]: "#c084fc",
  [ACCOUNT_ID.KINDLE]: "#B3C8CF",

  [ACCOUNT_ID.BIDV]: "#B1C29E",
  [ACCOUNT_ID.MOMO]: "#E1ACAC",
  [ACCOUNT_ID.CASH]: "#659287",
  [ACCOUNT_ID.GP]: "#DEAA79",
} as const;

export default ACCOUNT_STYLE;
