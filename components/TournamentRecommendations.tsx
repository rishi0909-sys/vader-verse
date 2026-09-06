"use client";
import React from 'react';

import { useEffect, useState } from "react";
import { getTournamentRecommendations, RecommendedItem } from "@/services/client/recommendations";
import { Sparkles, HelpCircle, Calendar, Users, Trophy } from "lucide-react";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
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
      <section className="mb-12 rounded-3xl border border-white/10 bg-black/20 backdrop-blur-md shadow-2xl p-8 flex flex-col gap-6 relative">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-400/30 shadow-inner">
            <Trophy className="w-6 h-6 text-blue-400 drop-shadow-md" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-blue-400 mb-1 flex items-center gap-2 drop-shadow-md">
              <Sparkles className="w-4 h-4" /> Recommended Tournaments
            </h3>
            <p className="text-sm text-white/50 font-medium">Based on your competitive history and favorite games.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loading ? (
            <>
              <div className="h-32 bg-white/5 backdrop-blur-sm border border-white/5 animate-pulse rounded-2xl" />
              <div className="h-32 bg-white/5 backdrop-blur-sm border border-white/5 animate-pulse rounded-2xl" />
            </>
          ) : (
            recommendations.map((rec) => (
              <TournamentCard key={rec.item._id} rec={rec} setExplainItemId={setExplainItemId} />
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

function TournamentCard({ rec, setExplainItemId }: { rec: RecommendedItem, setExplainItemId: (id: string) => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  const slug = rec.item.slug || rec.item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const imageUrl = rec.item.game?.background_image || `https://picsum.photos/seed/${slug}-tourney/400/200`;
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
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 0 40px rgba(59, 130, 246, 0.15)",
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
      className="border border-white/5 bg-black/40 backdrop-blur-md rounded-2xl p-6 flex flex-col sm:flex-row gap-6 relative group cursor-pointer shadow-[0_4px_6px_-1px_rgba(0,0,0,0.5),0_0_15px_rgba(59,130,246,0.02)]"
      style={{
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.5), 0 0 15px rgba(59,130,246,0.02)"
      }}
    >
      <div 
        ref={badgeRef}
        className="absolute top-3 right-3 bg-blue-600 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full z-10 flex items-center gap-1.5 border border-blue-400/50 transform rotate-[-2deg] pointer-events-none"
        style={{ opacity: badgeOpacity, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)" }}
      >
        <Sparkles className="w-3 h-3" /> Selected For You
      </div>

      <div className="w-full sm:w-1/3 h-32 bg-white/5 border border-white/5 rounded-xl shrink-0 overflow-hidden relative">
        <div 
          ref={imageRef}
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${imageUrl})`,
            maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)'
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
      <div className="flex-1 flex flex-col z-10 relative">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-white/90 pr-20 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-colors">{rec.item.title}</h3>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="text-[9px] uppercase tracking-wider text-white/70 border border-white/10 rounded-full px-2 py-0.5 bg-white/5 backdrop-blur-sm">
            {rec.item.game?.title || "Unknown Game"}
          </span>
          <span className="text-[9px] uppercase tracking-wider text-white/70 border border-white/10 rounded-full px-2 py-0.5 bg-white/5 backdrop-blur-sm">
            {rec.item.status}
          </span>
        </div>
        
        <div className="mt-auto pt-3 border-t border-white/10 flex justify-between items-center relative z-20 pointer-events-auto">
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setExplainItemId(rec.item._id);
            }}
            className="flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" /> Why am I seeing this?
          </button>
          <span className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 backdrop-blur-md">Open</span>
        </div>
      </div>
    </div>
  );

}
