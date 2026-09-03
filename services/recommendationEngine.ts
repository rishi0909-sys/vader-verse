import UserPreference from "@/models/UserPreference";
import Game from "@/models/Game";
import News from "@/models/News";
import Tournament from "@/models/Tournament";
import UserInteraction from "@/models/UserInteraction";
import dbConnect from "@/lib/mongodb";
import { PERSONALIZATION_CONFIG } from "@/config/personalization";

interface Signal {
  type: string;
  source: string;
  value: string;
  userScore: number | null;
  weight: number;
  contribution: number;
}

interface Reason {
  summary: string;
  details: string[];
}

interface BubbleClassification {
  bucket: "core" | "recent" | "adjacent" | "discovery";
  reason: string;
  relevanceStrength: number;
  confidence: number;
  isSuppressed: boolean;
}

interface MatchResult {
  score: number;
  signals: Signal[];
  reason: Reason;
  classification: BubbleClassification;
}

const CLASSIFICATION_THRESHOLDS = {
  coreConfidence: 0.60,
  coreRelevance: 40,
  recentRelevance: 20,
  adjacentRelevance: 10,
  negativeSuppression: 15.0
};

/**
 * Calculates a match score for an item based on user preferences and performs Bubble Classification.
 */
function calculateMatchScore(itemMetadata: any, userPref: any): MatchResult {
  const signals: Signal[] = [];
  const details: string[] = [];
  
  const classification: BubbleClassification = {
    bucket: "discovery",
    reason: "Exploring outside your usual preferences.",
    relevanceStrength: 0,
    confidence: 0,
    isSuppressed: false
  };
  
  if (!userPref || !itemMetadata) {
    return { score: 0, signals, reason: { summary: "Not enough preference data.", details: [] }, classification };
  }

  let highestConfidence = 0;
  let highestNegative = 0;
  let isEmerging = false;
  let isRecent = false;
  
  let longTermScore = 0;
  let recentScore = 0;

  const processLabel = (label: string, type: "genre" | "tag") => {
    // 1. Canonical Tracking
    
    // Confidence & Negative
    const conf = userPref.confidence?.get ? userPref.confidence.get(label) : (userPref.confidence?.[label] || 0);
    if (conf > highestConfidence) highestConfidence = conf;
    
    const negsMap = userPref.negativeSignals?.[type + "s"];
    const neg = negsMap?.get ? negsMap.get(label) : (negsMap?.[label] || 0);
    if (neg > highestNegative) highestNegative = neg;
    
    // Emerging check
    if (userPref.emerging && Array.isArray(userPref.emerging)) {
      if (userPref.emerging.some((e: any) => e.name === label)) {
        isEmerging = true;
      }
    }
    
    // Recent check
    const rMap = userPref.recent?.[type + "s"];
    const rScore = rMap?.get ? rMap.get(label) : (rMap?.[label] || 0);
    if (rScore > 5) isRecent = true;
    recentScore += rScore;

    // Long term check
    const ltMap = userPref.longTerm?.[type + "s"];
    const ltScore = ltMap?.get ? ltMap.get(label) : (ltMap?.[label] || 0);
    longTermScore += ltScore;

    // 2. Legacy Signal Generation (for backward compatibility)
    
    const isTopGenre = userPref.topGenres && userPref.topGenres.includes(label);
    const isTopTag = userPref.topTags && userPref.topTags.includes(label);
    
    if (isTopGenre || isTopTag) {
      signals.push({ type, source: "base_match", value: label, userScore: null, weight: 1.0, contribution: isTopGenre ? 30 : 20 });
      details.push(`Aligns with your preference for ${label}${isTopGenre ? ' games' : ''}`);
    }
    
    const aiScores = type === "genre" ? userPref.genreScores : userPref.tagScores;
    if (aiScores) {
      const aiScore = typeof aiScores.get === 'function' ? aiScores.get(label) : aiScores[label];
      if (aiScore) {
        const contribution = aiScore * (type === "genre" ? 1.5 : 1.0);
        signals.push({ type, source: "ai_preference", value: label, userScore: aiScore, weight: (type === "genre" ? 1.5 : 1.0), contribution });
        details.push(`Matches your strong interest in ${label}`);
      }
    }
  };

  if (itemMetadata.genres && Array.isArray(itemMetadata.genres)) {
    itemMetadata.genres.forEach((g: string) => processLabel(g, "genre"));
  }
  
  if (itemMetadata.tags && Array.isArray(itemMetadata.tags)) {
    itemMetadata.tags.forEach((t: string) => processLabel(t, "tag"));
  }

  // Current interests boost (Gemini extracted semantic concepts)
  if (userPref.currentInterests && Array.isArray(userPref.currentInterests)) {
    const itemString = JSON.stringify(itemMetadata).toLowerCase();
    for (const interest of userPref.currentInterests) {
      if (itemString.includes(interest.toLowerCase())) {
        signals.push({ type: "current_interest", source: "current_interest", value: interest, userScore: null, weight: 1.0, contribution: 50 });
        details.push(`Directly relates to your current interest in: ${interest}`);
      }
    }
  }

  // Combine longTerm, recent, and emerging boosts into a base relevance strength
  let relevanceStrength = longTermScore + (recentScore * 1.5) + (isEmerging ? 50 : 0);
  
  // Deterministically sum the score from the backward-compatible signals
  let deterministicScore = signals.reduce((sum, signal) => sum + signal.contribution, 0);

  // Negative signal suppression
  if (highestNegative > CLASSIFICATION_THRESHOLDS.negativeSuppression) {
    relevanceStrength /= 2.0;
    deterministicScore /= 2.0; // Suppress the final output score too
  }

  // --- BUBBLE CLASSIFICATION ---
  
  if (highestNegative > CLASSIFICATION_THRESHOLDS.negativeSuppression * 2) {
    classification.bucket = "discovery"; // Heavily suppressed items fall to the bottom of the pile
    classification.reason = "Content related to previous skips/dislikes (suppressed).";
    classification.isSuppressed = true;
  } else if (
    highestConfidence >= CLASSIFICATION_THRESHOLDS.coreConfidence && 
    relevanceStrength >= CLASSIFICATION_THRESHOLDS.coreRelevance
  ) {
    classification.bucket = "core";
    classification.reason = "Matches your strongest, most established long-term interests.";
  } else if (
    (isEmerging || isRecent) && 
    relevanceStrength >= CLASSIFICATION_THRESHOLDS.recentRelevance
  ) {
    classification.bucket = "recent";
    classification.reason = isEmerging 
      ? "Aligns with an interest you are rapidly developing."
      : "Relates to your recent gaming activity.";
  } else if (relevanceStrength >= CLASSIFICATION_THRESHOLDS.adjacentRelevance) {
    classification.bucket = "adjacent";
    classification.reason = "Tangentially related to games and genres you enjoy.";
  } else {
    classification.bucket = "discovery";
    classification.reason = "Exploring outside your usual preferences.";
  }

  classification.relevanceStrength = relevanceStrength;
  classification.confidence = highestConfidence;

  // --- END CLASSIFICATION ---

  const uniqueDetails = Array.from(new Set(details));

  let summary = "Weak match based on your preferences.";
  if (deterministicScore > 150) summary = "Very strong match based on your profile.";
  else if (deterministicScore > 80) summary = "Strong match for your gaming preferences.";
  else if (deterministicScore > 30) summary = "Good match based on some of your interests.";

  const finalScore = deterministicScore + (Math.random() * 0.1);

  return {
    score: finalScore,
    signals,
    reason: {
      summary,
      details: uniqueDetails
    },
    classification
  };
}

