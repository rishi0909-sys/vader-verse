"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { GameMonetizeGame } from "@/services/gamemonetizeService";
import { Play } from "lucide-react";

interface PlayableGameCardProps {
  game: GameMonetizeGame;
}

export default function PlayableGameCard({ game }: PlayableGameCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const playButtonRef = useRef<HTMLDivElement>(null);

  const imageUrl = game.thumb;

  useGSAP(() => {
    const card = cardRef.current;
    if (!card) return;

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

    if (badgeRef.current) {
      hoverTl.to(badgeRef.current, {
        y: -4,
        rotation: -4,
        boxShadow: "0 12px 20px rgba(0, 0, 0, 0.4)",
        duration: 0.4,
        ease: "power2.out"
      }, 0);
    }

    if (playButtonRef.current) {
      hoverTl.to(playButtonRef.current, {
        opacity: 1,
        scale: 1.1,
        duration: 0.3,
        ease: "back.out(1.5)"
      }, 0);
    }

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
      className="rounded-xl border border-white/5 bg-black/40 backdrop-blur-sm relative group flex flex-col cursor-pointer shadow-[0_4px_6px_-1px_rgba(0,0,0,0.5),0_0_15px_rgba(220,38,38,0.02)] min-w-[300px] sm:min-w-[400px] shrink-0 overflow-hidden"
      style={{
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.5), 0 0 15px rgba(220,38,38,0.02)"
      }}
    >
      <Link href={`/arcade/play/${game.id}`} className="absolute inset-0 z-10" aria-label={`Play ${game.title}`} />
      
      {/* Category Badge */}
      <div 
        ref={badgeRef}
        className="absolute top-4 left-4 bg-red-600 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-sm z-20 flex items-center shadow-[0_4px_8px_rgba(0,0,0,0.5)] pointer-events-none transform rotate-[-2deg] border border-red-400/50 uppercase tracking-widest"
      >
        {game.category || "HTML5"}
      </div>
      
      <div className="overflow-hidden h-48 sm:h-56 relative rounded-t-xl bg-zinc-900">
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
        
        {/* Play Button Overlay */}
        <div 
          ref={playButtonRef}
          className="absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none"
        >
          <div className="w-16 h-16 bg-red-600/90 backdrop-blur rounded-full flex items-center justify-center pl-1 shadow-[0_0_30px_rgba(220,38,38,0.5)] border border-red-400/50">
            <Play className="w-8 h-8 text-white fill-white" />
          </div>
        </div>
      </div>
      
      <div className="p-6 flex flex-col justify-end z-20 pointer-events-none -mt-8 relative h-full">
        <h3 className="font-bold text-2xl text-white/90 truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{game.title}</h3>
        
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {game.tags && game.tags.split(',').slice(0,3).map((tag: string) => (
             <span key={tag} className="text-[10px] uppercase tracking-wider text-white/50 border border-white/10 rounded-full px-2 py-0.5 bg-white/5 backdrop-blur-sm">
               {tag.trim()}
             </span>
          ))}
        </div>
      </div>
    </div>
  );
}
