import * as dotenv from "dotenv";
import { resolve } from "path";
dotenv.config({ path: resolve(process.cwd(), ".env") });

import dbConnect from "./lib/mongodb";
import UserPreference from "./models/UserPreference";
import User from "./models/User";

async function run() {
  await dbConnect();
  const prefs = await UserPreference.find().lean();
  if (prefs.length === 0) {
    console.log("No user preferences found in the database!");
  }
  for (const pref of prefs) {
    const user = await User.findById(pref.userId).lean();
    console.log(`User: ${user?.email || "Unknown"} | ID: ${pref.userId}`);
    console.log(`Top Genres:`, pref.topGenres);
    console.log(`Genre Scores:`, pref.genreScores);
    console.log(`Top Tags:`, pref.topTags);
    console.log("-------------------");
  }
  process.exit(0);
}
run().catch(console.error);
