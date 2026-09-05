import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../[...nextauth]/route";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { ApiResponse } from "@/helpers/apiResponse";

export async function GET(req: Request) {
  try {
    // 1. Get the short-lived NextAuth session
    const session = await getServerSession(authOptions);
    
    if (!session || !(session as any).userId) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Unauthorized or missing NextAuth session" },
        { status: 401 }
      );
    }

    const userId = (session as any).userId;

    // 2. Lookup the user to construct the vader_token payload
    await dbConnect();
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // 3. Generate the canonical Vader-Verse JWT
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined");
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      jwtSecret,
      { expiresIn: "7d" } // Canonical 7-day Vader-Verse token
    );

    // 4. Return the token and user data (matching the /api/login response structure)
    return NextResponse.json<ApiResponse>(
      { 
        success: true,
        message: "Exchange successful",
        data: {
          token,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            onboardingCompleted: user.onboardingCompleted
          }
        } 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Exchange Error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Internal server error during token exchange" },
      { status: 500 }
    );
  }
}
