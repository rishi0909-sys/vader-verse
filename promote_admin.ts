import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User";

dotenv.config({ path: ".env" });

async function promoteAdmin() {
  try {
    if (!process.env.MONGO_URI) throw new Error("No Mongo URI");
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOneAndUpdate(
      { email: "rishabhmudgal604@gmail.com" },
      { $set: { role: "admin" } },
      { new: true }
    );
    if (user) {
      console.log("Successfully promoted user to admin:", user.username, user.email, user.role);
    } else {
      console.log("User not found! Ensure you have registered an account with this email first.");
    }
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

promoteAdmin();
