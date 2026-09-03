export const PERSONALIZATION_CONFIG = {
  // Base weights for different types of interactions
  actionWeights: {
    view: 1.0,
    click: 1.5,
    read: 2.0,
    like: 5.0,
    save: 7.0,
    share: 6.0,
    play: 3.0, // Base weight for play, duration adds more
    join: 8.0, // e.g., tournament_join
    search: 2.0
  },

  // Configuration for temporal decay
  decay: {
    // How many days until an interaction loses half its weight
    halfLifeDays: 14,
  },

  // Configuration for session duration contribution
  duration: {
    baseScaleSeconds: 600, // 10 minutes
    logMultiplier: 3.0,
    maxMultiplier: 10.0
  },

  // Configuration for temporal horizons
  horizons: {
    recentDays: 7, // Events within the last 7 days are considered "recent"
    emergingDays: 7, // Time window for calculating recent growth
  },

  // Configuration for emerging interest thresholds
  thresholds: {
    minRecentEvidenceCount: 3, // Must have at least 3 recent events to be emerging
    minRecentScore: 15.0, // Minimum recent aggregated score
    minGrowthRate: 1.5, // recentStrength / historicalBaseline must be at least 1.5x (50% more than historical average)
    minLongTermEvidenceCount: 5, // Minimum evidence for a stable long-term interest
  },

  // Negative signal weights
  negativeWeights: {
    dislike: 10.0, // Explicit dislike is a very strong negative signal
    skip: 1.0,     // A single skip/ignore is very weak
  },
  
  // Configuration for negative signal decay (faster than positive)
  negativeDecay: {
    halfLifeDays: 7, // Negative signals decay faster so user can recover
  },

  // Configuration for confidence mathematics
  confidence: {
    // confidence = 1 - Math.exp(-effectiveEvidence / k)
    kFactor: 10.0, 
    // Multipliers to weight different types of evidence
    explicitMultiplier: 2.0, // Explicit positive actions count double for confidence
    uniqueItemMultiplier: 2.0, // Engaging with different items is stronger than repeating the same item
  },

  // Stage 7: Bubble Composition target ratios (must sum to 1.0)
  composition: {
    coreTarget: 0.70,
    recentAdjacentTarget: 0.20,
    discoveryTarget: 0.10,
  },

  // Stage 7: Diversity and Novelty rules
  diversity: {
    maxConsecutiveSameGenre: 3, // Start penalizing if the same genre appears too many times in a row
    genreDiversityPenalty: 0.25, // 25% score reduction for repeated genres beyond threshold
    tagDiversityPenalty: 0.15,
  },
  
  novelty: {
    // Score multiplier for items the user has already heavily engaged with
    // < 1.0 means penalty, > 1.0 means boost
    heavilyConsumedPenalty: 0.60,
    // Score multiplier for completely unseen items in a strong category
    unseenBoost: 1.10,
  }
};

/**
 * Calculates the temporal decay factor for a given date.
 * @param date The date of the interaction
 * @param now The current date (or reference date)
 * @param customHalfLife Optional override for half-life
 * @returns A multiplier between 0 and 1
 */
export function calculateDecayFactor(date: Date, now: Date = new Date(), customHalfLife?: number): number {
  const ageMs = now.getTime() - date.getTime();
  const ageDays = Math.max(0, ageMs / (1000 * 60 * 60 * 24));
  
  const halfLife = customHalfLife || PERSONALIZATION_CONFIG.decay.halfLifeDays;
  return Math.pow(0.5, ageDays / halfLife);
}

/**
 * Calculates the engagement multiplier for a session duration.
 * Uses a logarithmic curve to provide diminishing returns for extremely long sessions.
 * @param durationSeconds The length of the session in seconds
 * @returns A multiplier to apply to the base action weight
 */
export function calculateDurationMultiplier(durationSeconds: number): number {
  if (!durationSeconds || durationSeconds <= 0) return 1.0;
  
  // log10(1 + (duration / 600)) * 3
  // Example:
  // 10 mins (600s) -> log10(2) * 3 = 0.3 * 3 = 0.9 + base 1 = 1.9 multiplier
  // 1 hour (3600s) -> log10(7) * 3 = 0.84 * 3 = 2.5 + base 1 = 3.5 multiplier
  // 5 hours (18000s) -> log10(31) * 3 = 1.49 * 3 = 4.47 + base 1 = 5.47 multiplier
  const rawMultiplier = 1.0 + (Math.log10(1 + (durationSeconds / PERSONALIZATION_CONFIG.duration.baseScaleSeconds)) * PERSONALIZATION_CONFIG.duration.logMultiplier);
  
  return Math.min(rawMultiplier, PERSONALIZATION_CONFIG.duration.maxMultiplier);
}