function formatRecommendation(item: any, matchResult: MatchResult) {
  const cleanItem = { ...item };
  delete cleanItem._matchScore; 

  return {
    item: cleanItem,
    recommendation: {
      matchScore: matchResult.score,
      signals: matchResult.signals,
      reason: matchResult.reason,
      classification: {
        bucket: matchResult.classification.bucket,
        reason: matchResult.classification.reason,
        isSuppressed: matchResult.classification.isSuppressed
      }
    },
    _matchScore: matchResult.score
  };
}

/**
 * Stage 7: Deterministic Bubble Composition, Diversity, and Novelty
 */
function composeBubble(
  candidates: any[], 
  limit: number, 
  consumedItemIds: Set<string>
): any[] {
  const config = PERSONALIZATION_CONFIG;
  
  // 1. Filter out suppressed items
  let validCandidates = candidates.filter(c => !c.recommendation.classification.isSuppressed);

  // 2. Apply Novelty Modifiers
  validCandidates = validCandidates.map(c => {
    let finalScore = c.recommendation.matchScore;
    const itemId = c.item._id.toString();
    if (consumedItemIds.has(itemId)) {
      finalScore *= config.novelty.heavilyConsumedPenalty;
    } else {
      finalScore *= config.novelty.unseenBoost;
    }
    
    // Create new object avoiding mutation issues
    return {
      ...c,
      recommendation: {
        ...c.recommendation,
        matchScore: finalScore
      }
    };
  });

  // Sort initially by matchScore descending
  validCandidates.sort((a, b) => b.recommendation.matchScore - a.recommendation.matchScore);

  // 3. Bucket candidates
  const buckets = {
    core: validCandidates.filter(c => c.recommendation.classification.bucket === 'core'),
    recent: validCandidates.filter(c => c.recommendation.classification.bucket === 'recent' || c.recommendation.classification.bucket === 'adjacent'),
    discovery: validCandidates.filter(c => c.recommendation.classification.bucket === 'discovery')
  };

  // 4. Calculate targets (soft allocation)
  let coreSlots = Math.floor(limit * config.composition.coreTarget);
  let recentSlots = Math.floor(limit * config.composition.recentAdjacentTarget);
  let discoverySlots = limit - coreSlots - recentSlots; // remainder to discovery

  // Redistribute slots if buckets are short
  if (discoverySlots > buckets.discovery.length) {
    const diff = discoverySlots - buckets.discovery.length;
    discoverySlots -= diff;
    recentSlots += diff;
  }
  if (recentSlots > buckets.recent.length) {
    const diff = recentSlots - buckets.recent.length;
    recentSlots -= diff;
    coreSlots += diff;
  }
  if (coreSlots > buckets.core.length) {
    const diff = coreSlots - buckets.core.length;
    coreSlots -= diff;
    const recentCanTake = buckets.recent.length - recentSlots;
    if (recentCanTake > 0) {
      const take = Math.min(diff, recentCanTake);
      recentSlots += take;
      discoverySlots += (diff - take);
    } else {
      discoverySlots += diff;
    }
  }

  // 5. Select items enforcing diversity
  const selected: any[] = [];
  let consecutiveGenres = new Map<string, number>();

  const pickFromBucket = (bucket: any[], slotsToFill: number) => {
    let filled = 0;
    while (filled < slotsToFill && bucket.length > 0) {
      // Re-sort bucket considering diversity penalties
      bucket.sort((a, b) => {
        const getPenalty = (c: any) => {
          let p = 1.0;
          const genres = c.item.genres || [];
          genres.forEach((g: string) => {
            const count = consecutiveGenres.get(g) || 0;
            if (count >= config.diversity.maxConsecutiveSameGenre) {
              p *= (1.0 - config.diversity.genreDiversityPenalty);
            }
          });
          return p;
        };
        return (b.recommendation.matchScore * getPenalty(b)) - (a.recommendation.matchScore * getPenalty(a));
      });

      const chosen = bucket.shift()!;
      selected.push(chosen);
      
      const genres = chosen.item.genres || [];
      const newConsecutive = new Map<string, number>();
      
      // Increment consecutive count for genres present in this item
      genres.forEach((g: string) => {
        newConsecutive.set(g, (consecutiveGenres.get(g) || 0) + 1);
      });
      
      // Update global consecutive map (unseen genres effectively reset to 0 because they aren't carried over)
      consecutiveGenres = newConsecutive;
      
      filled++;
    }
  };

  pickFromBucket(buckets.core, coreSlots);
  pickFromBucket(buckets.recent, recentSlots);
  pickFromBucket(buckets.discovery, discoverySlots);

  // Fallback: If we still need to fill the limit, pull from remaining in any bucket
  if (selected.length < limit) {
    const leftover = [...buckets.core, ...buckets.recent, ...buckets.discovery];
    leftover.sort((a, b) => b.recommendation.matchScore - a.recommendation.matchScore);
    pickFromBucket(leftover, limit - selected.length);
  }

  return selected;
}

