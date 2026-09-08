import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getTournamentRecommendations } from "@/services/recommendationEngine";

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

    const recommendations = await getTournamentRecommendations(decoded.userId);
    
    return NextResponse.json({ success: true, data: recommendations });
  } catch (error) {
    console.error("Tournament recommendations error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}
