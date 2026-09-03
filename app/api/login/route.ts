import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { ApiResponse } from "@/helpers/apiResponse";

const loginSchema = z.object({
  email: z.string().email(),
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
    
    const { email, password } = parseResult.data;

    // 2. Connect DB
    await dbConnect();

    // 3. Find User
    const user = await User.findOne({ email });
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
      throw new Error("JWT_SECRET is not defined");
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      jwtSecret,
      { expiresIn: "7d" }
    );

    // 6. Return response
    return NextResponse.json<ApiResponse>(
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
  } catch (error: any) {
    console.error("Login Error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
