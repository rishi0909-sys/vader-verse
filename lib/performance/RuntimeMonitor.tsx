"use client";

import { useEffect, useRef, useState } from 'react';
import { usePerformance } from './usePerformance';

export function RuntimeMonitor() {
  const { deviceCapability, runtimeQuality, profile, requestDowngrade, requestUpgrade } = usePerformance();
  const [debugData, setDebugData] = useState({ fps: 60, frameTime: 16 });
  const [isVisible, setIsVisible] = useState(false);

  const fpsRef = useRef(60);
  const framesRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const badFramesCount = useRef(0);
  const goodFramesCount = useRef(0);

  // Downgrade if sustained < 45 FPS (approx 22ms per frame)
  // Upgrade if sustained > 55 FPS (approx 18ms per frame)
  const BAD_FPS_THRESHOLD = 45;
  const GOOD_FPS_THRESHOLD = 55;
  const BAD_FRAMES_LIMIT = 60; // Approx 1 second of bad frames
  const GOOD_FRAMES_LIMIT = 300; // Approx 5 seconds of good frames

  useEffect(() => {
    // Keyboard shortcut to toggle debug overlay: Ctrl+Shift+P
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(v => !v);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const loop = (time: number) => {
      framesRef.current++;
      const delta = time - lastTimeRef.current;

      if (delta >= 1000) {
        const currentFps = (framesRef.current * 1000) / delta;
        fpsRef.current = currentFps;
        
        if (isVisible) {
          setDebugData({
            fps: Math.round(currentFps),
            frameTime: Math.round(1000 / currentFps)
          });
        }

        framesRef.current = 0;
        lastTimeRef.current = time;
      }

      // Track frame-by-frame drops
      const frameDelta = time - (lastTimeRef.current + (framesRef.current - 1) * (1000 / 60)); // Approximate frame duration
      
      // Simple rolling check (every second)
      if (delta >= 1000) {
        const fps = fpsRef.current;
        if (fps < BAD_FPS_THRESHOLD) {
          badFramesCount.current++;
          goodFramesCount.current = 0;
        } else if (fps > GOOD_FPS_THRESHOLD) {
          goodFramesCount.current++;
          badFramesCount.current = 0;
        } else {
          // Neutral
          badFramesCount.current = Math.max(0, badFramesCount.current - 1);
        }

        if (badFramesCount.current >= 2) { // 2 seconds of bad frames
           requestDowngrade();
           badFramesCount.current = -5; // Cooldown
           goodFramesCount.current = 0;
        } else if (goodFramesCount.current >= 10) { // 10 seconds of good frames
           requestUpgrade();
           goodFramesCount.current = -10; // Cooldown
           badFramesCount.current = 0;
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isVisible, requestDowngrade, requestUpgrade]);

  if (!isVisible && process.env.NODE_ENV !== 'development') {
    return null;
  }

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[9999] bg-black/80 backdrop-blur-md border border-white/20 p-4 rounded-xl text-xs font-mono text-white shadow-2xl pointer-events-none">
      <div className="font-bold text-red-400 mb-2 border-b border-white/10 pb-1">VADER PERFORMANCE</div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        <span className="text-white/50">Device:</span> <span className="text-emerald-400">{deviceCapability}</span>
        <span className="text-white/50">Runtime:</span> <span className="text-blue-400">{runtimeQuality}</span>
        <span className="text-white/50">FPS:</span> <span>{debugData.fps}</span>
        <span className="text-white/50">Frame:</span> <span>{debugData.frameTime}ms</span>
        <span className="text-white/50">DPR Max:</span> <span>{profile.dprConfig[1].toFixed(2)}</span>
        <span className="text-white/50">Shaders:</span> <span>{(profile.shaderQuality * 100).toFixed(0)}%</span>
      </div>
    </div>
  );
}
