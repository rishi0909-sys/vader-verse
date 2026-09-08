"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { ArrowRight, Trophy, Gamepad2, Newspaper } from "lucide-react";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const MoltenMetal = dynamic(() => import("@/components/MoltenMetal"), { 
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-red-950/10 animate-pulse" />
});
const LetterGlitch = dynamic(() => import("@/components/LetterGlitch"), { 
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-black animate-pulse" />
});
const DriftWall = dynamic(() => import("@/components/DriftWall"), { 
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-zinc-900/50 animate-pulse rounded-xl" />
});
const FlowingMenu = dynamic(() => import("@/components/FlowingMenu"), { 
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-red-900/10 animate-pulse" />
});
import FeaturesBeam from "@/components/FeaturesBeam";
import BorderGlow from "@/components/BorderGlow";
import { VaderBento } from "@/components/VaderBento";
const TrueFocus = dynamic(() => import("@/components/TrueFocus"), { ssr: false });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });

import { CANONICAL_GAMES } from '@/lib/config/games';

const flowingMenuItems = [
  { link: '/arcade', text: 'Arcade Games', image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=600&auto=format&fit=crop' },
  { link: '/tournaments', text: 'Pro Tournaments', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop' },
  { link: '/news', text: 'Daily Digest', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop' },
  { link: '/merch', text: 'Exclusive Merch', image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=600&auto=format&fit=crop' },
];

// Map Canonical Games to DriftWallItems
const baseDriftWallItems = CANONICAL_GAMES.map(game => ({
  image: game.image,
  title: game.title,
  href: `/community/${game.slug}`
}));

// Generate 60 items using the local images so the wall feels infinite but renders faster
const driftWallItems = Array.from({ length: 60 }, (_, i) => {
  const pseudoRandomIndex = (i * 7 + 13) % baseDriftWallItems.length;
  return baseDriftWallItems[pseudoRandomIndex];
});

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("vader_token"));
    setUsername(localStorage.getItem("vader_username") || "");
    
    // Lock scrolling until components are fully mounted and ready
    document.body.style.overflow = 'hidden';
    
    const readyTimer = setTimeout(() => {
      setAppReady(true);
      document.body.style.overflow = 'auto';
      // Refresh ScrollTrigger after unlocking scroll to fix footer position
      if (typeof window !== "undefined") {
        setTimeout(() => ScrollTrigger.refresh(), 100);
      }
    }, 1500); // Allow 1.5s for heavy canvases to initialize

    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("vader_token"));
      setUsername(localStorage.getItem("vader_username") || "");
    };
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("vader_auth_change", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("vader_auth_change", handleStorageChange);
      clearTimeout(readyTimer);
      document.body.style.overflow = 'auto';
    };
  }, []);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    if (!containerRef.current) return;
    
    // Animate Hero content
    gsap.fromTo(".hero-content > p", 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.15, duration: 1, ease: "power3.out", delay: 0.4 }
    );

    // Animate entry text specifically
    gsap.fromTo(".hero-title-text",
      { y: "100%", opacity: 0, rotationX: 45 },
      { y: "0%", opacity: 1, rotationX: 0, duration: 1.2, ease: "back.out(1.2)", delay: 0.2 }
    );

    if (!isLoggedIn) {
      // Animate DriftWall entrance
      gsap.fromTo(".driftwall-section",
        { opacity: 0, scale: 0.95 },
        { 
          opacity: 1, 
          scale: 1, 
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".driftwall-section",
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );



      // Animate DriftWall title
      gsap.fromTo(".driftwall-title",
        { opacity: 0, scale: 0.8, y: 40 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.2,
          delay: 0.5,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: ".driftwall-section",
            start: "top 70%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Animate FeaturesBeam (Always runs because section is no longer conditional)
    gsap.fromTo(".features-beam-section",
      { opacity: 0, y: 50 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".features-beam-section",
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Animate FlowingMenu title
    gsap.fromTo(".flowing-menu-title",
      { y: 50, opacity: 0 },
      { 
        y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
        scrollTrigger: {
          trigger: ".flowing-menu-section",
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );


    // Animate Featured Cards
    gsap.fromTo(".feature-card",
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1, stagger: 0.15, duration: 0.8, ease: "power3.out",
        scrollTrigger: {
          trigger: ".featured-sections",
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );
    // Animate VaderBento only when it's rendered
    if (isLoggedIn) {
      gsap.fromTo(".vader-bento-section",
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".vader-bento-section",
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

      gsap.fromTo(".bento-card-item",
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, stagger: 0.15, duration: 0.8, ease: "power3.out",
          scrollTrigger: {
            trigger: ".vader-bento-grid",
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  }, { scope: containerRef, dependencies: [isLoggedIn] });

  return (
    <div ref={containerRef} className="flex flex-col flex-1 bg-gradient-to-b from-black via-red-950/30 to-black">
      
      {/* Container for Hero and FeaturesBeam with shared MoltenMetal Background */}
      <div className="relative w-full">
        <div className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
          <MoltenMetal 
            color1="#ff5858" 
            color2="#ee0000"
            color3="#ffffff"
            colorMode="ember"
            speed={0.55}
            scale={5.7}
            detail={3}
            glow={1.6}
            coreSize={0.19}
            swirl={1}
            fold={-0.2}
            brightness={1.8}
            opacity={1}
            blackPoint={0.18}
            grain={true}
            grainIntensity={0.05}
            mouseInteraction={true}
            mouseStrength={0.7}
          />
        </div>

        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center min-h-[100vh] px-4 text-center overflow-hidden">
          <div className="hero-content relative z-10 flex flex-col items-center">
            <div className="flex flex-wrap justify-center gap-x-4 max-w-4xl text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-6 drop-shadow-xl">
              <h1 className="text-white flex items-center overflow-hidden h-[1.2em] pt-1">
                <span className="hero-title-text inline-block transform origin-bottom">
                  {isLoggedIn ? "Welcome Back," : "Welcome to"}
                </span>
              </h1>
              <TrueFocus 
                sentence={isLoggedIn ? (username || "Player") : "VADER VERSE"}
                manualMode={false}
                blurAmount={5}
                borderColor="#dc2626"
                glowColor="rgba(220, 38, 38, 0.6)"
                animationDuration={1}
                pauseBetweenAnimations={1}
              />
            </div>
            <p className="max-w-2xl text-lg md:text-xl text-zinc-300 mb-10 drop-shadow-md text-center">
              {isLoggedIn 
                ? "We really missed you, look what you missed out." 
                : "The ultimate platform for competitive gaming, personalized news, and an expansive arcade experience."}
            </p>
          </div>
        </section>

      </div> {/* End shared MoltenMetal container */}

      {isLoggedIn ? (
        <VaderBento />
      ) : (
        <section className="driftwall-section flex flex-col justify-center items-center overflow-hidden relative min-h-[100vh] w-full bg-black">
          {/* Intro Text Overlay */}
          <div className="absolute top-[35%] left-0 right-0 z-20 flex justify-center pointer-events-none">
            <div className="driftwall-title text-center px-4 w-full">
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase drop-shadow-[0_0_25px_rgba(0,0,0,0.8)] mb-4">
                Explore <span className="text-red-600 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]">Gaming Communities</span>
              </h2>
              <p className="text-zinc-300 text-lg md:text-xl font-medium drop-shadow-[0_0_10px_rgba(0,0,0,1)] max-w-2xl mx-auto">
                Discover thousands of active players, share your highlights, and join tournaments in your favorite games.
              </p>
            </div>
          </div>
          
          <div className="h-[100vh] w-full relative">
            <DriftWall 
              items={driftWallItems} 
              overlayColor="#060010"
              columns={12}
              tileWidth={400}
              tileHeight={264}
              gap={24}
              radius={14}
              tilt={16}
              turn={-14}
              roll={0}
              perspective={1200}
              depth={120}
              speed={42}
              direction="up"
              variance={0.45}
              parallax={0.6}
              lift={64}
              fade={0.6}
              dim={0.55}
              pauseOnHover={false}
              grayscale={false}
            />
          </div>
        </section>
      )}

      {/* Features Beam Section (Moved to 3rd section) */}
      <section className="features-beam-section w-full min-h-[80vh] flex flex-col justify-center py-24 overflow-hidden relative z-10 bg-black/60 backdrop-blur-sm border-t border-red-900/20">
        <div className="container mx-auto px-4 w-full max-w-7xl">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight relative z-20 drop-shadow-xl">
              The Hub of the <span className="text-red-500">Verse</span>
            </h2>
            <p className="text-zinc-300 mt-4 max-w-2xl mx-auto text-xl drop-shadow-md">
              Everything you need connected in one central ecosystem.
            </p>
          </div>
          <FeaturesBeam />
        </div>
      </section>



      {/* Flowing Menu Section */}
      <section className="flowing-menu-section w-full py-24 overflow-hidden relative">
        <h2 className="flowing-menu-title text-4xl md:text-5xl font-extrabold text-center text-white mb-16 tracking-tight relative z-20">
          Explore the <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">Verse</span>
        </h2>
        <div className="h-[400px] relative z-20">
          <FlowingMenu 
            items={flowingMenuItems} 
            bgColor="transparent" 
            textColor="#ef4444" 
            borderColor="rgba(239, 68, 68, 0.2)"
            marqueeBgColor="#ef4444"
            marqueeTextColor="#000000"
          />
        </div>
      </section>


      {/* Featured Sections */}
      <section className="featured-sections container mx-auto px-4 py-24 grid md:grid-cols-3 gap-8 relative z-20">
        <BorderGlow
          className="feature-card h-full"
          backgroundColor="#0a0a0a"
          glowColor="0 100% 50%"
          colors={['#ef4444', '#b91c1c', '#dc2626']}
          borderRadius={24}
          animated={true}
        >
          <div className="p-8 flex flex-col items-start h-full">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600/30 to-zinc-950 flex items-center justify-center border border-red-500/40 mb-6 shadow-[0_0_30px_rgba(220,38,38,0.2)] transition-transform duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_0_40px_rgba(220,38,38,0.4)]">
              <Gamepad2 className="w-8 h-8 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)] group-hover:scale-110 group-hover:text-red-400 transition-all duration-500" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white tracking-tight">Arcade</h3>
            <p className="text-zinc-400 mb-8 flex-1 leading-relaxed">Discover new games tailored to your tastes. We track what you play to recommend your next obsession.</p>
            <Link href="/arcade" className="mt-auto group inline-flex items-center gap-2 text-sm font-bold text-white bg-red-600 hover:bg-red-500 px-5 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)]">
              Play Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </BorderGlow>

        <BorderGlow
          className="feature-card h-full"
          backgroundColor="#0a0a0a"
          glowColor="0 100% 50%"
          colors={['#ef4444', '#b91c1c', '#dc2626']}
          borderRadius={24}
          animated={true}
        >
          <div className="p-8 flex flex-col items-start h-full">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600/30 to-zinc-950 flex items-center justify-center border border-red-500/40 mb-6 shadow-[0_0_30px_rgba(220,38,38,0.2)] transition-transform duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_0_40px_rgba(220,38,38,0.4)]">
              <Trophy className="w-8 h-8 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)] group-hover:scale-110 group-hover:text-red-400 transition-all duration-500" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white tracking-tight">Tournaments</h3>
            <p className="text-zinc-400 mb-8 flex-1 leading-relaxed">Compete for glory and prizes. Join active brackets and let our AI Assistant keep you updated on your matches.</p>
            <Link href="/tournaments" className="mt-auto group inline-flex items-center gap-2 text-sm font-bold text-white bg-red-600 hover:bg-red-500 px-5 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)]">
              Join Brackets <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </BorderGlow>

        <BorderGlow
          className="feature-card h-full"
          backgroundColor="#0a0a0a"
          glowColor="0 100% 50%"
          colors={['#ef4444', '#b91c1c', '#dc2626']}
          borderRadius={24}
          animated={true}
        >
          <div className="p-8 flex flex-col items-start h-full">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600/30 to-zinc-950 flex items-center justify-center border border-red-500/40 mb-6 shadow-[0_0_30px_rgba(220,38,38,0.2)] transition-transform duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_0_40px_rgba(220,38,38,0.4)]">
              <Newspaper className="w-8 h-8 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)] group-hover:scale-110 group-hover:text-red-400 transition-all duration-500" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white tracking-tight">Morning Digest</h3>
            <p className="text-zinc-400 mb-8 flex-1 leading-relaxed">Get an AI-generated daily gaming news summary curated specifically for your favorite genres and tags.</p>
            <Link href="/news" className="mt-auto group inline-flex items-center gap-2 text-sm font-bold text-white bg-red-600 hover:bg-red-500 px-5 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)]">
              Read News <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </BorderGlow>
      </section>
      
      <Footer />
    </div>
  );
}
