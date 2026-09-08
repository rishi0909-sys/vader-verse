import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";
import GameSession from "@/models/GameSession";
import { triggerPersonalization } from "@/lib/personalizationTrigger";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] });
    } catch (err) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    const body = await req.json();
    const { sessionDuration, endedAt } = body;

    await dbConnect();
    
    if (!mongoose.Types.ObjectId.isValid(resolvedParams.id)) {
      return NextResponse.json({ success: false, message: "Invalid session ID format" }, { status: 400 });
    }
    
    // Ensure the session belongs to the user
    const session = await GameSession.findOne({ _id: resolvedParams.id, user: decoded.userId });
    if (!session) {
      return NextResponse.json({ success: false, message: "Session not found or unauthorized" }, { status: 404 });
    }

    if (sessionDuration !== undefined) session.sessionDuration = sessionDuration;
    if (endedAt !== undefined) session.endedAt = endedAt;

    await session.save();

    // Fire and forget personalization trigger
    triggerPersonalization(decoded.userId);

    return NextResponse.json({ success: true, message: "Game session updated", data: session });
  } catch (error) {
    console.error("GameSession update error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}