export async function getGameRecommendations(userId: string, limit = 10) {
  await dbConnect();
  
  const userPref = await UserPreference.findOne({ userId });
  const candidates = await Game.find({}).limit(100).lean();
  
  let consumedItemIds = new Set<string>();
  if (userPref) {
    const recentInteractions = await UserInteraction.find({ userId, itemType: "game" })
      .sort({ createdAt: -1 })
      .limit(200)
      .select("itemId")
      .lean();
    recentInteractions.forEach((i: any) => consumedItemIds.add(i.itemId.toString()));
  }

  if (!userPref) {
    // If no preference profile yet, return base item wrapped in structure with 0 score
    return candidates.slice(0, limit).map(game => 
      formatRecommendation(game, { 
        score: 0, 
        signals: [], 
        reason: { summary: "No preference data available.", details: [] },
        classification: { bucket: "discovery", reason: "No preference data available.", relevanceStrength: 0, confidence: 0, isSuppressed: false }
      })
    );
  }
  
  const scoredGames = candidates.map(game => {
    const metadata = {
      genres: game.genres || [],
      tags: game.tags || [], 
      title: game.title
    };
    const matchResult = calculateMatchScore(metadata, userPref);
    return formatRecommendation(game, matchResult);
  });
  
  return composeBubble(scoredGames, limit, consumedItemIds);
}

