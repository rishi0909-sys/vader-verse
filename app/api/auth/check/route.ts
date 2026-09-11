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

    if (!process.env.MONGO_URI && !process.env.MONGODB_URI) {
      return NextResponse.json({ error: "Vercel Config Error: MONGO_URI environment variable is missing." }, { status: 500 });
    }

    try {
      await dbConnect();
    } catch (e: any) {
      return NextResponse.json({ error: "MongoDB connection failed. Check your IP Whitelist and MONGO_URI." }, { status: 500 });
    }

    let query: any = {};
    if (email) query.email = email;
    if (username) query.username = username;

    const existingUser = await User.findOne(query);

    return NextResponse.json({ 
      available: !existingUser,
      message: existingUser ? "Already in use" : "Available"
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
