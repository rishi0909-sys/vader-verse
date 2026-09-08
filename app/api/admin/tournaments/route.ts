import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import Tournament from "@/models/Tournament";

export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAdmin(req);
    if (authResult instanceof NextResponse) return authResult;

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "pending_approval";
    
    const tournaments = await Tournament.find({ status })
      .populate("createdBy", "username email avatar")
      .populate("game", "title coverImage")
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json({ success: true, data: tournaments });
  } catch (error: any) {
    console.error("Admin Tournaments GET Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

const updateTournamentSchema = z.object({
  tournamentId: z.string(),
  action: z.enum(["approve", "reject"]),
});

export async function PUT(req: NextRequest) {
  try {
    const authResult = await requireAdmin(req);
    if (authResult instanceof NextResponse) return authResult;
    const { user: admin } = authResult;

    const body = await req.json();
    const parseResult = updateTournamentSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, message: "Invalid input", errors: parseResult.error.format() },
        { status: 400 }
      );
    }

    const { tournamentId, action } = parseResult.data;

    // Concurrency protection: we strictly transition from "pending_approval" to "upcoming" or "cancelled"
    const nextStatus = action === "approve" ? "upcoming" : "cancelled";

    const tournament = await Tournament.findOneAndUpdate(
      { _id: tournamentId, status: "pending_approval" },
      { $set: { status: nextStatus } },
      { new: true }
    );

    if (!tournament) {
      return NextResponse.json({ success: false, message: "Tournament not found or already processed" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: `Tournament ${action}d successfully`, data: tournament });
  } catch (error: any) {
    console.error("Admin Tournaments PUT Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
