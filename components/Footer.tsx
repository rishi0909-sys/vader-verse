"use client";

import Link from "next/link";
import { Gamepad2, Mail, MapPin } from "lucide-react";
import { FaGithub, FaYoutube, FaDiscord, FaTwitch, FaXTwitter } from "react-icons/fa6";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    if (footerRef.current) {
      gsap.fromTo(".footer-stagger", 
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          stagger: 0.1, 
          duration: 0.8, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  }, { scope: footerRef });

  return (
    <footer ref={footerRef} className="w-full bg-[#0a0a0f] border-t border-zinc-800/50 pt-20 pb-10 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-red-600/10 blur-[100px] pointer-events-none rounded-full" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="footer-stagger flex flex-col items-start md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6 group">
              <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center group-hover:bg-red-500 transition-colors shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                VADER<span className="text-red-500">VERSE</span>
              </span>
            </Link>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              The ultimate platform for competitive gaming, personalized news, and an expansive arcade experience. Forged for the elite.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-red-500 hover:bg-zinc-800 transition-all">
                <FaXTwitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-red-500 hover:bg-zinc-800 transition-all">
                <FaDiscord className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-red-500 hover:bg-zinc-800 transition-all">
                <FaYoutube className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-red-500 hover:bg-zinc-800 transition-all">
                <FaGithub className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-red-500 hover:bg-zinc-800 transition-all">
                <FaTwitch className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-stagger md:ml-auto">
            <h4 className="text-white font-bold mb-6 tracking-wide text-sm uppercase">Explore</h4>
            <ul className="space-y-4">
              <li><Link href="/arcade" className="text-zinc-400 hover:text-red-400 transition-colors text-sm">Arcade</Link></li>
              <li><Link href="/tournaments" className="text-zinc-400 hover:text-red-400 transition-colors text-sm">Tournaments</Link></li>
              <li><Link href="/news" className="text-zinc-400 hover:text-red-400 transition-colors text-sm">Daily News</Link></li>
              <li><Link href="/merch" className="text-zinc-400 hover:text-red-400 transition-colors text-sm">Merchandise</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-stagger md:ml-auto">
            <h4 className="text-white font-bold mb-6 tracking-wide text-sm uppercase">Support</h4>
            <ul className="space-y-4">
              <li><Link href="/faq" className="text-zinc-400 hover:text-red-400 transition-colors text-sm">FAQ</Link></li>
              <li><Link href="/rules" className="text-zinc-400 hover:text-red-400 transition-colors text-sm">Tournament Rules</Link></li>
              <li><Link href="/contact" className="text-zinc-400 hover:text-red-400 transition-colors text-sm">Contact Us</Link></li>
              <li><Link href="/status" className="text-zinc-400 hover:text-red-400 transition-colors text-sm">System Status</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-stagger md:ml-auto">
            <h4 className="text-white font-bold mb-6 tracking-wide text-sm uppercase">Connect</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-zinc-400 text-sm">
                <Mail className="w-4 h-4 text-red-500" /> support@vaderverse.com
              </li>
              <li className="flex items-center gap-3 text-zinc-400 text-sm">
                <MapPin className="w-4 h-4 text-red-500" /> New York, NY
              </li>
            </ul>
          </div>
          
        </div>

        {/* Bottom Bar */}
        <div className="footer-stagger pt-8 border-t border-zinc-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-500 text-xs">
            &copy; {new Date().getFullYear()} Vader-Verse. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-zinc-500 hover:text-white transition-colors text-xs">Privacy Policy</Link>
            <Link href="/terms" className="text-zinc-500 hover:text-white transition-colors text-xs">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
