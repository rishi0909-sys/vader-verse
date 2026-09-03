import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Game from "@/models/Game";
import UserInteraction from "@/models/UserInteraction";
import { triggerPersonalization } from "@/lib/personalizationTrigger";
import { ApiResponse } from "@/helpers/apiResponse";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json<ApiResponse>({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json<ApiResponse>({ success: false, message: "Invalid token" }, { status: 401 });
    }

    const body = await req.json();
    const { gameIds } = body;

    if (!Array.isArray(gameIds) || gameIds.length === 0) {
      return NextResponse.json<ApiResponse>({ success: false, message: "Provide an array of gameIds" }, { status: 400 });
    }

    await dbConnect();
    
    // Check user and idempotency
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json<ApiResponse>({ success: false, message: "User not found" }, { status: 404 });
    }
    
    if (user.onboardingCompleted) {
      return NextResponse.json<ApiResponse>({ success: false, message: "Onboarding already completed" }, { status: 400 });
    }

    // Process selected games (matching by title instead of ObjectID for static frontend list)
    const games = await Game.find({ title: { $in: gameIds } });
    
    if (games.length === 0) {
      return NextResponse.json<ApiResponse>({ success: false, message: "No valid games found" }, { status: 400 });
    }

    // Create interactions for evidence
    const interactionsToInsert = games.map(game => ({
      userId: user._id,
      itemId: game._id,
      itemType: 'game',
      action: 'like',
      duration: 0,
      metadata: {
        title: game.title,
        genres: game.genres,
        tags: game.tags,
        source: 'onboarding'
      }
    }));

    await UserInteraction.insertMany(interactionsToInsert);

    // Update user status
    user.onboardingCompleted = true;
    await user.save();

    // Fire and forget personalization trigger to process initial evidence
    console.log(`[ONBOARDING] Triggering AI personalization for user: ${user._id}`);
    triggerPersonalization(user._id.toString());

    return NextResponse.json<ApiResponse>({ 
      success: true, 
      message: "Onboarding complete. Preferences processed." 
    }, { status: 200 });

  } catch (error) {
    console.error("Onboarding Error:", error);
    return NextResponse.json<ApiResponse>({ success: false, message: "Server Error" }, { status: 500 });
  }
}
