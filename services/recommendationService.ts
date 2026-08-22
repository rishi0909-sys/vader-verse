export async function getRecommendationsForUser(userId: string) {
  // Placeholder for Phase 2/3:
  // 1. Fetch user's GameSessions from MongoDB to calculate playCount/sessionDuration
  // 2. Fetch user's favorite genres
  // 3. Apply collaborative filtering or vector embeddings to recommend new games
  
  return {
    success: true,
    data: [
      {
        id: "mock-1",
        title: "Cyberpunk 2077",
        reason: "Because you played open-world RPGs",
      },
      {
        id: "mock-2",
        title: "Hades II",
        reason: "Popular in your favorite genre (Roguelike)",
      },
    ],
  };
}
