import { generateText, Output } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import UserInteraction from "@/models/UserInteraction";
import UserPreference from "@/models/UserPreference";
import GameSession from "@/models/GameSession";
import Game from "@/models/Game";
import News from "@/models/News";
import Tournament from "@/models/Tournament";
import dbConnect from "@/lib/mongodb";
import {
  PERSONALIZATION_CONFIG,
  calculateDecayFactor,
  calculateDurationMultiplier
} from "@/config/personalization";

// We keep Gemini for extracting high-level concepts (currentInterests)
const GeminiExtractionSchema = z.object({
  currentInterests: z.array(z.string()).describe("Semantic concepts or trends (e.g. 'Competitive FPS', 'Dark Fantasy') based on the recent behavior"),
});

export async function processUserPersonalization(userId: string): Promise<{ success: boolean; message?: string; processed?: number; profile?: any; error?: string }> {
  await dbConnect();
  
  // 1. Get current preference
  let userPref = await UserPreference.findOne({ userId });
  if (!userPref) {
    userPref = new UserPreference({ userId });
  }

  const now = new Date();
  const lastProcessedAt = userPref.lastProcessedAt || new Date(0);
  
  // Decay factors
  const timeSinceLastRunDecay = calculateDecayFactor(lastProcessedAt, now);
  const timeSinceLastRunNegativeDecay = calculateDecayFactor(lastProcessedAt, now, PERSONALIZATION_CONFIG.negativeDecay.halfLifeDays);

  // 2. Fetch NEW interactions for Long-Term incremental update
  const newInteractions = await UserInteraction.find({
    userId,
    createdAt: { $gt: lastProcessedAt }
  }).lean();

  const newSessions = await GameSession.find({
    user: userId,
    createdAt: { $gt: lastProcessedAt }
  }).populate("game").lean();

  if (newInteractions.length === 0 && newSessions.length === 0) {
    return { success: true, message: "No new interactions to process.", processed: 0 };
  }

  // 3. Fetch RECENT interactions for Recent window calculation
  const recentThresholdDate = new Date(now.getTime() - (PERSONALIZATION_CONFIG.horizons.recentDays * 24 * 60 * 60 * 1000));
  const recentInteractions = await UserInteraction.find({
    userId,
    createdAt: { $gt: recentThresholdDate }
  }).lean();

  const recentSessions = await GameSession.find({
    user: userId,
    createdAt: { $gt: recentThresholdDate }
  }).populate("game").lean();

  // 4. Build lookup maps for interaction metadata
  const allGameIds = new Set<string>();
  const allArticleIds = new Set<string>();
  const allTournamentIds = new Set<string>();

  [...newInteractions, ...recentInteractions].forEach(i => {
    if (i.itemType === "game") allGameIds.add(i.itemId.toString());
    else if (i.itemType === "article") allArticleIds.add(i.itemId.toString());
    else if (i.itemType === "tournament") allTournamentIds.add(i.itemId.toString());
  });

  const [games, news, tournaments] = await Promise.all([
    allGameIds.size > 0 ? Game.find({ _id: { $in: Array.from(allGameIds) } }).lean() : [],
    allArticleIds.size > 0 ? News.find({ _id: { $in: Array.from(allArticleIds) } }).lean() : [],
    allTournamentIds.size > 0 ? Tournament.find({ _id: { $in: Array.from(allTournamentIds) } }).lean() : []
  ]);

  const itemMetadataMap = new Map<string, any>();
  games.forEach(g => itemMetadataMap.set(g._id.toString(), { title: g.title, genres: g.genres || [], tags: g.tags || [] }));
  news.forEach(n => itemMetadataMap.set(n._id.toString(), { title: n.title, genres: n.genres || [], tags: n.tags || [] }));
  tournaments.forEach(t => itemMetadataMap.set(t._id.toString(), { title: t.title, genres: t.game?.genres || [], tags: t.game?.tags || [] }));

  // --- HELPER: Aggregate Evidence ---
  const aggregateEvidence = (interactions: any[], sessions: any[], isIncremental = false) => {
    const aggregated = { 
      genres: new Map<string, number>(), 
      tags: new Map<string, number>(), 
      counts: new Map<string, number>(),
      metrics: {
        genres: new Map<string, { evidenceCount: number, explicitPositive: number, uniqueItems: Set<string>, negativeScore: number }>(),
        tags: new Map<string, { evidenceCount: number, explicitPositive: number, uniqueItems: Set<string>, negativeScore: number }>(),
      }
    };
    
    const initMetrics = (map: Map<string, any>, key: string) => {
      if (!map.has(key)) map.set(key, { evidenceCount: 0, explicitPositive: 0, uniqueItems: new Set<string>(), negativeScore: 0 });
      return map.get(key)!;
    };

    const addScore = (map: Map<string, number>, key: string, score: number) => {
      if (!key) return;
      map.set(key, (map.get(key) || 0) + score);
    };

    interactions.forEach(interaction => {
      const action = interaction.action;
      const itemId = interaction.itemId.toString();
      
      const isNegative = action === "dislike" || action === "skip";
      const isExplicit = ["like", "save", "join"].includes(action);
      
      let effectiveWeight = 0;
      let negativeWeight = 0;
      
      const decayFactor = isIncremental ? calculateDecayFactor(interaction.createdAt, now) : 1.0;
      
      if (isNegative) {
        const baseNeg = (PERSONALIZATION_CONFIG.negativeWeights as any)[action] || 1.0;
        const negDecay = isIncremental ? calculateDecayFactor(interaction.createdAt, now, PERSONALIZATION_CONFIG.negativeDecay.halfLifeDays) : 1.0;
        negativeWeight = baseNeg * negDecay;
      } else {
        const baseWeight = (PERSONALIZATION_CONFIG.actionWeights as any)[action] || 1.0;
        effectiveWeight = baseWeight * decayFactor;
      }
      
      const meta = itemMetadataMap.get(itemId);
      if (meta) {
        meta.genres.forEach((genre: string) => {
          if (!isNegative) addScore(aggregated.genres, genre, effectiveWeight);
          addScore(aggregated.counts, `genre_${genre}`, 1);
          const metrics = initMetrics(aggregated.metrics.genres, genre);
          if (isNegative) metrics.negativeScore += negativeWeight;
          else {
            metrics.evidenceCount += decayFactor;
            if (isExplicit) metrics.explicitPositive += decayFactor;
            metrics.uniqueItems.add(itemId);
          }
        });
        meta.tags.forEach((tag: string) => {
          if (!isNegative) addScore(aggregated.tags, tag, effectiveWeight);
          addScore(aggregated.counts, `tag_${tag}`, 1);
          const metrics = initMetrics(aggregated.metrics.tags, tag);
          if (isNegative) metrics.negativeScore += negativeWeight;
          else {
            metrics.evidenceCount += decayFactor;
            if (isExplicit) metrics.explicitPositive += decayFactor;
            metrics.uniqueItems.add(itemId);
          }
        });
      }
    });

    sessions.forEach(session => {
      const game = session.game as any;
      if (!game || !game.title) return;
      const itemId = game._id.toString();
      const baseWeight = PERSONALIZATION_CONFIG.actionWeights.play;
      const durationMultiplier = calculateDurationMultiplier(session.sessionDuration || 0);
      const decayFactor = isIncremental ? calculateDecayFactor(session.createdAt, now) : 1.0;
      const effectiveWeight = baseWeight * durationMultiplier * decayFactor;
      
      game.genres?.forEach((genre: string) => {
        addScore(aggregated.genres, genre, effectiveWeight);
        addScore(aggregated.counts, `genre_${genre}`, 1);
        const metrics = initMetrics(aggregated.metrics.genres, genre);
        metrics.evidenceCount += decayFactor;
        metrics.uniqueItems.add(itemId);
      });
      game.tags?.forEach((tag: string) => {
        addScore(aggregated.tags, tag, effectiveWeight);
        addScore(aggregated.counts, `tag_${tag}`, 1);
        const metrics = initMetrics(aggregated.metrics.tags, tag);
        metrics.evidenceCount += decayFactor;
        metrics.uniqueItems.add(itemId);
      });
    });

    return aggregated;
  };

  // 5. Calculate New Long-Term Incremental Evidence
  const newLongTermEvidence = aggregateEvidence(newInteractions, newSessions, true);

  // Apply decay to existing Long-Term preferences and add new evidence
  const updatedLongTermGenres = new Map<string, number>();
  const updatedLongTermTags = new Map<string, number>();

  if (!userPref.longTerm) userPref.longTerm = { genres: new Map(), tags: new Map() };
  if (!userPref.longTerm.genres) userPref.longTerm.genres = new Map();
  if (!userPref.longTerm.tags) userPref.longTerm.tags = new Map();

  userPref.longTerm.genres.forEach((oldScore: number, genre: string) => updatedLongTermGenres.set(genre, oldScore * timeSinceLastRunDecay));
  userPref.longTerm.tags.forEach((oldScore: number, tag: string) => updatedLongTermTags.set(tag, oldScore * timeSinceLastRunDecay));
  newLongTermEvidence.genres.forEach((score, genre) => updatedLongTermGenres.set(genre, (updatedLongTermGenres.get(genre) || 0) + score));
  newLongTermEvidence.tags.forEach((score, tag) => updatedLongTermTags.set(tag, (updatedLongTermTags.get(tag) || 0) + score));

  userPref.longTerm.genres = updatedLongTermGenres as any;
  userPref.longTerm.tags = updatedLongTermTags as any;

  // --- Confidence & Negative Signals (Stage 5) ---
  
  if (!userPref.confidenceMetrics) userPref.confidenceMetrics = { genres: new Map(), tags: new Map() };
  if (!userPref.confidence) userPref.confidence = new Map();
  if (!userPref.negativeSignals) userPref.negativeSignals = { genres: new Map(), tags: new Map() };
  
  const processMetrics = (
    type: 'genres' | 'tags',
    newMetrics: Map<string, { evidenceCount: number, explicitPositive: number, uniqueItems: Set<string>, negativeScore: number }>
  ) => {
    const existingMetricsMap = userPref.confidenceMetrics[type] || new Map();
    const existingNegativeMap = userPref.negativeSignals[type] || new Map();
    const updatedMetrics = new Map<string, any>();
    const updatedNegative = new Map<string, number>();
    const allKeys = new Set<string>([...(Array.from(existingMetricsMap.keys()) as string[]), ...(Array.from(newMetrics.keys()) as string[])]);
    
    allKeys.forEach((key: string) => {
      // 1. Decay existing metrics
      const oldM = existingMetricsMap.get(key) || { evidenceCount: 0, explicitPositive: 0, uniqueItems: [] };
      const oldNeg = existingNegativeMap.get(key) || 0;
      
      let evCount = oldM.evidenceCount * timeSinceLastRunDecay;
      let expCount = oldM.explicitPositive * timeSinceLastRunDecay;
      let negScore = oldNeg * timeSinceLastRunNegativeDecay;
      const uItems = new Set<string>(oldM.uniqueItems || []);
      
      // 2. Add new metrics
      const newM = newMetrics.get(key);
      if (newM) {
        evCount += newM.evidenceCount;
        expCount += newM.explicitPositive;
        negScore += newM.negativeScore;
        newM.uniqueItems.forEach(id => uItems.add(id));
      }
      
      // Cap unique items array size to prevent MongoDB document bloat
      const finalUniqueItems = Array.from(uItems).slice(-100);
      
      updatedMetrics.set(key, { evidenceCount: evCount, explicitPositive: expCount, uniqueItems: finalUniqueItems });
      
      // Bound negative score (0.0 to 1.0 range representing negative influence scale, or keep raw and cap)
      // We will keep it raw but cap at e.g. 100 for safety
      updatedNegative.set(key, Math.min(100.0, negScore));
      
      // 3. Calculate Confidence (0.0 -> 1.0)
      const effectiveEvidence = evCount + 
        (expCount * PERSONALIZATION_CONFIG.confidence.explicitMultiplier) + 
        (Math.max(0, finalUniqueItems.length - 1) * PERSONALIZATION_CONFIG.confidence.uniqueItemMultiplier);
        
      const confidenceScore = 1.0 - Math.exp(-effectiveEvidence / PERSONALIZATION_CONFIG.confidence.kFactor);
      
      // Only set confidence if it's meaningful (e.g. > 0.01) to save DB space
      if (confidenceScore > 0.01) {
        userPref.confidence.set(key, Number(confidenceScore.toFixed(2)));
      }
    });
    
    userPref.confidenceMetrics[type] = updatedMetrics as any;
    userPref.negativeSignals[type] = updatedNegative as any;
  };

  processMetrics('genres', newLongTermEvidence.metrics.genres);
  processMetrics('tags', newLongTermEvidence.metrics.tags);

  // 6. Calculate Recent Interests
  const recentEvidence = aggregateEvidence(recentInteractions, recentSessions, false);
  
  if (!userPref.recent) userPref.recent = { genres: new Map(), tags: new Map() };
  userPref.recent.genres = recentEvidence.genres as any;
  userPref.recent.tags = recentEvidence.tags as any;

  // 7. Calculate Emerging Interests
  const emerging: Array<{ name: string, type: string, growthRate: number }> = [];
  
  const detectEmerging = (recentMap: Map<string, number>, longTermMap: Map<string, number>, counts: Map<string, number>, prefix: string, type: string) => {
    recentMap.forEach((recentScore, name) => {
      const historicalScore = longTermMap.get(name) || 0;
      const count = counts.get(`${prefix}_${name}`) || 0;
      
      const safeHistoricalBaseline = Math.max(1.0, historicalScore - recentScore); 
      const growthRate = recentScore / safeHistoricalBaseline;
      
      if (
        count >= PERSONALIZATION_CONFIG.thresholds.minRecentEvidenceCount &&
        recentScore >= PERSONALIZATION_CONFIG.thresholds.minRecentScore &&
        growthRate >= PERSONALIZATION_CONFIG.thresholds.minGrowthRate
      ) {
        emerging.push({ name, type, growthRate: Number(growthRate.toFixed(2)) });
      }
    });
  };

  detectEmerging(recentEvidence.genres, updatedLongTermGenres, recentEvidence.counts, "genre", "genre");
  detectEmerging(recentEvidence.tags, updatedLongTermTags, recentEvidence.counts, "tag", "tag");

  userPref.emerging = emerging as any;

  // 8. Derive Legacy Compatibility Fields
  const sortedGenres = Array.from(updatedLongTermGenres.entries()).sort((a, b) => b[1] - a[1]);
  const sortedTags = Array.from(updatedLongTermTags.entries()).sort((a, b) => b[1] - a[1]);
  
  userPref.topGenres = sortedGenres.slice(0, 5).map(g => g[0]);
  userPref.topTags = sortedTags.slice(0, 5).map(t => t[0]);
  
  const maxGenreScore = sortedGenres[0]?.[1] || 1;
  const maxTagScore = sortedTags[0]?.[1] || 1;
  
  const legacyGenreScores: Record<string, number> = {};
  sortedGenres.forEach(([name, score]) => legacyGenreScores[name] = Math.min(100, Math.round((score / maxGenreScore) * 100)));
  userPref.genreScores = legacyGenreScores as any;

  const legacyTagScores: Record<string, number> = {};
  sortedTags.forEach(([name, score]) => legacyTagScores[name] = Math.min(100, Math.round((score / maxTagScore) * 100)));
  userPref.tagScores = legacyTagScores as any;

  const gameDurations = new Map<string, number>();
  newSessions.forEach(s => {
    const title = (s.game as any)?.title;
    if (title) gameDurations.set(title, (gameDurations.get(title) || 0) + (s.sessionDuration || 0));
  });
  const sortedGames = Array.from(gameDurations.entries()).sort((a, b) => b[1] - a[1]);
  if (sortedGames.length > 0) {
    const existingFavorites = new Set(userPref.favoriteGames || []);
    sortedGames.slice(0, 3).forEach(g => existingFavorites.add(g[0]));
    userPref.favoriteGames = Array.from(existingFavorites).slice(0, 5);
  }

  userPref.lastProcessedAt = now;

  // 9. Gemini semantic extraction
  try {
    const promptContext = `
You are an expert AI gaming recommendation engine.
Review the user's mathematically calculated behavioral profile:

LONG-TERM INTERESTS:
${JSON.stringify(userPref.topGenres)}

RECENT BEHAVIOR (Last ${PERSONALIZATION_CONFIG.horizons.recentDays} days):
${JSON.stringify(Array.from(recentEvidence.genres.keys()))}

EMERGING TRENDS (Rapid recent growth):
${JSON.stringify(emerging)}

Based ONLY on this data, output 2-3 short semantic phrases describing their 'currentInterests' (e.g. "Competitive FPS", "Dark Fantasy RPGs").
Do NOT invent interests not present in the data.
`;

    const { output: semanticProfile } = await generateText({
      model: google("gemini-3.6-flash"),
      output: Output.object({ schema: GeminiExtractionSchema }),
      prompt: promptContext,
    });
    
    userPref.currentInterests = semanticProfile.currentInterests;
  } catch (error) {
    console.error("Error during Gemini semantic extraction:", error);
  }

  await userPref.save();
  
  // Developer Debug
  console.log("\n--- STAGE 5: CONFIDENCE + NEGATIVE SIGNALS ---");
  console.log("Genres:");
  Array.from(updatedLongTermGenres.entries()).slice(0,3).forEach(([g, score]) => {
    const conf = userPref.confidence.get(g) || 0;
    const neg = userPref.negativeSignals.genres.get(g) || 0;
    console.log(`${g.padEnd(12)} score: ${score.toFixed(1).padEnd(6)} confidence: ${conf.toFixed(2)}  negative: ${neg.toFixed(2)}`);
  });
  console.log("\nEmerging:");
  emerging.forEach(e => {
    const conf = userPref.confidence.get(e.name) || 0;
    console.log(`${e.name.padEnd(12)} growth: ${e.growthRate.toFixed(1).padEnd(6)} confidence: ${conf.toFixed(2)}`);
  });
  console.log("----------------------------------------------\n");

  return { success: true, processed: newInteractions.length + newSessions.length, profile: userPref };
}

export async function processPendingPersonalizations() {
  await dbConnect();
  const distinctUsers = await UserInteraction.distinct("userId");
  let processedUsers = 0;
  
  for (const userId of distinctUsers) {
    const result = await processUserPersonalization(userId);
    if (result.success && result.processed && result.processed > 0) {
      processedUsers++;
    }
  }
  
  return { success: true, processedUsers };
}
