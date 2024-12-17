import { NextRequest, NextResponse } from "next/server";

import { TABLE_ID } from "@/constants/notion";
import getAccountId from "@/lib/get-account-id";
import { Client } from "@notionhq/client";
import { CreatePageParameters } from "@notionhq/client/build/src/api-endpoints";

const buildCreateTransferBody = ({
  name,
  amount,
  date,
  fromAccount,
  toAccount,
}: ITransfer) => {
  return {
    icon: {
      emoji: "🌟",
    },
    parent: { database_id: TABLE_ID.TRANSFERS },
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
      "From Account": {
        relation: [{ id: getAccountId(fromAccount) }],
        has_more: false,
      },
      "To Account": {
        relation: [{ id: getAccountId(toAccount) }],
        has_more: false,
      },
    },
  } as CreatePageParameters;
};

export async function POST(request: NextRequest) {
  const body = (await request.json()) as ITransfer;

  try {
    const notion = new Client({ auth: process.env.NOTION_TOKEN });
    const notionBody = buildCreateTransferBody({ ...body });

    const res = await notion.pages.create(notionBody);
    return NextResponse.json({
      status: "success",
      id: res.id,
    });
  } catch (error) {
    console.error(error);
  }
}
