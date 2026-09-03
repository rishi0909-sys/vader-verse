// Prototype Stage 7 Bubble Composition
const BUBBLE_CONFIG = {
  composition: { coreTarget: 0.70, recentAdjacentTarget: 0.20, discoveryTarget: 0.10 },
  diversity: { maxConsecutiveSameGenre: 2, genreDiversityPenalty: 0.25 },
  novelty: { heavilyConsumedPenalty: 0.60, unseenBoost: 1.10 }
};

interface Candidate {
  id: string;
  genres: string[];
  classification: { bucket: string; isSuppressed: boolean };
  matchScore: number;
}

function composeBubble(
  candidates: Candidate[], 
  limit: number, 
  consumedItemIds: Set<string>
): Candidate[] {
  // 1. Filter out suppressed
  let validCandidates = candidates.filter(c => !c.classification.isSuppressed);

  // 2. Apply Novelty Modifiers
  validCandidates = validCandidates.map(c => {
    let finalScore = c.matchScore;
    if (consumedItemIds.has(c.id)) {
      finalScore *= BUBBLE_CONFIG.novelty.heavilyConsumedPenalty;
    } else {
      finalScore *= BUBBLE_CONFIG.novelty.unseenBoost;
    }
    return { ...c, matchScore: finalScore };
  });

  // Sort initially by matchScore descending
  validCandidates.sort((a, b) => b.matchScore - a.matchScore);

  // 3. Bucket candidates
  const buckets = {
    core: validCandidates.filter(c => c.classification.bucket === 'core'),
    recent: validCandidates.filter(c => c.classification.bucket === 'recent' || c.classification.bucket === 'adjacent'),
    discovery: validCandidates.filter(c => c.classification.bucket === 'discovery')
  };

  // 4. Calculate targets
  let coreSlots = Math.round(limit * BUBBLE_CONFIG.composition.coreTarget);
  let recentSlots = Math.round(limit * BUBBLE_CONFIG.composition.recentAdjacentTarget);
  let discoverySlots = limit - coreSlots - recentSlots;

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
    // push unused core slots down to recent, then discovery
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
  const selected: Candidate[] = [];
  const genreCounts = new Map<string, number>();

  const pickFromBucket = (bucket: Candidate[], slotsToFill: number) => {
    let filled = 0;
    while (filled < slotsToFill && bucket.length > 0) {
      // Re-sort bucket considering diversity penalties
      bucket.sort((a, b) => {
        const getPenalty = (c: Candidate) => {
          let p = 1.0;
          c.genres.forEach(g => {
            const count = genreCounts.get(g) || 0;
            if (count >= BUBBLE_CONFIG.diversity.maxConsecutiveSameGenre) {
              p *= (1.0 - BUBBLE_CONFIG.diversity.genreDiversityPenalty);
            }
          });
          return p;
        };
        return (b.matchScore * getPenalty(b)) - (a.matchScore * getPenalty(a));
      });

      const chosen = bucket.shift()!;
      selected.push(chosen);
      chosen.genres.forEach(g => genreCounts.set(g, (genreCounts.get(g) || 0) + 1));
      filled++;
    }
  };

  pickFromBucket(buckets.core, coreSlots);
  pickFromBucket(buckets.recent, recentSlots);
  pickFromBucket(buckets.discovery, discoverySlots);

  // If we still need to fill the limit, pull from remaining in any bucket
  if (selected.length < limit) {
    const leftover = [...buckets.core, ...buckets.recent, ...buckets.discovery];
    pickFromBucket(leftover, limit - selected.length);
  }

  return selected;
}

const mockCandidates: Candidate[] = [
  { id: '1', genres: ['RPG'], classification: { bucket: 'core', isSuppressed: false }, matchScore: 100 },
  { id: '2', genres: ['RPG'], classification: { bucket: 'core', isSuppressed: false }, matchScore: 95 },
  { id: '3', genres: ['RPG'], classification: { bucket: 'core', isSuppressed: false }, matchScore: 90 },
  { id: '4', genres: ['RPG'], classification: { bucket: 'core', isSuppressed: false }, matchScore: 85 },
  { id: '5', genres: ['Racing'], classification: { bucket: 'recent', isSuppressed: false }, matchScore: 80 },
  { id: '6', genres: ['Racing'], classification: { bucket: 'recent', isSuppressed: false }, matchScore: 75 },
  { id: '7', genres: ['Action'], classification: { bucket: 'adjacent', isSuppressed: false }, matchScore: 60 },
  { id: '8', genres: ['Puzzle'], classification: { bucket: 'discovery', isSuppressed: false }, matchScore: 20 },
  { id: '9', genres: ['Puzzle'], classification: { bucket: 'discovery', isSuppressed: false }, matchScore: 15 },
  { id: '10', genres: ['Horror'], classification: { bucket: 'discovery', isSuppressed: true }, matchScore: 10 },
];

console.log("Composed Bubble (Limit 5):");
const result = composeBubble(mockCandidates, 5, new Set(['1'])); // '1' is heavily consumed
result.forEach(c => console.log(`${c.id} - ${c.genres.join(',')} (${c.classification.bucket}) Score: ${c.matchScore.toFixed(2)}`));
