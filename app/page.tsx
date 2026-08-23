import Link from "next/link";
import { ArrowRight, Trophy, Gamepad2, Newspaper } from "lucide-react";
import MoltenMetal from "@/components/MoltenMetal";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[100vh] px-4 text-center overflow-hidden">
        {/* MoltenMetal Background */}
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
        
        <h1 className="max-w-4xl text-5xl md:text-7xl font-extrabold tracking-tight mb-6 relative z-10 drop-shadow-xl" style={{ zIndex: 10 }}>
          Welcome to <span className="text-red-600 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">Vader-Verse</span>
        </h1>
        <p className="max-w-2xl text-lg md:text-xl text-zinc-300 mb-10 relative z-10 drop-shadow-md">
          The ultimate platform for competitive gaming, personalized news, and an expansive arcade experience.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 relative z-10">
          <Link href="/arcade" className="flex items-center justify-center gap-2 rounded-full bg-red-600 px-8 py-3 font-bold text-white hover:bg-red-700 transition-colors">
            <Gamepad2 className="w-5 h-5" /> Explore Arcade
          </Link>
          <Link href="/tournaments" className="flex items-center justify-center gap-2 rounded-full bg-zinc-800/80 backdrop-blur-md px-8 py-3 font-bold text-white hover:bg-zinc-700 transition-colors">
            <Trophy className="w-5 h-5" /> View Tournaments
          </Link>
        </div>
      </section>

      {/* Featured Sections */}
      <section className="container mx-auto px-4 py-16 grid md:grid-cols-3 gap-8">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 flex flex-col items-start">
          <Gamepad2 className="w-10 h-10 text-red-500 mb-4" />
          <h3 className="text-xl font-bold mb-2">Arcade</h3>
          <p className="text-zinc-400 mb-6 flex-1">Discover new games tailored to your tastes. We track what you play to recommend your next obsession.</p>
          <Link href="/arcade" className="flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-400">
            Play Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 flex flex-col items-start">
          <Trophy className="w-10 h-10 text-red-500 mb-4" />
          <h3 className="text-xl font-bold mb-2">Tournaments</h3>
          <p className="text-zinc-400 mb-6 flex-1">Compete for glory and prizes. Join active brackets and let our AI Assistant keep you updated on your matches.</p>
          <Link href="/tournaments" className="flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-400">
            Join Brackets <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 flex flex-col items-start">
          <Newspaper className="w-10 h-10 text-red-500 mb-4" />
          <h3 className="text-xl font-bold mb-2">Morning Digest</h3>
          <p className="text-zinc-400 mb-6 flex-1">Get an AI-generated daily gaming news summary curated specifically for your favorite genres and tags.</p>
          <Link href="/news" className="flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-400">
            Read News <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
