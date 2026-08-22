const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function askTournamentAssistant(userId: string, question: string) {
  if (!OPENAI_API_KEY) {
    return {
      success: false,
      message: "AI service is currently unavailable.",
      data: null,
    };
  }

  // Placeholder for Phase 2/3:
  // 1. Retrieve user's active tournaments from MongoDB
  // 2. Format context for LLM
  // 3. Call OpenAI API
  
  return {
    success: true,
    data: "This is a placeholder response from the Tournament Assistant. Real AI integration will come in a later phase.",
  };
}

export async function generateMorningDigest(userId: string) {
  // Placeholder for Phase 2/3:
  // 1. Fetch user's followed tags and favorite games
  // 2. Fetch recent news matching those tags
  // 3. Use LLM to summarize
  
  return {
    success: true,
    data: {
      title: "Your Morning Gaming Digest",
      summary: "This is a mock summary. Real LLM-generated summaries tailored to your preferences will be available soon.",
    },
  };
}
