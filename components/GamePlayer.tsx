"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";

interface GamePlayerProps {
  title: string;
  embedUrl: string;
  provider?: string;
}

export function GamePlayer({ title, embedUrl, provider }: GamePlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative w-full aspect-video bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 shadow-xl">
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 z-10">
          <Loader2 className="w-8 h-8 text-red-500 animate-spin mb-4" />
          <p className="text-zinc-400 font-medium animate-pulse">Loading {title}...</p>
          {provider && <p className="text-zinc-600 text-sm mt-2">Provided by {provider}</p>}
        </div>
      )}
      
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 z-10 p-6 text-center">
          <div className="text-red-500 mb-2">⚠️</div>
          <p className="text-zinc-300 font-bold mb-2">Failed to load game</p>
          <p className="text-zinc-500 text-sm">
            This game might not allow embedding or the connection was refused.
          </p>
          <button 
            onClick={() => { setIsLoading(true); setHasError(false); }}
            className="mt-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md text-sm transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      <iframe
        src={embedUrl}
        title={`Play ${title}`}
        className="absolute inset-0 w-full h-full border-none"
        allowFullScreen
        sandbox="allow-scripts allow-same-origin"
        onLoad={() => setIsLoading(false)}
        onError={() => { setIsLoading(false); setHasError(true); }}
      />
    </div>
  );
}
