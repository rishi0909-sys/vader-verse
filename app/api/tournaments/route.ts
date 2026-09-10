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
    
    const url = new URL(req.url);
    const cursor = url.searchParams.get("cursor");
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "20", 10), 50);
    
    let query: any = {
      status: { $in: ["upcoming", "registration_open", "ongoing"] }
    };

    if (cursor) {
      try {
        const decoded = Buffer.from(cursor, 'base64').toString('ascii');
        const [dateStr, idStr] = decoded.split('|');
        if (dateStr && idStr) {
          query.$or = [
            { startDate: { $gt: new Date(dateStr) } },
            { startDate: new Date(dateStr), _id: { $gt: idStr } }
          ];
        }
      } catch (e) {
        return NextResponse.json({ success: false, message: "Invalid cursor" }, { status: 400 });
      }
    }

    // Fetch live/upcoming tournaments
    const tournaments = await Tournament.find(query)
      .populate("game")
      .populate("createdBy", "username")
      .sort({ startDate: 1, _id: 1 })
      .limit(limit + 1)
      .lean();

    const hasMore = tournaments.length > limit;
    if (hasMore) {
      tournaments.pop(); // Remove the lookahead item
    }

    let nextCursor = null;
    if (hasMore && tournaments.length > 0) {
      const lastItem = tournaments[tournaments.length - 1] as any;
      const dateStr = lastItem.startDate.toISOString();
      const idStr = lastItem._id.toString();
      nextCursor = Buffer.from(`${dateStr}|${idStr}`).toString('base64');
    }

    return NextResponse.json({ 
      success: true, 
      tournaments,
      nextCursor,
      hasMore 
    });
  } catch (error) {
    console.error("Fetch Tournaments Error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch tournaments." }, { status: 500 });
  }
}

import { z } from "zod";

const tournamentSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().max(1000).optional(),
  rawgGame: z.object({
    id: z.union([z.string(), z.number()]),
    name: z.string(),
    slug: z.string(),
    background_image: z.string().nullable().optional(),
    genres: z.array(z.object({ name: z.string() })).optional()
  }),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  maxParticipants: z.number().min(2).max(1024).default(32),
  bracketType: z.enum(["single_elimination", "double_elimination", "round_robin"]).default("single_elimination"),
  rules: z.string().max(2000).optional()
});

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
        { status: 429 } // 429 is better than 403 for quota
      );
    }

    const body = await req.json();
    const parseResult = tournamentSchema.safeParse(body);
    
    if (!parseResult.success) {
      return NextResponse.json({ success: false, message: "Invalid input", errors: parseResult.error.flatten() }, { status: 400 });
    }
    
    const { title, description, rawgGame, startDate, endDate, maxParticipants, bracketType, rules } = parseResult.data;

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

