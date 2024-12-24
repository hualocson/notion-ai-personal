import { NextRequest, NextResponse } from "next/server";

import notion from "@/app/configs/notion";
import { TABLE_ID } from "@/constants/notion";
import getAccountId from "@/lib/get-account-id";
import {
  CreatePageParameters,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

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
    const notionBody = buildCreateIncomeBody({ ...body });

    const res = (await notion.pages.create(notionBody)) as PageObjectResponse;
    return NextResponse.json({
      status: "success",
      id: res.id,
      url: res.url,
    });
  } catch (error) {
    console.error(error);
  }
}
