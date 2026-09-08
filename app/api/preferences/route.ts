import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongodb";
import UserPreference from "@/models/UserPreference";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] });
    } catch (err) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    await dbConnect();
    
    const userPref = await UserPreference.findOne({ userId: decoded.userId });
    const user = await User.findById(decoded.userId).select('username avatar');
    
    return NextResponse.json({ success: true, data: userPref || null, user: user || null });
  } catch (error) {
    console.error("Preferences GET error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] });
    } catch (err) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { topGenres, topTags, favoriteGames, currentInterests, genreScores, tagScores } = body;

    await dbConnect();

    let userPref = await UserPreference.findOne({ userId: decoded.userId });
    if (!userPref) {
      userPref = new UserPreference({ userId: decoded.userId });
    }

    if (Array.isArray(topGenres)) userPref.topGenres = topGenres;
    if (Array.isArray(topTags)) userPref.topTags = topTags;
    if (Array.isArray(favoriteGames)) userPref.favoriteGames = favoriteGames;
    if (Array.isArray(currentInterests)) userPref.currentInterests = currentInterests;
    if (genreScores && typeof genreScores === "object") userPref.genreScores = genreScores;
    if (tagScores && typeof tagScores === "object") userPref.tagScores = tagScores;
    userPref.lastProcessedAt = new Date();

    await userPref.save();

    return NextResponse.json({ success: true, message: "Preferences updated successfully.", data: userPref });
  } catch (error) {
    console.error("Preferences POST error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  return POST(req);
}

