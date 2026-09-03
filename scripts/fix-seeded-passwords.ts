import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(process.cwd(), ".env") });
dotenv.config({ path: resolve(process.cwd(), ".env.local"), override: true });

import dbConnect from "../lib/mongodb";
import User from "../models/User";

async function run() {
  await dbConnect();
  
  console.log("Fixing passwords for seeded AI users...");
  
  // Hash the password "123"
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("123", salt);
  
  // Find users that start with 'user_a_rpg', 'user_b_fps', 'user_c_sports' or just any user with passwordHash '123'
  const result = await User.updateMany(
    { passwordHash: "123" },
    { $set: { passwordHash: hashedPassword } }
  );
  
  console.log(`Updated ${result.modifiedCount} users to have a valid bcrypt hash for the password "123".`);
  
  // Fetch their emails so the user can easily copy-paste
  const users = await User.find({ passwordHash: hashedPassword });
  console.log("\n--- SEEDED USERS YOU CAN LOG IN AS ---");
  for (const u of users) {
    if (u.testRunId) {
      console.log(`Email: ${u.email}`);
      console.log(`Password: 123`);
      console.log("-----------------------------------");
    }
  }

  process.exit(0);
}

run().catch(console.dir);
