import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { ApiResponse } from "@/helpers/apiResponse";

const registerSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. Validate Input
    const parseResult = registerSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Invalid input", errors: parseResult.error.format() },
        { status: 400 }
      );
    }
    
    const { username, email, password } = parseResult.data;

    // 2. Connect DB
    await dbConnect();

    // 3. Check for existing user
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Username or email already exists" },
        { status: 409 }
      );
    }

    // 4. Hash Password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 5. Create User
    const newUser = await User.create({
      username,
      email,
      passwordHash,
    });

    // 6. Generate JWT (Auto-login)
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined");
    }

    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      jwtSecret,
      { expiresIn: "7d" }
    );

    return NextResponse.json<ApiResponse>(
      { 
        success: true, 
        message: "User registered successfully",
        data: {
          token,
          user: {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
            onboardingCompleted: newUser.onboardingCompleted
          }
        }
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Register Error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
