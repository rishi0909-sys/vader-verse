import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(process.cwd(), ".env") });
dotenv.config({ path: resolve(process.cwd(), ".env.local"), override: true });

import { getGameRecommendations, getNewsRecommendations, getTournamentRecommendations } from "../services/recommendationEngine";
import { generateRecommendationExplanation } from "../services/aiExplanationService";

async function run() {
  const userId = "6a95f943b9096e8ac1ef93df";
  
  const games = await getGameRecommendations(userId, 1);
  console.log("\n=== GAMES ===");
  console.log(JSON.stringify(games[0], null, 2));
  
  const news = await getNewsRecommendations(userId, 1);
  console.log("\n=== NEWS ===");
  console.log(JSON.stringify(news[0], null, 2));
  
  const tournaments = await getTournamentRecommendations(userId, 1);
  console.log("\n=== TOURNAMENTS ===");
  console.log(JSON.stringify(tournaments[0], null, 2));

  console.log("\n=== EXPLANATION ===");
  const explanation = await generateRecommendationExplanation(userId, games[0].item._id.toString(), "game");
  console.log(JSON.stringify(explanation, null, 2));

  process.exit(0);
}

run().catch(console.dir);
