import { NextRequest, NextResponse } from "next/server";
import { searchMultiplayerGames } from "@/services/rawgService";

export async function GET(req: NextRequest) {
  try {
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
