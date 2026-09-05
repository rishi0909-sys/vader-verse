"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import LetterGlitch from "@/components/LetterGlitch";

interface VaderLoaderProps {
  isActive: boolean;
  destinationPath: string;
}

export default function VaderLoader({ isActive, destinationPath }: VaderLoaderProps) {
  const [displayDest, setDisplayDest] = useState("VADER-VERSE");
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isVisibleRef = useRef(false);

  useEffect(() => {
    if (!destinationPath || destinationPath === "/") {
      setDisplayDest("VADER-VERSE");
      return;
    }

    const segments = destinationPath.split("/").filter(Boolean);
    if (segments.length > 0) {
      const mainSegment = segments[0];
      const name = mainSegment.replace(/-/g, " ").toUpperCase();
      if (mainSegment === "community" && segments[1]) {
        setDisplayDest(`ENTERING ${segments[1].replace(/-/g, " ").toUpperCase()}`);
      } else if (mainSegment === "profile") {
        setDisplayDest("OPENING PROFILE");
      } else if (mainSegment === "journey") {
        setDisplayDest("OPENING YOUR JOURNEY");
      } else {
        setDisplayDest(`ENTERING ${name}`);
      }
    } else {
      setDisplayDest("ENTERING VADER-VERSE");
    }
  }, [destinationPath]);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    if (isActive && !isVisibleRef.current) {
      // ENTER ANIMATION
      isVisibleRef.current = true;
      gsap.set(container, { display: "flex" });
      
      gsap.fromTo(
        container,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      );

      gsap.fromTo(
        content,
        { opacity: 0, scale: 0.98, y: 10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "power3.out" }
      );

      gsap.fromTo(
        ".loader-symbol",
        { rotate: -45, scale: 0.5 },
        { rotate: 0, scale: 1, duration: 0.8, ease: "back.out(1.7)" }
      );
    } else if (!isActive && isVisibleRef.current) {
      // EXIT ANIMATION
      isVisibleRef.current = false;
      
      gsap.to(content, {
        opacity: 0,
        scale: 0.95,
        y: -10,
        duration: 0.4,
        ease: "power2.in",
      });

      gsap.to(container, {
        opacity: 0,
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: () => {
          gsap.set(container, { display: "none" });
        }
      });
    }
  }, [isActive]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[9999] hidden flex-col items-center justify-center bg-zinc-950 text-zinc-50 overflow-hidden"
    >
      {/* Background atmospheric effect */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none mix-blend-screen">
        {isActive && (
          <LetterGlitch 
            glitchColors={['#2b4539', '#4a9072', '#1d2c25']}
            glitchSpeed={80}
            centerVignette={true}
            outerVignette={true}
            smooth={true}
            characters="VADERVERSE"
          />
        )}
      </div>

      {/* Foreground Content */}
      <div ref={contentRef} className="z-10 flex flex-col items-center justify-center space-y-8 opacity-0">
        <div className="text-[10px] tracking-[0.4em] text-zinc-500 font-mono">
          VADER-VERSE
        </div>
        
        {/* Animated Geometric Symbol */}
        <div className="w-8 h-8 relative flex items-center justify-center">
          <div className="loader-symbol absolute inset-0 flex items-center justify-center">
            <div className="absolute inset-0 border border-zinc-500 rotate-45 animate-[spin_10s_linear_infinite]" />
            <div className="absolute inset-1 border border-zinc-400 rotate-0 animate-[spin_8s_linear_infinite_reverse]" />
            <div className="w-1.5 h-1.5 bg-zinc-200 animate-pulse" />
          </div>
        </div>

        <div className="text-sm tracking-widest text-zinc-300 font-mono uppercase">
          {displayDest}
        </div>
      </div>
    </div>
  );
}
