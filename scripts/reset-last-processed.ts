import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(process.cwd(), ".env") });
dotenv.config({ path: resolve(process.cwd(), ".env.local"), override: true });

import dbConnect from "../lib/mongodb";
import UserPreference from "../models/UserPreference";
import UserInteraction from "../models/UserInteraction";

async function run() {
  await dbConnect();

  const userEmail = "user_a_rpg_1788213571952@test.com"; // We actually just know the ID from the token output: 6a95f943b9096e8ac1ef93df

  const userId = "6a95f943b9096e8ac1ef93df";

  console.log(`Resetting UserPreference for User A (${userId})...`);

  // Count total interactions for this user
  const interactionCount = await UserInteraction.countDocuments({ userId });
  console.log(`User A currently has ${interactionCount} UserInteraction records.`);

  const GameSession = (await import("../models/GameSession")).default;
  const sessionCount = await GameSession.countDocuments({ user: userId });
  console.log(`User A currently has ${sessionCount} GameSession records.`);

  // Reset their preference completely
  await UserPreference.findOneAndUpdate(
    { userId },
    {
      $set: {
        lastProcessedAt: new Date(0), // Reset to 1970
        topGenres: [],
        topTags: [],
        favoriteGames: [],
        currentInterests: [],
        genreScores: {},
        tagScores: {}
      }
    },
    { upsert: true }
  );

  console.log("Successfully reset lastProcessedAt to Jan 1 1970 and cleared preference arrays/scores.");
  console.log("Next time /api/ai/personalize is called, it will process all interactions!");
  process.exit(0);
}

run().catch(console.dir);
