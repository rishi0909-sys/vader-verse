import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Tournament from "@/models/Tournament";
import { requireAuth } from "@/lib/auth/requireAuth";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const authResult = await requireAuth(req);
    
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const user = authResult.user;

    const activeCount = await Tournament.countDocuments({
      createdBy: user._id,
      status: { $in: ["pending_approval", "upcoming", "registration_open", "ongoing"] }
    });

    return NextResponse.json({ success: true, activeCount });
  } catch (error) {
    console.error("Fetch User Tournaments Error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch stats." }, { status: 500 });
  }
}
