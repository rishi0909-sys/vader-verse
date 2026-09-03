import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(process.cwd(), ".env") });
dotenv.config({ path: resolve(process.cwd(), ".env.local"), override: true });

import dbConnect from "../lib/mongodb";
import Game from "../models/Game";
import News from "../models/News";
import Tournament from "../models/Tournament";
import GameSession from "../models/GameSession";
import UserInteraction from "../models/UserInteraction";

async function run() {
  await dbConnect();
  
  const testRunId = "AI_TEST_1787944028808";

  console.log(`Checking for old data with testRunId: ${testRunId}`);

  const gameCount = await Game.countDocuments({ testRunId });
  const newsCount = await News.countDocuments({ testRunId });
  const tournamentCount = await Tournament.countDocuments({ testRunId });
  const sessionCount = await GameSession.countDocuments({ testRunId });
  const interactionCount = await UserInteraction.countDocuments({ testRunId });

  console.log(`\nDocuments found and slated for deletion:`);
  console.log(`- Games: ${gameCount}`);
  console.log(`- News articles: ${newsCount}`);
  console.log(`- Tournaments: ${tournamentCount}`);
  console.log(`- GameSessions: ${sessionCount}`);
  console.log(`- UserInteractions: ${interactionCount}`);
  
  process.exit(0);
}

run().catch(console.dir);
