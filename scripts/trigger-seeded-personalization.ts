import * as dotenv from "dotenv";
import { resolve } from "path";
dotenv.config({ path: resolve(process.cwd(), ".env") });
import dbConnect from "../lib/mongodb";
import User from "../models/User";
import { processUserPersonalization } from "../services/aiPersonalizationService";

async function run() {
  await dbConnect();
  console.log("Triggering AI personalization for seeded users...");
  
  // Find users that start with user_a, user_b, user_c
  const users = await User.find({ 
    testRunId: { $regex: "^SEED_AI_" }
  });
  
  console.log(`Found ${users.length} seeded users to process.`);
  
  for (const user of users) {
    console.log(`\nProcessing user: ${user.email}`);
    try {
      const result = await processUserPersonalization(user._id.toString());
      console.log(`Success: ${result.success}`);
      if (result.success && result.profile) {
        console.log(`Top Genres:`, result.profile.topGenres);
        console.log(`Top Tags:`, result.profile.topTags);
      } else {
        console.log(`Result:`, result);
      }
    } catch (err) {
      console.error(`Failed to process user ${user.email}`, err);
    }
  }
  
  console.log("\nDone!");
  process.exit(0);
}

run().catch(console.error);
