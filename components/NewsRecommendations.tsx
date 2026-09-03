"use client";

import { useEffect, useState } from "react";
import { getNewsRecommendations, RecommendedItem } from "@/services/client/recommendations";
import { Sparkles, Newspaper, HelpCircle } from "lucide-react";
import AIExplanationModal from "./AIExplanationModal";
import UnauthenticatedCTA from "./UnauthenticatedCTA";

export default function NewsRecommendations() {
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

    getNewsRecommendations()
      .then((data) => {
        setRecommendations(data.slice(0, 3)); // Only show top 3 for the UI
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load news recommendations", err);
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
      <section className="mb-12 rounded-2xl border border-zinc-700/50 bg-gradient-to-br from-zinc-800 to-zinc-900 p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Newspaper className="w-48 h-48" />
        </div>
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2 relative z-10">
          <Sparkles className="w-6 h-6 text-yellow-500" /> Your Morning Gaming Digest
        </h2>
        <p className="text-zinc-400 mb-6 relative z-10 max-w-2xl">
          AI-curated news tailored to your favorite genres and recent gameplay.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {loading ? (
            <>
              <div className="h-64 rounded-xl bg-zinc-800 animate-pulse" />
              <div className="h-64 rounded-xl bg-zinc-800 animate-pulse" />
              <div className="h-64 rounded-xl bg-zinc-800 animate-pulse" />
            </>
          ) : (
            recommendations.map((rec) => (
              <div key={rec.item._id} className="flex flex-col border border-yellow-900/50 bg-zinc-950 rounded-xl overflow-hidden hover:border-yellow-500/50 transition-colors relative group">
                <div className="absolute top-2 right-2 bg-yellow-600 text-black text-[10px] font-bold px-2 py-1 rounded-full z-10 shadow-lg flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> For You
                </div>

                {rec.item.urlToImage ? (
                  <div 
                    className="h-32 bg-zinc-800 bg-cover bg-center"
                    style={{ backgroundImage: `url(${rec.item.urlToImage})` }}
                  />
                ) : (
                  <div className="h-32 bg-zinc-800 flex items-center justify-center">
                    <Newspaper className="w-8 h-8 text-zinc-600" />
                  </div>
                )}
                
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-sm mb-2 line-clamp-2" title={rec.item.title}>{rec.item.title}</h3>
                  <p className="text-xs text-zinc-400 mb-4 line-clamp-2 flex-1">{rec.item.content || rec.item.description}</p>
                  
                  <div className="mt-auto pt-3 border-t border-zinc-800 flex justify-between items-center">
                    <button 
                      onClick={() => setExplainItemId(rec.item._id)}
                      className="flex items-center gap-1.5 text-xs font-medium text-yellow-500 hover:text-yellow-400 transition-colors"
                    >
                      <HelpCircle className="w-3.5 h-3.5" /> Why this?
                    </button>
                    {rec.item.url && (
                      <a href={rec.item.url} target="_blank" rel="noreferrer" className="text-xs text-zinc-400 hover:text-white">
                        Read Full
                      </a>
                    )}
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
        itemType="article"
        isOpen={!!explainItemId}
        onClose={() => setExplainItemId(null)}
      />
    </>
  );
}
