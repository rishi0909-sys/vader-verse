// Test script to prototype Bubble Classification logic
const BUBBLE_THRESHOLDS = {
  coreConfidence: 0.70,
  coreRelevance: 50,
  recentRelevance: 30, // For things in recent/emerging
  adjacentRelevance: 15,
  negativeSuppression: 20.0, // If negative score is above this, downgrade
};

function classifyItem(
  itemGenres: string[],
  itemTags: string[],
  userModel: any
) {
  let highestConfidence = 0;
  let highestNegative = 0;
  let isEmerging = false;
  let isRecent = false;
  let longTermScore = 0;
  let recentScore = 0;

  // Extract signals
  const allLabels = [...itemGenres, ...itemTags];
  
  for (const label of allLabels) {
    // Confidence
    const conf = userModel.confidence[label] || 0;
    if (conf > highestConfidence) highestConfidence = conf;
    
    // Negative
    const neg = userModel.negativeSignals[label] || 0;
    if (neg > highestNegative) highestNegative = neg;
    
    // Emerging check
    if (userModel.emerging.some((e: any) => e.name === label)) {
      isEmerging = true;
    }
    
    // Recent check
    const rScore = userModel.recent[label] || 0;
    if (rScore > 10) isRecent = true;
    recentScore += rScore;

    // Long term score
    const ltScore = userModel.longTerm[label] || 0;
    longTermScore += ltScore;
  }

  // Simplified relevance for classification: combine longTerm + recent + emerging boosts
  let relevanceStrength = longTermScore + (recentScore * 1.5) + (isEmerging ? 50 : 0);
  
  // Apply negative penalty
  if (highestNegative > BUBBLE_THRESHOLDS.negativeSuppression) {
    relevanceStrength /= 2; // Penalize
  }

  let bucket = "discovery";
  let reason = "Exploring outside your usual preferences.";

  if (highestNegative > BUBBLE_THRESHOLDS.negativeSuppression * 2) {
    bucket = "discovery"; // Suppressed items pushed to discovery or dropped entirely later
    reason = "Content related to previous skips/dislikes (suppressed).";
  } else if (
    highestConfidence >= BUBBLE_THRESHOLDS.coreConfidence && 
    relevanceStrength >= BUBBLE_THRESHOLDS.coreRelevance
  ) {
    bucket = "core";
    reason = "Matches your strongest, most established long-term interests.";
  } else if (
    (isEmerging || isRecent) && 
    relevanceStrength >= BUBBLE_THRESHOLDS.recentRelevance
  ) {
    bucket = "recent";
    reason = isEmerging 
      ? "Aligns with an interest you are rapidly developing."
      : "Relates to your recent gaming activity.";
  } else if (relevanceStrength >= BUBBLE_THRESHOLDS.adjacentRelevance) {
    bucket = "adjacent";
    reason = "Tangentially related to games and genres you enjoy.";
  }

  return { bucket, reason, relevanceStrength, confidence: highestConfidence, highestNegative };
}

// Mock User Model
const mockModel = {
  longTerm: { "RPG": 200, "Action": 150, "Racing": 10 },
  recent: { "Racing": 80, "RPG": 10 },
  emerging: [{ name: "Racing", type: "genre", growthRate: 3.0 }],
  confidence: { "RPG": 0.95, "Action": 0.85, "Racing": 0.40, "Horror": 0.90 },
  negativeSignals: { "Horror": 45.0, "Sports": 5.0 }
};

console.log("A. Strong RPG (CORE):", classifyItem(["RPG"], [], mockModel));
console.log("B. Racing (RECENT/EMERGING):", classifyItem(["Racing"], [], mockModel));
console.log("C. Action/Adventure (ADJACENT):", classifyItem(["Adventure"], ["Action"], mockModel));
console.log("D. Puzzle (DISCOVERY):", classifyItem(["Puzzle"], [], mockModel));
console.log("E. Horror (Negative Suppressed):", classifyItem(["Horror"], [], mockModel));
