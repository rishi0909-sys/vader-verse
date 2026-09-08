import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongodb";
import User, { IUser } from "@/models/User";

export async function requireAuth(req: NextRequest): Promise<{ user: IUser } | NextResponse> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ success: false, message: "Unauthorized: Missing token" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  const jwtSecret = process.env.JWT_SECRET;
  
  if (!jwtSecret) {
    console.error("JWT_SECRET is not defined");
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret, { algorithms: ["HS256"] }) as { userId: string, role: string };
    
    if (!decoded.userId) {
      return NextResponse.json({ success: false, message: "Unauthorized: Invalid token payload" }, { status: 401 });
    }

    await dbConnect();

    // The user document is the canonical source of authority.
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized: User not found" }, { status: 401 });
    }

    return { user };
  } catch (err) {
    console.error("requireAuth error:", err);
    return NextResponse.json({ success: false, message: "Unauthorized: Invalid or expired token" }, { status: 401 });
  }
}
