import axios from "axios";

const GNEWS_API_KEY = process.env.GNEWS_API_KEY;
const BASE_URL = "https://gnews.io/api/v4";

const MOCK_NEWS = [
  {
    title: "The Future of Competitive Gaming: What to Expect in 2026",
    description: "Esports is evolving rapidly. Dive into the biggest tournaments, emerging games, and the new competitive meta taking the world by storm. From hyper-realistic VR arenas to massive global prize pools, this is the golden age of competitive play.",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop",
    url: "#",
    source: { name: "VaderVerse Editorial" },
    publishedAt: new Date().toISOString()
  },
  {
    title: "Next-Gen Hardware: Pushing the Boundaries of Reality",
    description: "With the latest releases pushing the boundaries of graphics and performance, we break down the newest setups. Are 8K displays and zero-latency wireless peripherals the new standard?",
    image: "https://images.unsplash.com/photo-1605901309584-818e25960b8f?q=80&w=2000&auto=format&fit=crop",
    url: "#",
    source: { name: "VaderVerse Hardware" },
    publishedAt: new Date().toISOString()
  },
  {
    title: "Top 10 Hidden Gem Indie Games You Must Play",
    description: "From cozy simulators to intense rogue-likes, the indie gaming scene is booming with unprecedented creativity. Here are our top picks that you might have missed this month.",
    image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=2000&auto=format&fit=crop",
    url: "#",
    source: { name: "VaderVerse Indie" },
    publishedAt: new Date().toISOString()
  }
];

export async function getGamingNews(page: number = 1) {
  if (!GNEWS_API_KEY) {
    console.warn("GNEWS_API_KEY is not configured. Returning mock data.");
    return MOCK_NEWS;
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
    
    if (!response.data.articles || response.data.articles.length === 0) {
      return MOCK_NEWS;
    }
    return response.data.articles;
  } catch (error) {
    console.error("Error fetching news:", error);
    return MOCK_NEWS;
  }
}
