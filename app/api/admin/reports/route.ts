import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import Report from "@/models/Report";

export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAdmin(req);
    if (authResult instanceof NextResponse) return authResult;

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    
    let query: any = {};
    if (status) query.status = status;

    const reports = await Report.find(query)
      .populate("reporter", "username email avatar")
      .populate("reportedUser", "username email avatar")
      .sort({ createdAt: -1 })
      .limit(50); // Simple pagination/limit for now

    return NextResponse.json({ success: true, data: reports });
  } catch (error: any) {
    console.error("Admin Reports GET Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

const updateReportSchema = z.object({
  reportId: z.string(),
  status: z.enum(["reviewed", "dismissed", "action_taken"]),
  adminNotes: z.string().optional()
});

export async function PUT(req: NextRequest) {
  try {
    const authResult = await requireAdmin(req);
    if (authResult instanceof NextResponse) return authResult;
    const { user: admin } = authResult;

    const body = await req.json();
    const parseResult = updateReportSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, message: "Invalid input", errors: parseResult.error.format() },
        { status: 400 }
      );
    }

    const { reportId, status, adminNotes } = parseResult.data;

    // Explicit state-transition policy: Can only review a report that is not already in the target status
    const updatePayload: any = { 
      status, 
      reviewedBy: admin._id, 
      reviewedAt: new Date() 
    };
    
    if (adminNotes) {
      updatePayload.adminNotes = adminNotes;
    }

    const report = await Report.findOneAndUpdate(
      { _id: reportId, status: { $ne: status } },
      { $set: updatePayload },
      { new: true }
    );

    if (!report) {
      return NextResponse.json({ success: false, message: "Report not found or already processed into this state" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Report updated", data: report });
  } catch (error: any) {
    console.error("Admin Reports PUT Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
