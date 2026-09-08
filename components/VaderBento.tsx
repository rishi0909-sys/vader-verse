"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { BentoGrid, BentoCard } from "./BentoGrid";
import { Gamepad2, Newspaper, Trophy, Users, X, ArrowRight } from "lucide-react";
import Image from "next/image";
import LineSidebar from "./LineSidebar";
import { CANONICAL_GAMES } from "@/lib/config/games";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLoader } from "@/components/loading/LoaderProvider";

export const VaderBento = () => {
  const [showModal, setShowModal] = useState(false);
  const [activeGameIndex, setActiveGameIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { startLoader } = useLoader();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!showModal) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        setShowModal(false);
        const url = `/community/${CANONICAL_GAMES[activeGameIndex].slug}`;
        startLoader(url);
        router.push(url);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showModal, activeGameIndex, router, startLoader]);

  return (
    <section className="vader-bento-section w-full min-h-[100vh] flex flex-col justify-center items-center py-24 px-4 relative z-10 bg-black">
      
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-black to-black" />

      <div className="w-full px-4 md:px-8 xl:px-12 relative z-10">
        
        <div className="text-center mb-16">
          <h2 className="vader-bento-title text-3xl sm:text-4xl md:text-6xl font-black text-white tracking-tighter uppercase drop-shadow-[0_0_25px_rgba(220,38,38,0.3)] mb-4">
            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">Vader-Verse</span>
          </h2>
          <p className="vader-bento-subtitle text-zinc-400 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Here are the worlds inside Vader-Verse that matter to you.
          </p>
        </div>

        <BentoGrid className="w-full max-w-none grid grid-cols-1 md:grid-cols-3 md:auto-rows-[400px] xl:auto-rows-[450px] gap-6 xl:gap-8 vader-bento-grid">
          
          {/* Arcade Card (Spans 2 columns on desktop) */}
          <BentoCard
            name="Arcade"
            className="md:col-span-2 bento-card-item overflow-hidden"
            Icon={Gamepad2}
            description="Dive back into the action. Endless worlds await."
            href="/arcade"
            cta="Enter Arcade"
            background={
              <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
                <Image
                  src="/images/arcade_minimal.jpg"
                  alt="Arcade Background"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 66vw"
                  className="object-cover opacity-100 group-hover:scale-110 transition-all duration-[5000ms] ease-out"
                />
              </div>
            }
          />

          {/* News Card (Spans 1 column on desktop) */}
          <BentoCard
            name="News"
            className="md:col-span-1 bento-card-item overflow-hidden"
            Icon={Newspaper}
            description="Stay connected. Live updates from the frontier."
            href="/news"
            cta="Read News"
            background={
              <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
                <Image
                  src="/images/news_minimal.jpg"
                  alt="News Background"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                  className="object-cover opacity-100 group-hover:scale-110 transition-transform duration-[5000ms] ease-out"
                />
              </div>
            }
          />

          {/* Tournaments Card (Spans 1 column on desktop) */}
          <BentoCard
            name="Tournaments"
            className="md:col-span-1 bento-card-item overflow-hidden"
            Icon={Trophy}
            description="Claim your glory. Compete in live brackets."
            href="/tournaments"
            cta="View Brackets"
            background={
              <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
                <Image
                  src="/images/tournaments_minimal.jpg"
                  alt="Tournaments Background"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                  className="object-cover opacity-100 group-hover:scale-110 transition-transform duration-[5000ms] ease-out"
                />
              </div>
            }
          />

          {/* Communities Card (Spans 2 columns on desktop) */}
          <BentoCard
            name="Communities"
            className="md:col-span-2 bento-card-item overflow-hidden cursor-pointer"
            Icon={Users}
            description="Find your squad. 10,000+ active players online."
            href="#"
            cta="Explore Hubs"
            onClick={(e) => {
              e.preventDefault();
              setShowModal(true);
            }}
            background={
              <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
                <Image
                  src="/images/communities_minimal.jpg"
                  alt="Community Background"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 66vw"
                  className="object-cover opacity-100 group-hover:scale-110 transition-transform duration-[5000ms] ease-out"
                />
              </div>
            }
          />
        </BentoGrid>

      </div>

      {/* OptionWheel Modal for Communities */}
      {showModal && mounted && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-4xl bg-black border border-white/5 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)] flex flex-col md:flex-row h-[500px]">
            {/* Background Red Glow */}
            <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_50%_120%,rgba(220,38,38,0.15),transparent_70%)]" />
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 z-50 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            
            {/* LineSidebar Section */}
            <div className="w-full md:w-1/2 h-full flex justify-start border-b md:border-b-0 md:border-r border-white/5 relative bg-gradient-to-br from-red-950/20 to-black overflow-y-auto overflow-x-hidden custom-scrollbar py-10 px-4 md:px-12">
              <LineSidebar 
                items={CANONICAL_GAMES.map(g => g.title)}
                defaultActive={activeGameIndex}
                onItemClick={(index) => setActiveGameIndex(index)}
                accentColor="#ef4444"
                textColor="#a1a1aa"
                markerColor="#27272a"
                fontSize={1.2}
              />
            </div>

            {/* Selected Game Info Section */}
            <div className="w-full md:w-1/2 h-full flex flex-col items-center justify-center p-8 bg-transparent relative z-10">
               <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-2 text-center">
                 {CANONICAL_GAMES[activeGameIndex].title}
               </h3>
               <p className="text-zinc-400 text-center mb-8 max-w-xs">
                 Join the active playerbase and find your squad in the dedicated community hub.
               </p>
               <Link
                 href={`/community/${CANONICAL_GAMES[activeGameIndex].slug}`}
                 onClick={() => {
                   setShowModal(false);
                   startLoader(`/community/${CANONICAL_GAMES[activeGameIndex].slug}`);
                 }}
                 className="inline-flex items-center gap-2 text-lg font-bold text-white bg-red-600 hover:bg-red-500 px-8 py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:scale-105"
               >
                 Enter Community <ArrowRight className="w-5 h-5" />
               </Link>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
};
