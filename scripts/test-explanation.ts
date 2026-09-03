import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(process.cwd(), ".env") });
dotenv.config({ path: resolve(process.cwd(), ".env.local"), override: true });

import { generateRecommendationExplanation } from "../services/aiExplanationService";

async function run() {
  const userId = "6a95f943b9096e8ac1ef93df";
  
  // Replace with a known game ID from the database
  const itemId = "6a95f944b9096e8ac1ef93e2"; // Elden Ring
  const itemType = "game";
  
  console.log(`Generating explanation for User ${userId}, Game ${itemId}...`);
  
  const result = await generateRecommendationExplanation(userId, itemId, itemType);
  
  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
}

run().catch(console.dir);
