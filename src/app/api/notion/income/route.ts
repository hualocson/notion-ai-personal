import { NextRequest, NextResponse } from "next/server";

import { TABLE_ID } from "@/constants/notion";
import getAccountId from "@/lib/get-account-id";
import { Client } from "@notionhq/client";
import { CreatePageParameters } from "@notionhq/client/build/src/api-endpoints";

const buildCreateIncomeBody = ({
  name,
  amount,
  date,
  account,
}: ITransaction) => {
  return {
    icon: {
      emoji: "📨",
    },
    parent: { database_id: TABLE_ID.INCOMES },
    properties: {
      Date: {
        // format YYYY-MM-DD
        date: { start: date, end: null, time_zone: null },
      },
      Name: {
        title: [
          {
            text: {
              content: name,
            },
          },
        ],
      },
      Amount: { number: amount },
      Account: {
        relation: [{ id: getAccountId(account) }],
        has_more: false,
      },
    },
  } as CreatePageParameters;
};

export async function POST(request: NextRequest) {
  const body = (await request.json()) as ITransaction;

  try {
    const notion = new Client({ auth: process.env.NOTION_TOKEN });
    const notionBody = buildCreateIncomeBody({ ...body });

    const res = await notion.pages.create(notionBody);
    return NextResponse.json({
      status: "success",
      id: res.id,
    });
  } catch (error) {
    console.error(error);
  }
}
