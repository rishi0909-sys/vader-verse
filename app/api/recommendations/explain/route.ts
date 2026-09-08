import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { generateRecommendationExplanation } from "@/services/aiExplanationService";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

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

    const body = await req.json();
    const { itemId, itemType } = body;

    if (!itemId || !itemType) {
      return NextResponse.json({ success: false, message: "Missing itemId or itemType" }, { status: 400 });
    }

    const result = await generateRecommendationExplanation(decoded.userId, itemId, itemType);

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    console.error("AI Explanation Error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}
