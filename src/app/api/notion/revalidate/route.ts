import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    revalidatePath("/api/notion/account");
    return NextResponse.json({ status: "success" });
  } catch (err) {
    return NextResponse.json({ status: "error" });
  }
}
