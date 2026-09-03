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

  console.log(`Deleting old data with testRunId: ${testRunId}`);

  await Game.deleteMany({ testRunId });
  await News.deleteMany({ testRunId });
  await Tournament.deleteMany({ testRunId });
  await GameSession.deleteMany({ testRunId });
  await UserInteraction.deleteMany({ testRunId });

  console.log(`Deletion complete.`);
  process.exit(0);
}

run().catch(console.dir);
