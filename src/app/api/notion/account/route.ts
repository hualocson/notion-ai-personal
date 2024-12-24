import { NextResponse } from "next/server";

import notion from "@/app/configs/notion";
import { TABLE_ID } from "@/constants/notion";
import NOTION_ACCOUNT_MAP from "@/constants/notion-account-map";
import {
  APIErrorCode,
  ClientErrorCode,
  isNotionClientError,
} from "@notionhq/client";
import { type DatabaseObjectResponse } from "@notionhq/client/build/src/api-endpoints";

// get all account
export async function GET() {
  // query database account return amount and account name
  try {
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
  } catch (error) {
    if (isNotionClientError(error)) {
      // error is now strongly typed to NotionClientError
      switch (error.code) {
        case APIErrorCode.RateLimited:
          return NextResponse.json(
            {
              status: "error",
              message: "Rate limited",
            },
            { status: 429 }
          );
        case ClientErrorCode.RequestTimeout:
          return NextResponse.json(
            {
              status: "error",
              message: "Time out",
            },
            { status: 400 }
          );
        case APIErrorCode.ObjectNotFound:
          return NextResponse.json(
            {
              status: "error",
              message: "Not found",
            },
            { status: 404 }
          );
        case APIErrorCode.Unauthorized:
          return NextResponse.json(
            {
              status: "error",
              message: "Unauthorized",
            },
            { status: 401 }
          );
        // ...
        default:
          // you could even take advantage of exhaustiveness checking
          return NextResponse.json(
            {
              status: "error",
              message: "Notion error",
              error: error.code,
            },
            { status: 500 }
          );
      }
    }

    return NextResponse.json(
      {
        status: "error",
        message: "Server error",
      },
      { status: 500 }
    );
  }
}
