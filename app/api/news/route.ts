import { NextRequest, NextResponse } from "next/server";
import { getGamingNews } from "@/services/newsService";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);

    const articles = await getGamingNews(page);

    return NextResponse.json({ success: true, articles });
  } catch (error) {
    console.error("News API Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch news." },
      { status: 500 }
    );
  }
}
