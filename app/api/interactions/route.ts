import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongodb";
import UserInteraction from "@/models/UserInteraction";
import { triggerPersonalization } from "@/lib/personalizationTrigger";

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
      decoded = jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] });
    } catch (err) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    const body = await req.json();
    const { itemId, itemType, action, duration, metadata } = body;

    if (!itemId || !itemType || !action) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();
    
    const interaction = new UserInteraction({
      userId: decoded.userId,
      itemId,
      itemType,
      action,
      duration,
      metadata,
    });

    await interaction.save();

    // Fire and forget personalization trigger
    console.log(`[AI PERSONALIZATION] Trigger called for user: ${decoded.userId}`);
    triggerPersonalization(decoded.userId);

    return NextResponse.json({ success: true, message: "Interaction tracked" });
  } catch (error) {
    console.error("Interaction error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}
