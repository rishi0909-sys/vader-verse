import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Tournament from "@/models/Tournament";
import Game from "@/models/Game";
import "@/models/User";
import { requireAuth } from "@/lib/auth/requireAuth";

export const revalidate = 60; // ISR cache revalidation every 60 seconds

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // Fetch live/upcoming tournaments
    const tournaments = await Tournament.find({
      status: { $in: ["upcoming", "registration_open", "ongoing"] }
    })
      .populate("game")
      .populate("createdBy", "username")
      .sort({ startDate: 1 })
      .limit(20)
      .lean();

    return NextResponse.json({ success: true, tournaments });
  } catch (error) {
    console.error("Fetch Tournaments Error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch tournaments." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const authResult = await requireAuth(req);
    
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const user = authResult.user;

    // Gating Logic: Max 1 active tournament
    const activeCount = await Tournament.countDocuments({
      createdBy: user._id,
      status: { $in: ["pending_approval", "upcoming", "registration_open", "ongoing"] }
    });

    if (activeCount >= 1) {
      return NextResponse.json(
        { 
          success: false, 
          message: "You have reached your limit of 1 active tournament.",
          requiresUpgrade: true 
        }, 
        { status: 403 }
      );
    }

    const body = await req.json();
    const { title, description, rawgGame, startDate, endDate, maxParticipants, bracketType, rules } = body;

    if (!title || !rawgGame || !startDate) {
      return NextResponse.json({ success: false, message: "Missing required fields." }, { status: 400 });
    }

    // Upsert the game from RAWG if it doesn't exist in our DB
    let gameDoc = await Game.findOne({ rawgId: rawgGame.id.toString() });
    if (!gameDoc) {
      gameDoc = await Game.create({
        title: rawgGame.name,
        slug: rawgGame.slug,
        rawgId: rawgGame.id.toString(),
        coverImage: rawgGame.background_image,
        genres: rawgGame.genres?.map((g: any) => g.name) || [],
      });
    }

    const tournament = await Tournament.create({
      title,
      description,
      game: gameDoc._id,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : undefined,
      maxParticipants,
      bracketType,
      rules,
      createdBy: user._id,
      status: "upcoming" // Auto-approve for now, or pending_approval
    });

    return NextResponse.json({ success: true, tournament });
  } catch (error) {
    console.error("Create Tournament Error:", error);
    return NextResponse.json({ success: false, message: "Failed to create tournament." }, { status: 500 });
  }
}
