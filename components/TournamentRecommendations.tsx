"use client";

import { useEffect, useState } from "react";
import { getTournamentRecommendations, RecommendedItem } from "@/services/client/recommendations";
import { Sparkles, HelpCircle, Calendar, Users, Trophy } from "lucide-react";
import AIExplanationModal from "./AIExplanationModal";
import UnauthenticatedCTA from "./UnauthenticatedCTA";

export default function TournamentRecommendations() {
  const [recommendations, setRecommendations] = useState<RecommendedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const [explainItemId, setExplainItemId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("vader_token");
    if (!token) {
      setError(true);
      setLoading(false);
      return;
    }

    getTournamentRecommendations()
      .then((data) => {
        setRecommendations(data.slice(0, 2)); // Only show top 2 for the UI
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load tournament recommendations", err);
        setError(true);
        setLoading(false);
      });
  }, []);

  if (error) {
    return <UnauthenticatedCTA />;
  }

  if (!loading && recommendations.length === 0) {
    return null; // Silent fail if just no data
  }

  return (
    <>
      <section className="mb-12 rounded-2xl border border-blue-900/30 bg-blue-900/10 p-6 flex flex-col gap-6 relative">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-900/50 flex items-center justify-center shrink-0 border border-blue-500/20">
            <Trophy className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-blue-400 mb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Recommended Tournaments
            </h3>
            <p className="text-sm text-zinc-400">Based on your competitive history and favorite games.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loading ? (
            <>
              <div className="h-32 bg-zinc-800 animate-pulse rounded-xl" />
              <div className="h-32 bg-zinc-800 animate-pulse rounded-xl" />
            </>
          ) : (
            recommendations.map((rec) => (
              <div key={rec.item._id} className="border border-blue-900/50 hover:border-blue-500/50 transition-colors bg-zinc-950 rounded-xl p-6 flex flex-col sm:flex-row gap-6 relative group">
                <div className="absolute top-2 right-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full z-10 shadow-lg flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Selected For You
                </div>

                <div 
                  className="w-full sm:w-1/3 h-32 bg-zinc-800 rounded-lg shrink-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${rec.item.game?.background_image || '/placeholder-tournament.jpg'})` }}
                />
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg pr-20">{rec.item.title}</h3>
                  </div>
                  <p className="text-sm text-zinc-400 mb-4 line-clamp-2">
                    Game: {rec.item.game?.title || "Unknown"} <br />
                    Status: {rec.item.status}
                  </p>
                  
                  <div className="mt-auto pt-3 border-t border-zinc-800 flex justify-between items-center">
                    <button 
                      onClick={() => setExplainItemId(rec.item._id)}
                      className="flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <HelpCircle className="w-3.5 h-3.5" /> Why am I seeing this?
                    </button>
                    <span className="text-xs font-bold px-2 py-1 bg-green-900/30 text-green-400 rounded-full">Open</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Explanation Modal */}
      <AIExplanationModal 
        itemId={explainItemId || ""}
        itemType="tournament"
        isOpen={!!explainItemId}
        onClose={() => setExplainItemId(null)}
      />
    </>
  );
}
