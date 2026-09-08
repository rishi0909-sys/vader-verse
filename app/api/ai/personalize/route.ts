import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { processUserPersonalization } from "@/services/aiPersonalizationService";

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

    const result = await processUserPersonalization(decoded.userId);
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: result.message || "Personalization updated.", 
        interactionsProcessed: result.processed,
        geminiCalled: result.processed ? result.processed > 0 : false,
        preferencesUpdated: result.processed ? result.processed > 0 : false,
        data: result.profile || null 
      });
    } else {
      return NextResponse.json({ success: false, message: result.error || "Failed to process personalization." }, { status: 500 });
    }
    
  } catch (error) {
    console.error("AI Personalize Trigger error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}
