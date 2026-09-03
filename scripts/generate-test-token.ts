import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import dbConnect from "../lib/mongodb";
import User from "../models/User";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

async function generate() {
  await dbConnect();
  const user = await User.findOne({ testRunId: { $regex: "^SEED_AI_" } });
  
  if (!user) {
    console.log("No seeded user found. Run the seed script first.");
    process.exit(1);
  }

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
  
  console.log("====================================");
  console.log("Use this token in Postman (Authorization: Bearer <token>):");
  console.log("====================================");
  console.log(token);
  console.log("====================================");
  console.log(`User ID: ${user._id}`);
  console.log(`Username: ${user.username}`);
  
  process.exit(0);
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
