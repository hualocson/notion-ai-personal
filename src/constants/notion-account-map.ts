import { ACCOUNT_ID } from "./notion";

const NOTION_ACCOUNT_MAP = {
  "Golden pocket": ACCOUNT_ID.GP,
  Cash: ACCOUNT_ID.CASH,
  Momo: ACCOUNT_ID.MOMO,
  BIDV: ACCOUNT_ID.BIDV,
  Food: ACCOUNT_ID.FUND_FOOD,
  Badminton: ACCOUNT_ID.BADMINTON,
  "Mua Kindle": ACCOUNT_ID.KINDLE,
} as const;
export default NOTION_ACCOUNT_MAP;
