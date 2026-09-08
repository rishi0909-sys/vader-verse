import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import User from "@/models/User";
import dbConnect from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAdmin(req);
    if (authResult instanceof NextResponse) return authResult;

    await dbConnect();

    // Fetch users, omitting passwords. Sort by newest first.
    const users = await User.find({}, { passwordHash: 0 }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: users });
  } catch (error: any) {
    console.error("Admin Users GET Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
