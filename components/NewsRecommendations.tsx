"use client";
import React from 'react';

import { useEffect, useState } from "react";
import { getNewsRecommendations, RecommendedItem } from "@/services/client/recommendations";
import { Sparkles, Newspaper, HelpCircle } from "lucide-react";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
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
      <section className="mb-12 rounded-3xl border border-white/10 bg-black/20 backdrop-blur-md p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 p-8 opacity-[0.03] pointer-events-none">
          <Newspaper className="w-64 h-64" />
        </div>
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-3 relative z-10 text-white/90 drop-shadow-md">
          <Sparkles className="w-6 h-6 text-yellow-500" /> Your Morning Gaming Digest
        </h2>
        <p className="text-white/50 mb-8 font-medium relative z-10 max-w-2xl">
          AI-curated news tailored to your favorite genres and recent gameplay.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {loading ? (
            <>
              <div className="h-64 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/5 animate-pulse" />
              <div className="h-64 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/5 animate-pulse" />
              <div className="h-64 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/5 animate-pulse" />
            </>
          ) : (
            recommendations.map((rec) => (
              <NewsCard key={rec.item._id} rec={rec} setExplainItemId={setExplainItemId} />
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

function NewsCard({ rec, setExplainItemId }: { rec: RecommendedItem, setExplainItemId: (id: string) => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  const slug = rec.item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const imageUrl = rec.item.urlToImage || `https://picsum.photos/seed/${slug}-news/400/200`;
  const matchScore = rec.recommendation?.matchScore || 80;
  const badgeOpacity = Math.max(0.6, Math.min(1, matchScore / 100));

  useGSAP(() => {
    const card = cardRef.current;
    if (!card) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const hoverTl = gsap.timeline({ paused: true });
    
    hoverTl.to(card, {
      y: -6,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 0 40px rgba(234, 179, 8, 0.15)",
      duration: 0.4,
      ease: "power2.out"
    }, 0);

    hoverTl.to(imageRef.current, {
      scale: 1.04,
      duration: 0.4,
      ease: "power2.out"
    }, 0);

    hoverTl.to(badgeRef.current, {
      y: -4,
      rotation: -4,
      boxShadow: "0 12px 20px rgba(0, 0, 0, 0.4)",
      duration: 0.4,
      ease: "power2.out"
    }, 0);

    card.addEventListener("mouseenter", () => hoverTl.play());
    card.addEventListener("mouseleave", () => hoverTl.reverse());

    return () => {
      card.removeEventListener("mouseenter", () => hoverTl.play());
      card.removeEventListener("mouseleave", () => hoverTl.reverse());
    };
  }, { scope: cardRef });

  return (
    <div 
      ref={cardRef}
      className="flex flex-col border border-white/5 bg-black/40 backdrop-blur-md rounded-2xl overflow-hidden relative group cursor-pointer shadow-[0_4px_6px_-1px_rgba(0,0,0,0.5),0_0_15px_rgba(234,179,8,0.02)]"
      style={{
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.5), 0 0 15px rgba(234,179,8,0.02)"
      }}
    >
      <div 
        ref={badgeRef}
        className="absolute top-3 right-3 bg-yellow-500 backdrop-blur-md text-black text-[10px] font-bold px-2.5 py-1 rounded-full z-10 flex items-center gap-1.5 border border-yellow-400 pointer-events-none transform rotate-[-2deg]"
        style={{ opacity: badgeOpacity, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)" }}
      >
        <Sparkles className="w-3 h-3" /> For You
      </div>

      <div className="overflow-hidden h-32 relative shrink-0">
        <div 
          ref={imageRef}
          className="absolute inset-0 bg-cover bg-center pointer-events-none"
          style={{ 
            backgroundImage: `url(${imageUrl})`,
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%)'
          }}
        />
        {/* Subtle scanline texture overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.8) 2px, rgba(0,0,0,0.8) 4px)'
          }}
        />
      </div>
      
      <div className="p-5 flex flex-col flex-1 -mt-6 relative z-10 pointer-events-none">
        <h3 className="font-bold text-sm mb-3 line-clamp-2 text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-colors" title={rec.item.title}>{rec.item.title}</h3>
        <p className="text-xs text-white/50 mb-4 line-clamp-3 flex-1 font-medium">{rec.item.content || rec.item.description}</p>
        
        <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center relative z-20 pointer-events-auto">
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setExplainItemId(rec.item._id);
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-yellow-500 hover:text-yellow-400 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" /> Why this?
          </button>
          {rec.item.url && (
            <a href={rec.item.url} target="_blank" rel="noreferrer" className="text-xs font-semibold text-white/40 hover:text-white transition-colors">
              Read Full <span className="text-[10px]">→</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );

}
