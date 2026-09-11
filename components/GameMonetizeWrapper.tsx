"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import Script from "next/script";

interface GameMonetizeContextType {
  isPaused: boolean;
  isReady: boolean;
  showAd: () => void;
}

const GameMonetizeContext = createContext<GameMonetizeContextType>({
  isPaused: false,
  isReady: false,
  showAd: () => {},
});

export const useGameMonetize = () => useContext(GameMonetizeContext);

declare global {
  interface Window {
    SDK_OPTIONS: {
      gameId: string;
      onEvent: (event: { name: string }) => void;
    };
    sdk?: {
      showBanner: () => void;
    };
  }
}

export function GameMonetizeWrapper({ children }: { children: ReactNode }) {
  const [isPaused, setIsPaused] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    window.SDK_OPTIONS = {
      gameId: process.env.NEXT_PUBLIC_GAMEMONETIZE_ID || "dummy_game_id",
      onEvent: function (event) {
        switch (event.name) {
          case "SDK_GAME_PAUSE":
            // Pause game logic / mute audio
            console.log("[GameMonetize] Ad started. Pausing game.");
            setIsPaused(true);
            break;
          case "SDK_GAME_START":
            // Advertisement done, resume game logic and unmute audio
            console.log("[GameMonetize] Ad finished. Resuming game.");
            setIsPaused(false);
            break;
          case "SDK_READY":
            // When SDK is ready
            console.log("[GameMonetize] SDK Ready!");
            setIsReady(true);
            break;
        }
      },
    };
  }, []);

  const showAd = useCallback(() => {
    if (typeof window.sdk !== "undefined" && typeof window.sdk.showBanner === "function") {
      console.log("[GameMonetize] Requesting ad banner...");
      window.sdk.showBanner();
    } else {
      console.warn("[GameMonetize] SDK not loaded or showBanner not available.");
    }
  }, []);

  return (
    <GameMonetizeContext.Provider value={{ isPaused, isReady, showAd }}>
      {children}
    </GameMonetizeContext.Provider>
  );
}