export async function getNewsRecommendations(userId: string, limit = 10) {
  await dbConnect();
  const userPref = await UserPreference.findOne({ userId });
  
  const candidates = await News.find({}).limit(100).lean();
  
  let consumedItemIds = new Set<string>();
  if (userPref) {
    const recentInteractions = await UserInteraction.find({ userId, itemType: "article" })
      .sort({ createdAt: -1 })
      .limit(200)
      .select("itemId")
      .lean();
    recentInteractions.forEach((i: any) => consumedItemIds.add(i.itemId.toString()));
  }

  if (!userPref) {
    return candidates.slice(0, limit).map(news => 
      formatRecommendation(news, { 
        score: 0, 
        signals: [], 
        reason: { summary: "No preference data available.", details: [] },
        classification: { bucket: "discovery", reason: "No preference data available.", relevanceStrength: 0, confidence: 0, isSuppressed: false }
      })
    );
  }
  
  const scoredNews = candidates.map(news => {
    const metadata = {
      genres: news.genres || [],
      tags: news.tags || [],
      title: news.title
    };
    const matchResult = calculateMatchScore(metadata, userPref);
    return formatRecommendation(news, matchResult);
  });
  
  return composeBubble(scoredNews, limit, consumedItemIds);
}

export async function getTournamentRecommendations(userId: string, limit = 10) {
  await dbConnect();
  const userPref = await UserPreference.findOne({ userId });
  
  const candidates = await Tournament.find({}).populate("game").limit(100).lean();
  
  let consumedItemIds = new Set<string>();
  if (userPref) {
    const recentInteractions = await UserInteraction.find({ userId, itemType: "tournament" })
      .sort({ createdAt: -1 })
      .limit(200)
      .select("itemId")
      .lean();
    recentInteractions.forEach((i: any) => consumedItemIds.add(i.itemId.toString()));
  }

  if (!userPref) {
    return candidates.slice(0, limit).map((t: any) => 
      formatRecommendation(t, { 
        score: 0, 
        signals: [], 
        reason: { summary: "No preference data available.", details: [] },
        classification: { bucket: "discovery", reason: "No preference data available.", relevanceStrength: 0, confidence: 0, isSuppressed: false }
      })
    );
  }
  
  const scoredTournaments = candidates.map((t: any) => {
    const metadata = {
      genres: t.game?.genres || [],
      tags: t.game?.tags || [],
      title: t.title
    };
    const matchResult = calculateMatchScore(metadata, userPref);
    return formatRecommendation(t, matchResult);
  });
  
  return composeBubble(scoredTournaments, limit, consumedItemIds);
}
