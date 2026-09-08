import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/lib/auth/requireAuth";
import Report from "@/models/Report";
import User from "@/models/User";

const reportSchema = z.object({
  reportedUser: z.string().optional(),
  reportedContentId: z.string().optional(),
  reportedContentType: z.enum(["game", "news", "tournament", "community", "message"]).optional(),
  reason: z.string().min(3).max(100),
  description: z.string().min(10).max(2000),
});

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAuth(req);
    if (authResult instanceof NextResponse) return authResult;
    const { user } = authResult;

    const body = await req.json();
    const parseResult = reportSchema.safeParse(body);
    
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, message: "Invalid input", errors: parseResult.error.format() },
        { status: 400 }
      );
    }

    const { reportedUser, reportedContentId, reportedContentType, reason, description } = parseResult.data;

    if (reportedUser) {
      // Validate that the reported user exists
      const targetUser = await User.findById(reportedUser);
      if (!targetUser) {
        return NextResponse.json({ success: false, message: "Reported user not found" }, { status: 404 });
      }
    }

    // Rate limiting / Spam protection (simple check: max 5 reports per day per user)
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const reportCount = await Report.countDocuments({
      reporter: user._id,
      createdAt: { $gte: startOfDay }
    });

    if (reportCount >= 5) {
      return NextResponse.json({ success: false, message: "You have reached your daily report limit." }, { status: 429 });
    }

    // Status is strictly hardcoded to "pending" to prevent user override
    const newReport = await Report.create({
      reporter: user._id,
      reportedUser: reportedUser || undefined,
      reportedContentId: reportedContentId || undefined,
      reportedContentType: reportedContentType || undefined,
      reason,
      description,
      status: "pending" 
    });

    return NextResponse.json(
      { success: true, message: "Report submitted successfully", data: newReport },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Report POST Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
