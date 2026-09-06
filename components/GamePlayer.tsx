"use client";

import { useRef, useState } from "react";
import { useGameMonetize } from "@/components/GameMonetizeWrapper";
import { Loader2, Maximize2 } from "lucide-react";
import { MonetizeDemo } from "./MonetizeDemo";

interface GamePlayerProps {
  gameUrl: string;
}

export function GamePlayer({ gameUrl }: GamePlayerProps) {
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div ref={containerRef} className="absolute inset-0 bg-black flex items-center justify-center group overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 z-10">
          <Loader2 className="w-10 h-10 animate-spin text-red-600 mb-4" />
          <p className="text-zinc-400 font-mono text-sm tracking-widest uppercase animate-pulse">Initializing Game Engine...</p>
        </div>
      )}
      
      <iframe 
        src={gameUrl} 
        className={`w-full h-full border-none transition-opacity duration-1000 ${loading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => setLoading(false)}
        allow="autoplay; fullscreen; microphone; camera; display-capture;"
        allowFullScreen
      />

      {/* Overlay Controls */}
      <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={handleFullscreen}
          className="p-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg text-white hover:bg-red-600/80 transition-colors shadow-lg"
          title="Fullscreen"
        >
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>

      <MonetizeDemo />
    </div>
  );
}
