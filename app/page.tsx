import Link from "next/link";
import { ArrowRight, Trophy, Gamepad2, Newspaper } from "lucide-react";
import MoltenMetal from "@/components/MoltenMetal";
import TextLoop from "@/components/TextLoop";
import DriftWall from "@/components/DriftWall";
import FlowingMenu from "@/components/FlowingMenu";

const flowingMenuItems = [
  { link: '/arcade', text: 'Arcade Games', image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=600&auto=format&fit=crop' },
  { link: '/tournaments', text: 'Pro Tournaments', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop' },
  { link: '/news', text: 'Daily Digest', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop' },
  { link: '/merch', text: 'Exclusive Merch', image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=600&auto=format&fit=crop' },
];

// Generate 200 completely unique images so the wall feels truly infinite and non-repeating
const driftWallItems = Array.from({ length: 200 }, (_, i) => ({
  image: `https://picsum.photos/seed/vader${i}/400/264`,
  title: `Game ${i + 1}`,
}));

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-gradient-to-b from-black via-red-950/30 to-black">
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

      {/* Catchy Text Loop Section */}
      <section className="py-32 flex justify-center items-center overflow-hidden relative">
        {/* Vaguely present molten metal background shade */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-red-600/15 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="h-[600px] w-full flex items-center justify-center relative">
          <TextLoop 
            text="Play. Explore. Belong. " 
            shape="wave" 
            color="#000000"
            ribbon={true}
            ribbonColor="#ff5858"
            fontSize={72}
            pauseOnHover={false}
          />
        </div>
      </section>

      {/* DriftWall Section */}
      <section className="flex justify-center items-center overflow-hidden relative">
        <div className="h-[100vh] w-full relative">
          <DriftWall 
            items={driftWallItems} 
            overlayColor="#060010"
            columns={6}
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

      {/* Flowing Menu Section */}
      <section className="w-full py-24 overflow-hidden relative">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-white mb-16 tracking-tight relative z-20">
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
