import { processUserPersonalization } from "@/services/aiPersonalizationService";

// Map to store pending debounce timeouts per user
const pendingTimeouts = new Map<string, NodeJS.Timeout>();

// Set to track users currently undergoing personalization to prevent concurrent runs
const activeJobs = new Set<string>();

const DEBOUNCE_MS = 30 * 1000; // 30 seconds

/**
 * Triggers AI personalization for a user in the background.
 * Uses a debounce mechanism so rapid interactions don't spam the LLM.
 * Never blocks the caller.
 */
export function triggerPersonalization(userId: string) {
  console.log(`[AI PERSONALIZATION] triggerPersonalization() entered for user: ${userId}`);

  // If there's already a pending trigger for this user, clear it (debounce)
  if (pendingTimeouts.has(userId)) {
    clearTimeout(pendingTimeouts.get(userId));
    pendingTimeouts.delete(userId);
  }

  // Set a new timeout
  const timeoutId = setTimeout(() => {
    console.log(`[AI PERSONALIZATION] Timer fired for user: ${userId}`);
    pendingTimeouts.delete(userId);
    console.log(`[AI PERSONALIZATION] Executing personalization for user: ${userId}`);
    executePersonalization(userId);
  }, DEBOUNCE_MS);

  pendingTimeouts.set(userId, timeoutId);
  console.log(`[AI PERSONALIZATION] Timer scheduled for user: ${userId}`);
}

/**
 * Executes the personalization job safely in the background.
 * Handles concurrency locks and error catching.
 */
async function executePersonalization(userId: string) {
  if (activeJobs.has(userId)) {
    console.log(`[AI PERSONALIZATION] Skipped trigger for user ${userId}: Job already active`);
    return;
  }

  activeJobs.add(userId);
  console.log(`[AI PERSONALIZATION] Processing started for user ${userId}`);

  try {
    const result = await processUserPersonalization(userId);
    
    if (result.success) {
      console.log(`[AI PERSONALIZATION] Processing completed for user ${userId}`);
      console.log(`[AI PERSONALIZATION] New activity count: ${result.processed || 0}`);
      console.log(`[AI PERSONALIZATION] Gemini called: ${result.processed ? result.processed > 0 : false}`);
      console.log(`[AI PERSONALIZATION] Preferences updated: ${result.processed ? result.processed > 0 : false}`);
    } else {
      console.log(`[AI PERSONALIZATION] Processing failed for user ${userId}: ${result.error}`);
    }
  } catch (error) {
    console.error(`[AI PERSONALIZATION] Critical error during background personalization for user ${userId}:`, error);
  } finally {
    activeJobs.delete(userId);
  }
}
