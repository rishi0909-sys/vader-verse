"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Gamepad2, Trophy, Newspaper, ShoppingBag, User, LogOut, Home, LogIn } from "lucide-react";
import { motion } from "framer-motion";
import dynamic from 'next/dynamic';
import { useLoader } from "@/components/loading/LoaderProvider";

const StaggeredMenu = dynamic(() => import('@/components/StaggeredMenu'), { 
  ssr: false,
  loading: () => (
    <div className="fixed top-0 left-0 w-full p-[2em] flex items-center justify-between z-50">
      <div className="text-2xl font-bold text-zinc-800 animate-pulse bg-zinc-800/50 rounded w-40 h-8" />
      <div className="w-16 h-4 bg-zinc-800/50 animate-pulse rounded" />
    </div>
  )
});

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/arcade", label: "Arcade", icon: Gamepad2 },
  { href: "/tournaments", label: "Tournaments", icon: Trophy },
  { href: "/news", label: "News", icon: Newspaper },
  { href: "/merch", label: "Merch", icon: ShoppingBag },
];

export function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  const { startLoader } = useLoader();

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
    startLoader("/");
    localStorage.removeItem("vader_token");
    localStorage.removeItem("vader_username");
    setIsLoggedIn(false);
    router.push("/");
  };
  
  if (pathname.startsWith('/community')) {
    return null;
  }

  if (isLoggedIn) {
    const menuItems = [
      { label: 'Home', ariaLabel: 'Home', link: '/' },
      { label: 'Arcade', ariaLabel: 'Arcade', link: '/arcade' },
      { label: 'Tournaments', ariaLabel: 'Tournaments', link: '/tournaments' },
      { label: 'News', ariaLabel: 'News', link: '/news' },
      { label: 'Merch', ariaLabel: 'Merch', link: '/merch' },
      { label: 'Profile', ariaLabel: 'Profile', link: '/profile' }
    ];

    const socialItems = [
      { label: 'X (Twitter)', link: '#' },
      { label: 'Discord', link: '#' },
      { label: 'Log out', link: '#' }
    ];

    return (
      <div className="fixed top-0 left-0 w-full z-50 pointer-events-none">
        <StaggeredMenu 
          items={menuItems} 
          socialItems={socialItems} 
          accentColor="#ef4444"
          colors={['#000000', '#0a0a0a', '#171717']}
          isFixed={true} 
          displayItemNumbering={false}
          showLogo={pathname === "/"}
        />
        {/* Invisible logout trigger area covering the bottom "Log out" social link if we want it functional,
            but for now let's just add a regular button, or handle it via a separate floating logout button.
            Actually, let's keep the floating logout button separately. */}
        <button
          onClick={handleLogout}
          className="fixed bottom-6 right-6 flex items-center justify-center p-3 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-red-400 hover:bg-red-900/20 hover:border-red-500/50 transition-all shadow-xl z-50 pointer-events-auto"
          title="Log out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Top Left Logo (Fixed) */}
      {pathname === "/" && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute top-6 left-6 z-50"
        >
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-bold tracking-tighter text-white drop-shadow-md">
              VADER<span className="text-red-600 transition-colors group-hover:text-red-500">VERSE</span>
            </span>
          </Link>
        </motion.div>
      )}

      {/* Floating Top Nav */}
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.8, type: "spring", stiffness: 100 }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50"
      >
        <nav 
          onMouseLeave={() => setHoveredPath(null)}
          className="flex items-center gap-1 p-2 rounded-full border border-zinc-800 bg-zinc-950/80 backdrop-blur-xl shadow-2xl shadow-black/50"
        >
          
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const isHovered = hoveredPath === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onMouseEnter={() => setHoveredPath(item.href)}
                className={`relative flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-colors ${
                  isActive || isHovered ? "text-white" : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {(hoveredPath === item.href || (hoveredPath === null && isActive)) && (
                  <motion.div
                    layoutId="nav-bubble"
                    className="absolute inset-0 rounded-full bg-red-600/20 border border-red-600/50"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <item.icon className="w-4 h-4" />
                  <span className="hidden sm:block">{item.label}</span>
                </span>
              </Link>
            );
          })}

          <div className="w-px h-8 bg-zinc-800 mx-2" />

          {/* Auth Section */}
          {!isLoggedIn ? (
            <div className="flex items-center gap-1">
              <Link
                href="/login"
                onMouseEnter={() => setHoveredPath("/login")}
                className={`relative flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-colors ${
                  hoveredPath === "/login" ? "text-white" : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {hoveredPath === "/login" && (
                  <motion.div
                    layoutId="nav-bubble"
                    className="absolute inset-0 rounded-full bg-red-600/20 border border-red-600/50"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:block">Log in</span>
                </span>
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-red-600 text-sm font-bold text-white hover:bg-red-500 transition-colors z-10 relative ml-1"
              >
                Sign up
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <Link
                href="/profile"
                onMouseEnter={() => setHoveredPath("/profile")}
                className={`relative flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-colors ${
                  pathname === "/profile" || hoveredPath === "/profile" ? "text-white" : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {(hoveredPath === "/profile" || (hoveredPath === null && pathname === "/profile")) && (
                  <motion.div
                    layoutId="nav-bubble"
                    className="absolute inset-0 rounded-full bg-red-600/20 border border-red-600/50"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:block">Profile</span>
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center p-2.5 ml-1 rounded-full text-zinc-400 hover:text-red-400 hover:bg-red-400/10 transition-colors relative z-10"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </nav>
      </motion.div>
    </>
  );
}
