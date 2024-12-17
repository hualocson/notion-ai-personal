import { NextResponse } from "next/server";

export async function GET() {
  const notionToken = process.env.NOTION_TOKEN;
  return NextResponse.json({
    message: "Hello from the API route!",
    token: notionToken,
  });
}
