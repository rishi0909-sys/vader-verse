"use client";

import { ReactNode, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLoader } from "@/components/loading/LoaderProvider";

type BentoGridProps = {
  children: ReactNode;
  className?: string;
};

export const BentoGrid = ({ children, className }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[26rem] grid-cols-1 md:grid-cols-3 gap-4",
        className
      )}
    >
      {children}
    </div>
  );
};

export type BentoCardProps = {
  name: string;
  className?: string;
  background: ReactNode;
  Icon: React.ElementType;
  description: string;
  href: string;
  cta: string;
  onClick?: (e: React.MouseEvent) => void;
};

export const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  onClick,
}: BentoCardProps) => {
  const { startLoader } = useLoader();
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (onClick) {
          onClick(e as any);
        } else {
          startLoader(href);
          router.push(href);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isHovered, href, onClick, startLoader, router]);

  return (
    <div
      key={name}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        if (onClick) {
          onClick(e as any);
        } else {
          startLoader(href);
          router.push(href);
        }
      }}
      className={cn(
        "group relative col-span-3 flex flex-col justify-end overflow-hidden rounded-3xl cursor-pointer",
        // Premium Vader-Verse cinematic aesthetic
        "bg-zinc-950/40 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]",
        "shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]", // Inner highlight
        "transform-gpu transition-all duration-700 hover:shadow-[0_16px_64px_rgba(220,38,38,0.2)]",
        className
      )}
    >
      {/* Background container */}
      <div className="absolute inset-0 z-0 transition-transform duration-700 group-hover:scale-105">
        {background}
      </div>
      
      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 z-0 opacity-20 mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

      {/* Dark overlay for readability with premium gradient */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none transition-opacity duration-700 group-hover:from-black/90 group-hover:via-black/40 group-hover:to-black/10" />

      {/* Hover glow effect (Vader Red) */}
      <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none bg-[radial-gradient(circle_at_50%_100%,rgba(220,38,38,0.2),transparent_70%)] mix-blend-screen" />

      {/* Content wrapper - positioned at bottom */}
      <div className="pointer-events-none relative z-20 flex transform-gpu flex-col gap-5 p-8 md:p-10 transition-transform duration-700 ease-out group-hover:-translate-y-16">
        
        {/* Header (Icon + Name) */}
        <div className="flex items-center gap-5 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_8px_20px_rgba(0,0,0,0.6)] transition-all duration-700 group-hover:bg-red-600/30 group-hover:border-red-500/50 group-hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_0_30px_rgba(220,38,38,0.4)] group-hover:-translate-y-1">
            <Icon className="w-6 h-6 text-white transition-all duration-700 group-hover:text-red-100 group-hover:scale-110" />
          </div>
          <h3 className="text-3xl font-black text-white tracking-widest uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] transition-all duration-700 group-hover:text-red-50">
            {name}
          </h3>
        </div>

        {/* Description */}
        <p className="text-base text-zinc-300 max-w-md leading-loose tracking-wide transition-all duration-700 group-hover:text-white font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
          {description}
        </p>
      </div>

      {/* CTA Button / Link */}
      <div className="absolute bottom-0 left-0 w-full p-8 md:p-10 z-30 flex translate-y-12 transform-gpu items-center opacity-0 transition-all duration-700 ease-out group-hover:translate-y-0 group-hover:opacity-100 pointer-events-none">
        <span 
          className="inline-flex items-center gap-2 text-sm font-bold text-white bg-red-600/90 px-5 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(239,68,68,0.2)] group-hover:bg-red-500 group-hover:shadow-[0_0_25px_rgba(239,68,68,0.4)]"
        >
          {cta} <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </div>
  );
};
