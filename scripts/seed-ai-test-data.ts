import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import dbConnect from "../lib/mongodb";
import User from "../models/User";
import Game from "../models/Game";
import News from "../models/News";
import Tournament from "../models/Tournament";
import UserInteraction from "../models/UserInteraction";
import GameSession from "../models/GameSession";

const TEST_RUN_ID = `SEED_AI_${Date.now()}`;

const logHeader = (title: string) => {
  console.log(`\n====================================`);
  console.log(title);
  console.log(`====================================\n`);
};

async function cleanupOldSeeds() {
  console.log("Cleaning up previous seed data (with SEED_AI_ prefix)...");
  await UserInteraction.deleteMany({ testRunId: { $regex: "^SEED_AI_" } });
  await GameSession.deleteMany({ testRunId: { $regex: "^SEED_AI_" } });
  await User.deleteMany({ testRunId: { $regex: "^SEED_AI_" } });
  await Game.deleteMany({ testRunId: { $regex: "^SEED_AI_" } });
  await News.deleteMany({ testRunId: { $regex: "^SEED_AI_" } });
  await Tournament.deleteMany({ testRunId: { $regex: "^SEED_AI_" } });
}

async function seed() {
  logHeader("SEEDING AI TEST DATA");
  await dbConnect();
  await cleanupOldSeeds();

  // 1. Create Users
  const userA = await User.create({ username: `user_a_rpg_${Date.now()}`, email: `user_a_rpg_${Date.now()}@test.com`, passwordHash: "123", testRunId: TEST_RUN_ID });
  const userB = await User.create({ username: `user_b_fps_${Date.now()}`, email: `user_b_fps_${Date.now()}@test.com`, passwordHash: "123", testRunId: TEST_RUN_ID });
  const userC = await User.create({ username: `user_c_sports_${Date.now()}`, email: `user_c_sports_${Date.now()}@test.com`, passwordHash: "123", testRunId: TEST_RUN_ID });

  console.log("Users Created:");
  console.log(`User A (RPG): ${userA._id}`);
  console.log(`User B (FPS): ${userB._id}`);
  console.log(`User C (Sports): ${userC._id}`);

  // 2. Create Games (15)
  const gameData = [
    // RPG / Action
    { title: "Elden Ring", slug: "elden-ring", genres: ["RPG", "Action"] },
    { title: "Sekiro", slug: "sekiro", genres: ["Action"] },
    { title: "Lies of P", slug: "lies-of-p", genres: ["RPG", "Action"] },
    { title: "The Witcher 3", slug: "witcher-3", genres: ["RPG"] },
    { title: "Baldur's Gate 3", slug: "bg3", genres: ["RPG", "Strategy"] },
    // FPS / Esports
    { title: "Valorant", slug: "valorant", genres: ["FPS", "Action"] },
    { title: "CS2", slug: "cs2", genres: ["FPS", "Action"] },
    { title: "Apex Legends", slug: "apex", genres: ["FPS", "Battle Royale"] },
    { title: "Overwatch 2", slug: "ow2", genres: ["FPS", "Action"] },
    { title: "Rainbow Six Siege", slug: "r6s", genres: ["FPS", "Action"] },
    // Sports / Racing
    { title: "FIFA 24", slug: "fifa-24", genres: ["Sports"] },
    { title: "Rocket League", slug: "rocket-league", genres: ["Sports", "Racing"] },
    { title: "F1 23", slug: "f1-23", genres: ["Racing", "Sports"] },
    { title: "NBA 2K24", slug: "nba-2k24", genres: ["Sports"] },
    { title: "Forza Horizon 5", slug: "forza-5", genres: ["Racing"] }
  ];
  
  const games = await Game.insertMany(gameData.map(g => ({ ...g, testRunId: TEST_RUN_ID })));

  // 3. Create News (15)
  const newsData = [
    { title: "Elden Ring DLC Shadow of the Erdtree Drops Next Week", content: "...", genres: ["RPG", "Action"], tags: ["Soulslike", "Dark Fantasy"] },
    { title: "How to beat Malenia easily in Elden Ring", content: "...", genres: ["RPG", "Action"], tags: ["Difficult", "Soulslike"] },
    { title: "Lies of P announces sequel in development", content: "...", genres: ["RPG", "Action"], tags: ["Dark Fantasy", "Soulslike"] },
    { title: "Sekiro Mod adds multiplayer PvP", content: "...", genres: ["Action"], tags: ["Soulslike", "Multiplayer"] },
    { title: "Top 10 RPGs coming this year", content: "...", genres: ["RPG"], tags: ["Fantasy"] },
    
    { title: "Valorant Champions 2026 Grand Final Analysis", content: "...", genres: ["FPS", "Action"], tags: ["Competitive", "Esports", "Tactical"] },
    { title: "CS2 Source 2 Engine Updates", content: "...", genres: ["FPS", "Action"], tags: ["Competitive", "Esports"] },
    { title: "Apex Legends New Season Patch Notes", content: "...", genres: ["FPS", "Battle Royale"], tags: ["Competitive", "Multiplayer"] },
    { title: "Overwatch 2 Hero Tier List", content: "...", genres: ["FPS"], tags: ["Hero Shooter", "Competitive"] },
    { title: "R6 Siege Pro League Standings", content: "...", genres: ["FPS", "Action"], tags: ["Esports", "Tactical"] },

    { title: "FIFA 24 Ultimate Team Tips", content: "...", genres: ["Sports"], tags: ["Competitive", "Sports"] },
    { title: "Rocket League RLCS World Championship Preview", content: "...", genres: ["Sports", "Racing"], tags: ["Esports", "Competitive"] },
    { title: "F1 23 Update fixes handling issues", content: "...", genres: ["Racing", "Sports"], tags: ["Racing"] },
    { title: "NBA 2K24 Best Builds for Pro-Am", content: "...", genres: ["Sports"], tags: ["Competitive", "Sports"] },
    { title: "Forza Horizon 5 New Expansion Rumors", content: "...", genres: ["Racing"], tags: ["Racing", "Open World"] }
  ];

  const news = await News.insertMany(newsData.map(n => ({ ...n, testRunId: TEST_RUN_ID })));

  // 4. Create Tournaments (10)
  const tournaments = await Tournament.insertMany([
    { title: "Soulslike Speedrun Race", game: games[0]._id, startDate: new Date(), createdBy: userA._id, status: "ongoing", testRunId: TEST_RUN_ID }, // Elden
    { title: "Lies of P No-Hit Challenge", game: games[2]._id, startDate: new Date(), createdBy: userA._id, status: "registration_open", testRunId: TEST_RUN_ID },
    { title: "Witcher Gwent Tournament", game: games[3]._id, startDate: new Date(), createdBy: userA._id, status: "upcoming", testRunId: TEST_RUN_ID },
    
    { title: "Valorant VCT Challengers", game: games[5]._id, startDate: new Date(), createdBy: userB._id, status: "ongoing", testRunId: TEST_RUN_ID },
    { title: "CS2 Major Qualifier", game: games[6]._id, startDate: new Date(), createdBy: userB._id, status: "registration_open", testRunId: TEST_RUN_ID },
    { title: "Apex Legends Global Series", game: games[7]._id, startDate: new Date(), createdBy: userB._id, status: "upcoming", testRunId: TEST_RUN_ID },
    { title: "R6 Siege Invitational", game: games[9]._id, startDate: new Date(), createdBy: userB._id, status: "upcoming", testRunId: TEST_RUN_ID },
    
    { title: "FIFA eWorld Cup", game: games[10]._id, startDate: new Date(), createdBy: userC._id, status: "ongoing", testRunId: TEST_RUN_ID },
    { title: "Rocket League Championship Series", game: games[11]._id, startDate: new Date(), createdBy: userC._id, status: "registration_open", testRunId: TEST_RUN_ID },
    { title: "F1 Esports Pro Exhibition", game: games[12]._id, startDate: new Date(), createdBy: userC._id, status: "upcoming", testRunId: TEST_RUN_ID }
  ]);

  // 5. Create Game Sessions (30+)
  // User A (RPG) - plays a lot of Elden Ring, Sekiro, Lies of P
  for(let i=0; i<15; i++) {
    const d1 = new Date();
    const s1 = 3600 + Math.random()*3600;
    await GameSession.create({ user: userA._id, game: games[0]._id, startedAt: d1, endedAt: new Date(d1.getTime() + s1 * 1000), sessionDuration: s1, testRunId: TEST_RUN_ID });
    
    const d2 = new Date();
    const s2 = 2000 + Math.random()*1000;
    await GameSession.create({ user: userA._id, game: games[1]._id, startedAt: d2, endedAt: new Date(d2.getTime() + s2 * 1000), sessionDuration: s2, testRunId: TEST_RUN_ID });
    
    const d3 = new Date();
    const s3 = 3000 + Math.random()*2000;
    await GameSession.create({ user: userA._id, game: games[2]._id, startedAt: d3, endedAt: new Date(d3.getTime() + s3 * 1000), sessionDuration: s3, testRunId: TEST_RUN_ID });
  }

  // User B (FPS) - plays Valorant, CS2, Apex
  for(let i=0; i<15; i++) {
    const d1 = new Date();
    const s1 = 5000 + Math.random()*3600;
    await GameSession.create({ user: userB._id, game: games[5]._id, startedAt: d1, endedAt: new Date(d1.getTime() + s1 * 1000), sessionDuration: s1, testRunId: TEST_RUN_ID });
    
    const d2 = new Date();
    const s2 = 4000 + Math.random()*1000;
    await GameSession.create({ user: userB._id, game: games[6]._id, startedAt: d2, endedAt: new Date(d2.getTime() + s2 * 1000), sessionDuration: s2, testRunId: TEST_RUN_ID });
    
    const d3 = new Date();
    const s3 = 3000 + Math.random()*2000;
    await GameSession.create({ user: userB._id, game: games[7]._id, startedAt: d3, endedAt: new Date(d3.getTime() + s3 * 1000), sessionDuration: s3, testRunId: TEST_RUN_ID });
  }

  // User C (Sports) - plays FIFA, Rocket League, F1
  for(let i=0; i<15; i++) {
    const d1 = new Date();
    const s1 = 3600 + Math.random()*3600;
    await GameSession.create({ user: userC._id, game: games[10]._id, startedAt: d1, endedAt: new Date(d1.getTime() + s1 * 1000), sessionDuration: s1, testRunId: TEST_RUN_ID });
    
    const d2 = new Date();
    const s2 = 2000 + Math.random()*1000;
    await GameSession.create({ user: userC._id, game: games[11]._id, startedAt: d2, endedAt: new Date(d2.getTime() + s2 * 1000), sessionDuration: s2, testRunId: TEST_RUN_ID });
    
    const d3 = new Date();
    const s3 = 3000 + Math.random()*2000;
    await GameSession.create({ user: userC._id, game: games[12]._id, startedAt: d3, endedAt: new Date(d3.getTime() + s3 * 1000), sessionDuration: s3, testRunId: TEST_RUN_ID });
  }

  // 6. Create User Interactions (50+)
  // User A - reads RPG news, joins RPG tournaments, saves RPG games
  for(let i=0; i<10; i++) {
    await UserInteraction.create({ userId: userA._id, itemId: news[0]._id, itemType: "article", action: "read", duration: 300, testRunId: TEST_RUN_ID, metadata: { genres: news[0].genres, tags: news[0].tags }});
    await UserInteraction.create({ userId: userA._id, itemId: news[2]._id, itemType: "article", action: "like", testRunId: TEST_RUN_ID, metadata: { genres: news[2].genres, tags: news[2].tags }});
    await UserInteraction.create({ userId: userA._id, itemId: games[3]._id, itemType: "game", action: "save", testRunId: TEST_RUN_ID, metadata: { genres: games[3].genres }});
    await UserInteraction.create({ userId: userA._id, itemId: tournaments[0]._id, itemType: "tournament", action: "join", testRunId: TEST_RUN_ID }); // Tournament
  }

  // User B - reads FPS news, joins FPS tournaments, saves FPS games
  for(let i=0; i<10; i++) {
    await UserInteraction.create({ userId: userB._id, itemId: news[5]._id, itemType: "article", action: "read", duration: 300, testRunId: TEST_RUN_ID, metadata: { genres: news[5].genres, tags: news[5].tags }});
    await UserInteraction.create({ userId: userB._id, itemId: news[6]._id, itemType: "article", action: "like", testRunId: TEST_RUN_ID, metadata: { genres: news[6].genres, tags: news[6].tags }});
    await UserInteraction.create({ userId: userB._id, itemId: games[8]._id, itemType: "game", action: "save", testRunId: TEST_RUN_ID, metadata: { genres: games[8].genres }});
    await UserInteraction.create({ userId: userB._id, itemId: tournaments[3]._id, itemType: "tournament", action: "join", testRunId: TEST_RUN_ID }); // Tournament
  }

  // User C - reads Sports news, joins Sports tournaments, saves Sports games
  for(let i=0; i<10; i++) {
    await UserInteraction.create({ userId: userC._id, itemId: news[10]._id, itemType: "article", action: "read", duration: 300, testRunId: TEST_RUN_ID, metadata: { genres: news[10].genres, tags: news[10].tags }});
    await UserInteraction.create({ userId: userC._id, itemId: news[11]._id, itemType: "article", action: "like", testRunId: TEST_RUN_ID, metadata: { genres: news[11].genres, tags: news[11].tags }});
    await UserInteraction.create({ userId: userC._id, itemId: games[13]._id, itemType: "game", action: "save", testRunId: TEST_RUN_ID, metadata: { genres: games[13].genres }});
    await UserInteraction.create({ userId: userC._id, itemId: tournaments[8]._id, itemType: "tournament", action: "join", testRunId: TEST_RUN_ID }); // Tournament
  }

  logHeader("SEED SUMMARY");
  console.log(`Test Run ID: ${TEST_RUN_ID}`);
  console.log(`Users created: 3`);
  console.log(`Games created: ${games.length}`);
  console.log(`News created: ${news.length}`);
  console.log(`Tournaments created: ${tournaments.length}`);
  console.log(`Game Sessions created: 135`);
  console.log(`User Interactions created: 120`);
  console.log(`\nSuccessfully seeded AI test data!`);

  process.exit(0);
}

seed().catch(err => {
  console.error("Failed to seed data:", err);
  process.exit(1);
});
