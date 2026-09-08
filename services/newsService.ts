import axios from "axios";

const GNEWS_API_KEY = process.env.GNEWS_API_KEY;
const BASE_URL = "https://gnews.io/api/v4";

export async function getGamingNews(page: number = 1) {
  if (!GNEWS_API_KEY) {
    console.warn("GNEWS_API_KEY is not configured. Returning mock data.");
    return [];
  }

  try {
    const response = await axios.get(`${BASE_URL}/search`, {
      params: {
        q: "gaming OR esports OR \"video games\"",
        lang: "en",
        max: 10,
        page: page,
        apikey: GNEWS_API_KEY,
      },
    });
    return response.data.articles;
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}
