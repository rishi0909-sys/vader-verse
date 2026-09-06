export interface GameMonetizeGame {
  id: string;
  title: string;
  description: string;
  instructions: string;
  url: string;
  category: string;
  tags: string;
  thumb: string;
  width: string;
  height: string;
}

export async function getGameMonetizeGames(limit: number = 60, genre?: string): Promise<GameMonetizeGame[]> {
  try {
    const fetchLimit = genre ? 200 : limit;
    const res = await fetch(`https://gamemonetize.com/feed.php?format=0&num=${fetchLimit}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch GameMonetize feed: ${res.status}`);
    }
    
    let data: GameMonetizeGame[] = await res.json();
    
    if (genre) {
      const searchGenre = genre.toLowerCase();
      data = data.filter((g) => 
        (g.category && g.category.toLowerCase().includes(searchGenre)) || 
        (g.tags && g.tags.toLowerCase().includes(searchGenre))
      );
    }
    
    return data.slice(0, limit);
  } catch (error) {
    console.error("GameMonetize Service Error:", error);
    return [];
  }
}
