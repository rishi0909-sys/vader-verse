import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req: Request) {
  // Only allow this in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    await dbConnect();
    // Find any admin user
    const admin = await User.findOne({ role: "admin" });
    
    if (!admin) {
      return NextResponse.json({ error: "No admin user exists in DB." }, { status: 404 });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) throw new Error("JWT_SECRET is missing");

    const token = jwt.sign(
      { userId: admin._id, role: admin.role },
      jwtSecret,
      { expiresIn: "7d" }
    );

    // Redirect to profile page
    const url = new URL("/profile", req.url);
    const response = NextResponse.redirect(url);
    
    // Set the cookie!
    response.cookies.set({
      name: 'vader_token',
      value: token,
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error("Dev login error:", error);
    return NextResponse.json({ error: "Failed to login as dev admin" }, { status: 500 });
  }
}
