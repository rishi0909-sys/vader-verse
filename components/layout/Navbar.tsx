"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Gamepad2, Trophy, Newspaper, ShoppingBag, User, LogOut } from "lucide-react";

export function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if token exists on mount and on route change
    const token = localStorage.getItem("vader_token");
    setIsLoggedIn(!!token);

    // Listen for storage events in case they log in on another tab
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("vader_token"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("vader_token");
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tighter text-white">
            VADER<span className="text-red-500">VERSE</span>
          </span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-300">
          <Link href="/arcade" className="flex items-center gap-2 hover:text-white transition-colors">
            <Gamepad2 className="w-4 h-4" /> Arcade
          </Link>
          <Link href="/tournaments" className="flex items-center gap-2 hover:text-white transition-colors">
            <Trophy className="w-4 h-4" /> Tournaments
          </Link>
          <Link href="/news" className="flex items-center gap-2 hover:text-white transition-colors">
            <Newspaper className="w-4 h-4" /> News
          </Link>
          <Link href="/merch" className="flex items-center gap-2 hover:text-white transition-colors">
            <ShoppingBag className="w-4 h-4" /> Merch
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {!isLoggedIn ? (
            <>
              <Link href="/login" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
                Log in
              </Link>
              <Link 
                href="/register" 
                className="rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 transition-colors"
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-medium text-zinc-300 hover:text-red-400 transition-colors"
                title="Log out"
              >
                <LogOut className="w-5 h-5" />
              </button>
              <Link href="/profile" className="ml-2 text-zinc-400 hover:text-white transition-colors">
                <User className="w-5 h-5" />
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
