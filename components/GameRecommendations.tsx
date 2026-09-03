"use client";

import { useEffect, useState } from "react";
import { getGameRecommendations, RecommendedItem } from "@/services/client/recommendations";
import { Sparkles, HelpCircle } from "lucide-react";
import AIExplanationModal from "./AIExplanationModal";
import UnauthenticatedCTA from "./UnauthenticatedCTA";

export default function GameRecommendations() {
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

    getGameRecommendations()
      .then((data) => {
        setRecommendations(data.slice(0, 4)); // Only show top 4 for the UI
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load game recommendations", err);
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
      <section className="mb-16 rounded-2xl border border-red-900/30 bg-red-900/10 p-8">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-red-500" /> Recommended for You
        </h2>
        <p className="text-zinc-400 mb-6">Personalized picks based on your gaming preferences.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            // Skeleton loaders
            <>
              <div className="h-64 rounded-xl bg-zinc-800 animate-pulse" />
              <div className="h-64 rounded-xl bg-zinc-800 animate-pulse" />
              <div className="h-64 rounded-xl bg-zinc-800 animate-pulse" />
              <div className="h-64 rounded-xl bg-zinc-800 animate-pulse" />
            </>
          ) : (
            recommendations.map((rec) => (
              <div key={rec.item._id} className="rounded-xl border border-red-900/50 bg-zinc-900 overflow-hidden relative group transition-all hover:border-red-500/50">
                {/* Optional recommendation badge */}
                <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full z-10 shadow-lg flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Strong Match
                </div>
                
                <div 
                  className="h-32 bg-zinc-800 bg-cover bg-center"
                  style={{ backgroundImage: `url(${rec.item.background_image || '/placeholder-game.jpg'})` }}
                />
                
                <div className="p-4 flex flex-col h-full">
                  <h3 className="font-bold truncate" title={rec.item.title}>{rec.item.title}</h3>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-1">{rec.item.genres?.join(", ")}</p>
                  
                  <div className="mt-4 pt-4 border-t border-zinc-800/50">
                    <button 
                      onClick={() => setExplainItemId(rec.item._id)}
                      className="flex items-center gap-1.5 text-xs font-medium text-red-400 hover:text-red-300 transition-colors w-full"
                    >
                      <HelpCircle className="w-3.5 h-3.5" /> Why am I seeing this?
                    </button>
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
        itemType="game"
        isOpen={!!explainItemId}
        onClose={() => setExplainItemId(null)}
      />
    </>
  );
}
