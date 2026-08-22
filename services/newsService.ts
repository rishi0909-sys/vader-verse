import axios from "axios";

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const BASE_URL = "https://newsapi.org/v2";

export async function getGamingNews() {
  if (!NEWS_API_KEY) {
    console.warn("NEWS_API_KEY is not configured. Returning mock data.");
    return [];
  }

  try {
    const response = await axios.get(`${BASE_URL}/everything`, {
      params: {
        q: "gaming OR esports OR \"video games\"",
        apiKey: NEWS_API_KEY,
        sortBy: "publishedAt",
        pageSize: 10,
      },
    });
    return response.data.articles;
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}
