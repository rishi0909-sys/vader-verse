import { NextRequest, NextResponse } from "next/server";
import { searchMultiplayerGames } from "@/services/rawgService";
import { standardRateLimiter, getRateLimitIdentity } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  try {
    // 1. Rate Limiting
    const identity = getRateLimitIdentity(req);
    const { success, limit, remaining, reset } = await standardRateLimiter.limit(identity);

    if (!success) {
      return NextResponse.json(
        { success: false, message: "Too many requests. Please try again later." },
        { 
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString()
          }
        }
      );
    }

    const searchParams = req.nextUrl.searchParams;
    const q = searchParams.get("q");

    if (!q) {
      return NextResponse.json({ success: false, message: "Missing query" }, { status: 400 });
    }

    const games = await searchMultiplayerGames(q);

    return NextResponse.json({ success: true, games });
  } catch (error) {
    console.error("RAWG Search API Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to search games." },
      { status: 500 }
    );
  }
}

