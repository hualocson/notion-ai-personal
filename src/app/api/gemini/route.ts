import { NextRequest, NextResponse } from "next/server";

import model from "@/app/configs/gemini";
import dayjs from "dayjs";

const processOutput = (res: string) => {
  const parsed = JSON.parse(res);

  if (parsed.date === "null") {
    return { ...parsed, date: dayjs().format("YYYY-MM-DD") };
  }

  return parsed;
};

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = await model.generateContent(body.prompt);
  return NextResponse.json({
    status: "success",
    processed: processOutput(result.response.text()),
  });
}
