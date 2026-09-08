import axios from "axios";

const RAWG_API_KEY = process.env.RAWG_API_KEY;
const BASE_URL = "https://api.rawg.io/api";

export async function getFeaturedGames() {
  if (!RAWG_API_KEY) {
    console.warn("RAWG_API_KEY is not configured. Returning mock data.");
    return [
      { id: 1, name: "Neon Drift", slug: "neon-drift", background_image: "", rating: 4.8, genres: [{ name: "Racing" }] },
      { id: 2, name: "Cyber Samurai", slug: "cyber-samurai", background_image: "", rating: 4.5, genres: [{ name: "Action" }] },
      { id: 3, name: "Galactic Brawl", slug: "galactic-brawl", background_image: "", rating: 4.2, genres: [{ name: "Fighter" }] },
      { id: 4, name: "Void Runners", slug: "void-runners", background_image: "", rating: 4.9, genres: [{ name: "Platformer" }] },
    ];
  }

  try {
    const response = await axios.get(`${BASE_URL}/games`, {
      params: {
        key: RAWG_API_KEY,
        ordering: "-added",
        page_size: 10,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error("Error fetching games from RAWG:", error);
    return [];
  }
}

export async function searchGame(slugOrName: string) {
  if (!RAWG_API_KEY) {
    console.warn("RAWG_API_KEY is not configured.");
    return null;
  }

  try {
    const response = await axios.get(`${BASE_URL}/games`, {
      params: {
        key: RAWG_API_KEY,
        search: slugOrName,
        page_size: 1, // We only need the top match for a community
      },
    });
    
    if (response.data.results && response.data.results.length > 0) {
      return response.data.results[0];
    }
    return null;
  } catch (error) {
    console.error(`Error searching game ${slugOrName} on RAWG:`, error);
    return null;
  }
}

export async function searchMultiplayerGames(query: string) {
  if (!RAWG_API_KEY) {
    console.warn("RAWG_API_KEY is not configured.");
    return [];
  }

  try {
    const response = await axios.get(`${BASE_URL}/games`, {
      params: {
        key: RAWG_API_KEY,
        search: query,
        tags: "multiplayer",
        page_size: 10, 
      },
    });
    
    return response.data.results || [];
  } catch (error) {
    console.error(`Error searching multiplayer games on RAWG:`, error);
    return [];
  }
}
