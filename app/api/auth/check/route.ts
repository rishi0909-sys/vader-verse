import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const username = searchParams.get("username");

    if (!email && !username) {
      return NextResponse.json({ error: "Missing email or username" }, { status: 400 });
    }

    await dbConnect();

    let query: any = {};
    if (email) query.email = email;
    if (username) query.username = username;

    const existingUser = await User.findOne(query);

    return NextResponse.json({ 
      available: !existingUser,
      message: existingUser ? "Already in use" : "Available"
    });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
