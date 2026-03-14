import { getToken } from "@/lib/token";
import { NextResponse } from "next/server";

export async function GET() {
  const token = await getToken();
  return NextResponse.json({ isLoggedIn: !!token });
}
