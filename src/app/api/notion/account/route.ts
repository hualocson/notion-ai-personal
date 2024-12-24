import { NextResponse } from "next/server";

import notion from "@/app/configs/notion";
import { TABLE_ID } from "@/constants/notion";
import NOTION_ACCOUNT_MAP from "@/constants/notion-account-map";
import { type DatabaseObjectResponse } from "@notionhq/client/build/src/api-endpoints";

// get all account
export async function GET() {
  // query database account return amount and account name
  const data = await notion.databases.query({
    database_id: TABLE_ID.ACCOUNTS,
    filter: {
      property: "Name",
      rich_text: { contains: "" },
    },
  });
  const results = data.results as DatabaseObjectResponse[];

  const res = results.map((a) => ({
    // @ts-expect-error
    account: a.properties.Name.title[0].text.content,
    // @ts-expect-error
    accountId: NOTION_ACCOUNT_MAP[a.properties.Name.title[0].text.content],
    // @ts-expect-error
    balance: a.properties.Balance.formula.number,
  }));
  return NextResponse.json({
    message: "Retrive data from notion successfully",
    data: res,
  });
}
