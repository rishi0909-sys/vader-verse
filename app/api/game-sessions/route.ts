import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";
import GameSession from "@/models/GameSession";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    const body = await req.json();
    const { game } = body;

    if (!game) {
      return NextResponse.json({ success: false, message: "Missing game ID" }, { status: 400 });
    }
    
    if (!mongoose.Types.ObjectId.isValid(game)) {
      return NextResponse.json({ success: false, message: "Invalid game ID format" }, { status: 400 });
    }

    await dbConnect();
    
    const session = new GameSession({
      user: decoded.userId,
      game,
      startedAt: new Date(),
    });

    await session.save();

    return NextResponse.json({ success: true, message: "Game session started", data: session });
  } catch (error) {
    console.error("GameSession error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}
