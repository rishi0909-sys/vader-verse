"use client";
import React from 'react';

import { useEffect, useState, useRef } from "react";
import { getGameRecommendations, RecommendedItem } from "@/services/client/recommendations";
import { Sparkles, HelpCircle } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
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
      <section className="mb-16 rounded-3xl border border-white/10 bg-black/20 backdrop-blur-md shadow-2xl p-8">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2 text-white/90">
          <Sparkles className="w-6 h-6 text-red-500" /> Communities Based Upon Your Interests
        </h2>
        <p className="text-white/50 mb-8 font-medium">Personalized picks based on your gaming preferences.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            // Skeleton loaders
            <>
              <div className="h-64 rounded-xl bg-white/5 backdrop-blur-sm border border-white/5 animate-pulse" />
              <div className="h-64 rounded-xl bg-white/5 backdrop-blur-sm border border-white/5 animate-pulse" />
              <div className="h-64 rounded-xl bg-white/5 backdrop-blur-sm border border-white/5 animate-pulse" />
              <div className="h-64 rounded-xl bg-white/5 backdrop-blur-sm border border-white/5 animate-pulse" />
            </>
          ) : (
            recommendations.map((rec) => {
              return <GameCard key={rec.item._id} rec={rec} setExplainItemId={setExplainItemId} />;
            })
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

function GameCard({ rec, setExplainItemId }: { rec: RecommendedItem, setExplainItemId: (id: string) => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const slug = rec.item.slug || rec.item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const imageUrl = rec.item.background_image || rec.item.coverImage || `https://picsum.photos/seed/${slug}/400/200`;
  
  // Calculate badge intensity based on match score if available (fallback to 0.8)
  const matchScore = rec.recommendation?.matchScore || 80;
  const badgeOpacity = Math.max(0.6, Math.min(1, matchScore / 100));

  useGSAP(() => {
    const card = cardRef.current;
    if (!card) return;

    // Match media for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) return;

    const hoverTl = gsap.timeline({ paused: true });
    
    hoverTl.to(card, {
      y: -6,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 0 40px rgba(220, 38, 38, 0.15)",
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
      className="rounded-xl border border-white/5 bg-black/40 backdrop-blur-sm relative group flex flex-col cursor-pointer shadow-[0_4px_6px_-1px_rgba(0,0,0,0.5),0_0_15px_rgba(220,38,38,0.02)]"
      style={{
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.5), 0 0 15px rgba(220,38,38,0.02)"
      }}
    >
      <Link href={`/community/${slug}`} className="absolute inset-0 z-0" aria-label={`View ${rec.item.title} community`} />
      
      {/* Floating Badge Accent */}
      <div 
        ref={badgeRef}
        className="absolute top-3 right-3 bg-red-600 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full z-10 flex items-center gap-1.5 pointer-events-none border border-red-400/50 transform rotate-[-2deg]"
        style={{ opacity: badgeOpacity, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)" }}
      >
        <Sparkles className="w-3 h-3" /> Strong Match
      </div>
      
      <div className="overflow-hidden h-32 relative rounded-t-xl">
        <div 
          ref={imageRef}
          className="absolute inset-0 bg-cover bg-center pointer-events-none"
          style={{ 
            backgroundImage: `url(${imageUrl})`,
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)'
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
      
      <div className="p-5 flex flex-col h-full z-10 pointer-events-none -mt-4 relative">
        <h3 className="font-bold text-lg text-white/90 truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" title={rec.item.title}>{rec.item.title}</h3>
        
        {/* Genre Chips */}
        <div className="flex flex-wrap gap-1.5 mt-2 mb-4">
          {rec.item.genres?.slice(0, 3).map((genre: string) => (
            <span key={genre} className="text-[9px] uppercase tracking-wider text-white/70 border border-white/10 rounded-full px-2 py-0.5 bg-white/5 backdrop-blur-sm">
              {genre}
            </span>
          ))}
        </div>
        
        <div className="mt-auto relative z-20 pointer-events-auto">
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setExplainItemId(rec.item._id);
            }}
            className="flex items-center gap-1.5 text-xs font-medium text-red-400 hover:text-red-300 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" /> Why am I seeing this?
          </button>
        </div>
      </div>
    </div>
  );

}
