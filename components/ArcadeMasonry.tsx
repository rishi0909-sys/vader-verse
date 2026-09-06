"use client";

import React, { useMemo } from 'react';
import Masonry from './Masonry';
import { GameMonetizeGame } from '@/services/gamemonetizeService';

interface ArcadeMasonryProps {
  games: GameMonetizeGame[];
}

export default function ArcadeMasonry({ games }: ArcadeMasonryProps) {
  // Map games to Masonry items
  const items = useMemo(() => {
    return games.map((game, index) => {
      // Generate a dynamic height between 200 and 400 for masonry staggered effect
      // We use a deterministic pseudo-random height based on the index or ID to avoid hydration mismatch
      const pseudoRandom = (game.id.charCodeAt(0) + game.id.charCodeAt(game.id.length - 1) + index) % 3;
      const heights = [250, 350, 450]; 

      return {
        id: game.id,
        img: game.thumb,
        url: `/arcade/play/${game.id}`,
        height: heights[pseudoRandom]
      };
    });
  }, [games]);

  if (!games || games.length === 0) {
    return <p className="text-zinc-400">No games found.</p>;
  }

  return (
    <div className="w-full overflow-hidden rounded-xl border border-white/10 relative shadow-2xl pb-8">
      {/* Background layer for the masonry container */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md pointer-events-none z-0" />
      
      <div className="relative z-10 w-full p-6 overflow-y-auto overflow-x-hidden scrollbar-hide">
        <Masonry 
          items={items} 
          animateFrom="bottom" 
          scaleOnHover={true}
          blurToFocus={true}
          colorShiftOnHover={true}
        />
      </div>
    </div>
  );
}
