"use client";

import { useEffect } from "react";
import { useGameMonetize } from "./GameMonetizeWrapper";

export function MonetizeDemo() {
  const { isPaused, isReady } = useGameMonetize();

  useEffect(() => {
    console.log(`[GameMonetize] SDK Ready: ${isReady}, Game Paused: ${isPaused}`);
  }, [isReady, isPaused]);

  return null;
}
