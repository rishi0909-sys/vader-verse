"use client";

import React, { forwardRef, useRef } from "react";
import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { Crosshair, Swords, Car, Zap, Crown } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "feature-node z-10 flex h-16 w-16 items-center justify-center rounded-full border-2 border-zinc-800 bg-zinc-950 p-3 shadow-[0_0_20px_-12px_rgba(220,38,38,0.8)] opacity-0",
        className,
      )}
    >
      {children}
    </div>
  );
});

Circle.displayName = "Circle";

export default function FeaturesBeam() {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);
  const centralRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Create a pinned timeline for the entire section
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".features-beam-section",
        start: "top 70%",
        toggleActions: "play none none reverse"
      }
    });

    // Animate the nodes popping in automatically when reached
    tl.fromTo(".feature-node",
      { scale: 0.5, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)"
      }
    )
    // Fade in the beams automatically
    .fromTo(".animated-beam-svg",
      { opacity: 0 },
      { opacity: 1, duration: 1.5, ease: "power2.inOut" },
      "-=0.2"
    );
  }, { scope: typeof window !== "undefined" ? document.body : containerRef });

  return (
    <div
      className="features-hub-container relative flex w-full max-w-6xl mx-auto items-center justify-center overflow-hidden rounded-xl p-10 min-h-[500px]"
      ref={containerRef}
    >
      <div className="flex h-full w-full flex-col items-stretch justify-between gap-24 relative z-10">
        
        {/* Top Row */}
        <div className="flex flex-row items-center justify-between px-16">
          <div className="flex flex-col items-center gap-3">
            <Circle ref={div1Ref}>
              <Crosshair className="w-10 h-10 text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
            </Circle>
            <span className="text-sm font-bold text-zinc-300 drop-shadow-md">FPS & Shooters</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <Circle ref={div2Ref}>
              <Swords className="w-10 h-10 text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
            </Circle>
            <span className="text-sm font-bold text-zinc-300 drop-shadow-md">RPG & Adventure</span>
          </div>
        </div>
        
        {/* Middle Row */}
        <div className="flex flex-row items-center justify-between px-4">
          <div className="flex flex-col items-center gap-3">
            <Circle ref={div3Ref}>
              <Car className="w-10 h-10 text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
            </Circle>
            <span className="text-sm font-bold text-zinc-300 drop-shadow-md">Sim & Racing</span>
          </div>
          
          <div className="flex flex-col items-center justify-center relative">
            <Circle ref={centralRef} className="h-32 w-32 border-red-900/50 bg-black z-10 relative">
              <span className="text-2xl font-bold tracking-tighter text-white text-center leading-tight">
                VADER<br/><span className="text-red-500">VERSE</span>
              </span>
            </Circle>
          </div>

          <div className="flex flex-col items-center gap-3">
            <Circle ref={div4Ref}>
              <Zap className="w-10 h-10 text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
            </Circle>
            <span className="text-sm font-bold text-zinc-300 drop-shadow-md">Fighters</span>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="flex flex-row items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Circle ref={div5Ref}>
              <Crown className="w-10 h-10 text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
            </Circle>
            <span className="text-sm font-bold text-zinc-300 drop-shadow-md">Strategy & MOBA</span>
          </div>
        </div>
      </div>

      {/* Beams flowing INWARDS (reverse=true) */}
      <div className="animated-beam-svg absolute inset-0 opacity-0 pointer-events-none">
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={div1Ref}
          toRef={centralRef}
          curvature={-75}
          endYOffset={-10}
          reverse={true}
          pathColor="rgba(255, 0, 0, 0.25)"
          pathOpacity={1}
          gradientStartColor="#ff0000"
          gradientStopColor="#ff9999"
          pathWidth={4}
          duration={6}
          delay={0}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={div2Ref}
          toRef={centralRef}
          curvature={75}
          endYOffset={-10}
          reverse={true}
          pathColor="rgba(255, 0, 0, 0.25)"
          pathOpacity={1}
          gradientStartColor="#ff0000"
          gradientStopColor="#ff9999"
          pathWidth={4}
          duration={6.5}
          delay={1}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={div3Ref}
          toRef={centralRef}
          curvature={0}
          reverse={true}
          pathColor="rgba(255, 0, 0, 0.25)"
          pathOpacity={1}
          gradientStartColor="#ff0000"
          gradientStopColor="#ff9999"
          pathWidth={4}
          duration={5.5}
          delay={0.5}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={div4Ref}
          toRef={centralRef}
          curvature={0}
          reverse={true}
          pathColor="rgba(255, 0, 0, 0.25)"
          pathOpacity={1}
          gradientStartColor="#ff0000"
          gradientStopColor="#ff9999"
          pathWidth={4}
          duration={7}
          delay={1.5}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={div5Ref}
          toRef={centralRef}
          curvature={-40}
          reverse={true}
          isVertical={true}
          pathColor="rgba(255, 0, 0, 0.25)"
          pathOpacity={1}
          gradientStartColor="#ff0000"
          gradientStopColor="#ff9999"
          pathWidth={4}
          duration={6}
          delay={2}
        />
      </div>

    </div>
  );
}
