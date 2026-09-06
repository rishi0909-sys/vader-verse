import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import dbConnect from "@/lib/mongodb";
import UserPreference from "@/models/UserPreference";
import Game from "@/models/Game";
import News from "@/models/News";
import Tournament from "@/models/Tournament";
import { getGameRecommendations, getNewsRecommendations, getTournamentRecommendations } from "./recommendationEngine";

export async function generateRecommendationExplanation(userId: string, itemId: string, itemType: string) {
  await dbConnect();
  const userPref = await UserPreference.findOne({ userId }).lean();
  if (!userPref) {
    return { 
      success: true, 
      data: {
        itemId,
        itemType,
        matchScore: 0,
        signals: [],
        explanation: "You're seeing this because it's highly rated globally! We don't have enough data about your preferences yet to provide a personalized explanation. Keep exploring the platform to build your profile."
      } 
    };
  }
  let item = null;
  let recommendations: any[] = [];
  
  if (itemType === "game") {
    item = await Game.findById(itemId).lean();
    if (item) recommendations = await getGameRecommendations(userId, 100);
  } else if (itemType === "article") {
    item = await News.findById(itemId).lean();
    if (item) recommendations = await getNewsRecommendations(userId, 100);
  } else if (itemType === "tournament") {
    item = await Tournament.findById(itemId).lean();
    if (item) recommendations = await getTournamentRecommendations(userId, 100);
  } else {
    return { success: false, error: `Invalid itemType: ${itemType}` };
  }

  if (!item) {
    return { success: false, error: `Item not found with id: ${itemId}` };
  }

  // Find the exact scored recommendation object for this item
  const rec = recommendations.find((r: any) => r.item._id.toString() === itemId);
  if (!rec) {
    return { success: false, error: "Item is not currently recommended for this user." };
  }

  const promptContext = `
You are Vader-Verse's gaming recommendation explanation assistant.

Explain why the provided item was recommended to the user.

IMPORTANT RULES:

1. Use ONLY the information provided in the input.
2. Never invent user preferences or behavior.
3. Never claim the user played, liked, saved, followed, or interacted with something unless explicitly provided.
4. Do not introduce recommendation factors that are not present in the supplied signals.
5. Do not recalculate or modify the recommendation score.
6. Do not mention internal weights or contribution values unless explicitly requested.
7. Focus on the strongest 1-3 recommendation signals.
8. Keep the explanation concise, natural, and friendly.
9. If there are no meaningful signals, clearly say that the match is limited rather than inventing a reason.
10. The recommendation engine is the source of truth.

Return only the natural-language explanation.

Input:
- Recommended item: ${item.title || item.name}
- Match score: ${rec.recommendation.matchScore.toFixed(2)}
- Verified recommendation signals:
${JSON.stringify(rec.recommendation.signals, null, 2)}
  `.trim();

  // Define the base response structure we will always return
  const responseData = {
    itemId,
    itemType,
    matchScore: rec.recommendation.matchScore,
    signals: rec.recommendation.signals,
    explanation: ""
  };

  try {
    const { text } = await generateText({
      model: google("gemini-3.6-flash"),
      prompt: promptContext,
    });

    responseData.explanation = text.trim() || "This recommendation matches several of your gaming preferences.";
    
    return { success: true, data: responseData };
  } catch (error: any) {
    console.error("[AI EXPLANATION ERROR]", error);
    // Safe fallback so we don't break the frontend
    responseData.explanation = "This recommendation matches several of your gaming preferences.";
    return { success: true, data: responseData };
  }
}
