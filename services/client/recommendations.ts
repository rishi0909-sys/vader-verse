import { ApiClient } from "@/lib/apiClient";

export interface RecommendationSignal {
  type: string;
  source: string;
  value: string;
  userScore: number | null;
  weight: number;
  contribution: number;
}

export interface RecommendationReason {
  summary: string;
  details: string[];
}

export interface RecommendationData {
  matchScore: number;
  signals: RecommendationSignal[];
  reason: RecommendationReason;
}

export interface RecommendedItem<T = any> {
  item: T;
  recommendation: RecommendationData;
  _matchScore: number;
}

export interface ExplanationResponse {
  itemId: string;
  itemType: string;
  matchScore: number;
  signals: RecommendationSignal[];
  explanation: string;
}

export async function getGameRecommendations(): Promise<RecommendedItem[]> {
  const res = await ApiClient.get("/api/recommendations/games");
  return res.data || [];
}

export async function getNewsRecommendations(): Promise<RecommendedItem[]> {
  const res = await ApiClient.get("/api/recommendations/news");
  return res.data || [];
}

export async function getTournamentRecommendations(): Promise<RecommendedItem[]> {
  const res = await ApiClient.get("/api/recommendations/tournaments");
  return res.data || [];
}

export async function getRecommendationExplanation(itemId: string, itemType: string): Promise<ExplanationResponse> {
  const res = await ApiClient.post("/api/recommendations/explain", { itemId, itemType });
  return res.data;
}
