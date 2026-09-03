// Test script for confidence math
const kFactor = 10.0;
const explicitMultiplier = 2.0;
const uniqueItemMultiplier = 2.0;

function calcConfidence(evCount: number, expCount: number, uniqueItems: number) {
  // Modified formula to not over-inflate single items
  const effectiveEvidence = evCount + (expCount * explicitMultiplier) + (Math.max(0, uniqueItems - 1) * uniqueItemMultiplier);
  const confidence = 1.0 - Math.exp(-effectiveEvidence / kFactor);
  return { effectiveEvidence, confidence: confidence.toFixed(3) };
}

console.log("A. 1 view on 1 item:", calcConfidence(1, 0, 1));
console.log("B. 2 views on 1 item:", calcConfidence(2, 0, 1));
console.log("C. 10 views on 1 item:", calcConfidence(10, 0, 1));
console.log("D. 10 views across 10 different items:", calcConfidence(10, 0, 10));
console.log("E. 1 save on 1 item:", calcConfidence(1, 1, 1));
console.log("F. repeated sessions on one game (e.g. 5 sessions):", calcConfidence(5, 0, 1));
console.log("G. interactions across multiple games (e.g. 15 views, 5 explicit, 6 unique items):", calcConfidence(15, 5, 6));
