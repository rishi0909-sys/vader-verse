import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { ApiResponse } from "@/helpers/apiResponse";

const loginSchema = z.object({
  identifier: z.string().min(3),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. Validate Input
    const parseResult = loginSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Invalid input", errors: parseResult.error.format() },
        { status: 400 }
      );
    }
    
    const { identifier, password } = parseResult.data;

    // 2. Connect DB
    if (!process.env.MONGO_URI && !process.env.MONGODB_URI) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Vercel Config Error: MONGO_URI environment variable is missing." },
        { status: 500 }
      );
    }
    try {
      await dbConnect();
    } catch (e: any) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "MongoDB connection failed. Check your IP Whitelist and MONGO_URI." },
        { status: 500 }
      );
    }

    // 3. Find User
    const user = await User.findOne({ 
      $or: [{ email: identifier }, { username: identifier }] 
    });
    if (!user) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 4. Verify Password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 5. Generate JWT
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Vercel Config Error: JWT_SECRET environment variable is missing." },
        { status: 500 }
      );
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      jwtSecret,
      { expiresIn: "7d" }
    );

    // 6. Return response with cookie
    const response = NextResponse.json<ApiResponse>(
      { 
        success: true,
        message: "Login successful",
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

    response.cookies.set({
      name: 'vader_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error("Login Error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
