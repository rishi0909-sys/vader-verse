import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

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
      return NextResponse.json(
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
      return NextResponse.json(
        { success: false, message: "Username or email already exists" },
        { status: 409 }
      );
    }

    // 4. Hash Password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 5. Create User
    // SECURE FIX: All new users default to "user". Admin promotion must be done directly via DB or secure server process.
    const newUser = await User.create({
      username,
      email,
      passwordHash,
      role: "user",
    });

    return NextResponse.json(
      { success: true, message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
