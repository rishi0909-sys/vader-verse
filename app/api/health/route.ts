import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";

export async function GET() {
  try {
    await dbConnect();
    return NextResponse.json({ status: "ok", message: "Database connected and API is healthy!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ status: "error", message: "Database connection failed" }, { status: 500 });
  }
}
