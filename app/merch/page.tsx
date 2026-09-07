"use client";

import { ShoppingBag } from "lucide-react";
import { GradientWaves } from '@/components/Backgrounds';
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function MerchPage() {
  return (
    <main className="relative w-full min-h-screen">
      {/* Background Layer z-0 */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <GradientWaves 
          horizonColor="#0a0a0a"
          waveColor="#7F1D1D"
          crestColor="#DC2626"
          speed={0.08}
        />
      </div>
      
      {/* Contrast/Readability Layer z-1 */}
      <div className="fixed inset-0 pointer-events-none z-1 bg-gradient-to-b from-transparent via-black/0 to-black/50" />
      
      {/* Existing Content z-10 */}
      <div className="relative z-10 min-h-screen flex flex-col">
        
        {/* CHAPTER 01: OPENING */}
        <section className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4 pt-24 pb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
          <h1 className="text-5xl md:text-8xl font-black mb-4 text-white drop-shadow-[0_0_40px_rgba(255,159,252,0.3)] tracking-tighter uppercase">
            Vader-Verse
          </h1>
          <h2 className="text-2xl md:text-3xl font-light tracking-[0.3em] text-white/70 uppercase">
            Collection 01
          </h2>
        </section>

        {/* CHAPTER 02: FLAGSHIP DROP */}
        <section className="container mx-auto px-4 mb-24 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300 fill-mode-both">
          <div className="w-full xl:w-4/5 mx-auto">
            <div className="group cursor-pointer">
              <div className="border border-white/10 bg-black/30 backdrop-blur-xl rounded-[2.5rem] overflow-hidden hover:border-purple-400/50 transition-all duration-700 hover:bg-black/50 shadow-2xl relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none" />
                <div className="absolute top-6 left-6 px-4 py-1.5 bg-white text-black font-black text-xs uppercase tracking-widest rounded-full z-10 shadow-lg">
                  Flagship Drop
                </div>
                <div className="h-96 md:h-[32rem] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <ShoppingBag className="w-32 h-32 text-white/30 group-hover:scale-110 group-hover:text-purple-300/60 transition-all duration-700 ease-out" />
                </div>
              </div>
              <div className="px-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h3 className="font-black text-white text-3xl md:text-4xl mb-2 tracking-tight">The Origin Hoodie</h3>
                  <p className="text-white/50 text-lg font-medium">Premium heavyweight cotton. Embroidered sigil.</p>
                </div>
                <p className="text-purple-300 font-bold text-2xl md:text-3xl tracking-tight">$85.00</p>
              </div>
            </div>
          </div>
        </section>

        {/* CHAPTER 03: THE COLLECTION */}
        <section className="container mx-auto px-4 mb-32">
          <div className="flex items-center justify-center mb-16">
            <div className="h-px bg-white/10 w-12" />
            <h2 className="text-xl font-light text-white/60 uppercase tracking-widest mx-6">Full Catalog</h2>
            <div className="h-px bg-white/10 w-12" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-16">
            {[2, 3, 4].map((i) => (
              <MerchCard key={i} index={i} />
            ))}
          </div>
        </section>

        {/* CHAPTER 04: INFRASTRUCTURE (Moved to bottom) */}
        <section className="container mx-auto px-4 pb-12 mt-auto">
          <div className="p-6 rounded-2xl border border-white/5 bg-black/20 backdrop-blur-md text-center max-w-2xl mx-auto">
            <p className="text-white/40 font-medium text-sm">
              Developer Note: This store integrates with the Printful API to process and fulfill exclusive Vader-Verse merchandise.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function MerchCard({ index }: { index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const card = cardRef.current;
    if (!card) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const hoverTl = gsap.timeline({ paused: true });
    
    hoverTl.to(card, {
      y: -6,
      /* Removed expensive boxShadow animation */
      duration: 0.5,
      ease: "power3.out"
    }, 0);

    hoverTl.to(imageRef.current, {
      scale: 1.08,
      duration: 0.5,
      ease: "power3.out"
    }, 0);

    card.addEventListener("mouseenter", () => hoverTl.play());
    card.addEventListener("mouseleave", () => hoverTl.reverse());

    return () => {
      card.removeEventListener("mouseenter", () => hoverTl.play());
      card.removeEventListener("mouseleave", () => hoverTl.reverse());
    };
  }, { scope: cardRef });

  return (
    <div className="group cursor-pointer">
      <div 
        ref={cardRef}
        className="border border-white/10 bg-black/20 backdrop-blur-md rounded-3xl overflow-hidden hover:border-purple-400/30 transition-colors duration-500 mb-6"
      >
        <div className="h-72 flex items-center justify-center relative overflow-hidden bg-black/40">
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <ShoppingBag 
            ref={imageRef as any} 
            className="w-16 h-16 text-white/20 group-hover:text-purple-300/50 transition-colors duration-500" 
          />
        </div>
      </div>
      <div className="px-2 text-center">
        <h3 className="font-bold text-white/90 mb-2 group-hover:text-white transition-colors text-xl tracking-tight">Vader Essential {index}</h3>
        <p className="text-purple-300/80 font-medium tracking-wide">$35.00</p>
      </div>
    </div>
  );
}
