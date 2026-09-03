"use client";

import { useState } from "react";
import { getRecommendationExplanation } from "@/services/client/recommendations";
import { Sparkles, X, Loader2 } from "lucide-react";

interface Props {
  itemId: string;
  itemType: "game" | "article" | "tournament";
  isOpen: boolean;
  onClose: () => void;
}

export default function AIExplanationModal({ itemId, itemType, isOpen, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [error, setError] = useState<boolean>(false);

  // Fetch explanation when modal opens
  const fetchExplanation = async () => {
    if (explanation || loading) return;
    
    setLoading(true);
    setError(false);
    
    try {
      const result = await getRecommendationExplanation(itemId, itemType);
      setExplanation(result.explanation);
    } catch (err) {
      console.error("Failed to load explanation", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch when modal opens
  if (isOpen && !explanation && !loading && !error) {
    fetchExplanation();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800 bg-zinc-900/50">
          <h3 className="flex items-center gap-2 font-bold text-lg">
            <Sparkles className="w-5 h-5 text-red-500" />
            Why you're seeing this
          </h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8 text-zinc-400">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-red-500" />
              <p>Generating your personalized explanation...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <p className="text-zinc-300 mb-4">We couldn't generate the explanation right now.</p>
              <button 
                onClick={fetchExplanation}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-medium transition-colors"
              >
                Try again
              </button>
            </div>
          ) : (
            <div className="text-zinc-300 leading-relaxed">
              {explanation}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
