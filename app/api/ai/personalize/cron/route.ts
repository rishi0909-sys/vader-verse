import { NextResponse } from "next/server";
import { processPendingPersonalizations } from "@/services/aiPersonalizationService";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    
    // Enforce CRON_SECRET for this background job endpoint
    if (!process.env.CRON_SECRET) {
      // If no secret configured, fail securely rather than open access
      return NextResponse.json({ success: false, message: "CRON_SECRET not configured" }, { status: 500 });
    }

    if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ success: false, message: "Unauthorized CRON request" }, { status: 401 });
    }

    const result = await processPendingPersonalizations();
    
    if (result.success) {
      return NextResponse.json({ success: true, message: `Processed ${result.processedUsers} users.` });
    } else {
      return NextResponse.json({ success: false, message: "Failed to process personalizations." }, { status: 500 });
    }
    
  } catch (error) {
    console.error("AI Personalize Cron Trigger error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}
