import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import AiTelemetryEvent from "@/models/AiTelemetryEvent";
import { requireAuth } from "@/lib/auth/requireAuth";

export async function POST(req: NextRequest) {
  try {
    // Only accept telemetry from logged-in users, as requested
    const authResult = await requireAuth(req);
    if (authResult instanceof NextResponse) {
      return authResult; // Returns 401
    }
    const user = authResult.user;

    const body = await req.json();
    const { eventType, category, entityId, metadata } = body;

    if (!eventType || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();

    // Insert the telemetry event. This is intentionally lightweight to prevent blocking.
    await AiTelemetryEvent.create({
      userId: user._id, // use MongoDB ObjectId
      eventType,
      category,
      entityId,
      metadata
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Telemetry Error:", error);
    return NextResponse.json({ error: "Failed to record telemetry" }, { status: 500 });
  }
}
