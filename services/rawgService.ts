import axios from "axios";

const RAWG_API_KEY = process.env.RAWG_API_KEY;
const BASE_URL = "https://api.rawg.io/api";

export async function getFeaturedGames() {
  if (!RAWG_API_KEY) {
    console.warn("RAWG_API_KEY is not configured. Returning mock data.");
    return [];
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
