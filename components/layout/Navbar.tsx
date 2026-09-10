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
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  const { startLoader } = useLoader();

  useEffect(() => {
    // Check if token exists on mount and on route change
    const checkAuth = () => {
      const token = localStorage.getItem("vader_token");
      setIsLoggedIn(!!token);
      
      if (token) {
        try {
          const payloadBase64 = token.split(".")[1];
          const payloadStr = atob(payloadBase64);
          const payload = JSON.parse(payloadStr);
          setIsAdmin(payload.role === "admin");
        } catch (e) {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };

    checkAuth();

    // Listen for storage events in case they log in on another tab
    window.addEventListener("storage", checkAuth);
    window.addEventListener("vader_auth_change", checkAuth);
    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("vader_auth_change", checkAuth);
    };
  }, [pathname]);

  const handleLogout = () => {
    startLoader("/");
    localStorage.removeItem("vader_token");
    localStorage.removeItem("vader_username");
    window.dispatchEvent(new Event("vader_auth_change"));
    setIsLoggedIn(false);
    setIsAdmin(false);
    router.push("/");
  };
  
  if (pathname.startsWith('/community') || pathname.startsWith('/admin')) {
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

    if (isAdmin) {
      menuItems.push({ label: 'Admin Panel', ariaLabel: 'Admin Panel', link: '/admin' });
    }

    const socialItems = [
      { label: 'X (Twitter)', link: '#' },
      { label: 'Discord', link: '#' },
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
          showLogo={true}
          isCompactLogo={pathname !== "/"}
        />
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

  // Logged out Staggered Menu (Mobile Only)
  const loggedOutMenuItems = [
    { label: 'Home', ariaLabel: 'Home', link: '/' },
    { label: 'Arcade', ariaLabel: 'Arcade', link: '/arcade' },
    { label: 'Tournaments', ariaLabel: 'Tournaments', link: '/tournaments' },
    { label: 'News', ariaLabel: 'News', link: '/news' },
    { label: 'Merch', ariaLabel: 'Merch', link: '/merch' },
    { label: 'Log In', ariaLabel: 'Log In', link: '/login' },
    { label: 'Sign Up', ariaLabel: 'Sign Up', link: '/register' }
  ];

  return (
    <>
      {/* Floating Top Left Logo or Bottom Center Home Button (Desktop Only) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className={`fixed z-50 pointer-events-auto hidden sm:block ${pathname === "/" ? "top-6 left-6" : "bottom-6 left-1/2 -translate-x-1/2"}`}
      >
        <Link href="/" className="flex items-center gap-2 group decoration-none">
          {pathname === "/" ? (
            <span className="text-2xl font-bold tracking-tighter text-white drop-shadow-md">
              VADER<span className="text-red-600 transition-colors group-hover:text-red-500">VERSE</span>
            </span>
          ) : (
            <motion.span 
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              className="text-xs font-black tracking-widest uppercase text-zinc-400 hover:text-white transition-colors bg-black/60 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)] flex items-center justify-center hover:bg-black/80 hover:scale-105"
            >
              &lt; Home
            </motion.span>
          )}
        </Link>
      </motion.div>

      {/* Floating Top Nav (Desktop Only) */}
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.8, type: "spring", stiffness: 100 }}
        className="hidden sm:block fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-max"
        style={{
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
          maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)'
        }}
      >
        <nav 
          onMouseLeave={() => setHoveredPath(null)}
          className="flex items-center gap-1 p-2 rounded-full border border-zinc-800 bg-zinc-950/80 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-x-auto no-scrollbar"
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
                  <span>{item.label}</span>
                </span>
              </Link>
            );
          })}

          <div className="w-px h-8 bg-zinc-800 mx-2" />

          {/* Auth Section */}
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
                <span>Log in</span>
              </span>
            </Link>
            <Link
              href="/register"
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-red-600 text-sm font-bold text-white hover:bg-red-500 transition-colors z-10 relative ml-1"
            >
              Sign up
            </Link>
          </div>
        </nav>
      </motion.div>

      {/* Mobile Staggered Menu (Logged Out) */}
      <div className="block sm:hidden fixed top-0 left-0 w-full z-50 pointer-events-none">
        <StaggeredMenu 
          items={loggedOutMenuItems} 
          socialItems={[]} 
          accentColor="#ef4444"
          colors={['#000000', '#0a0a0a', '#171717']}
          isFixed={true} 
          displayItemNumbering={false}
          showLogo={true}
          isCompactLogo={pathname !== "/"}
        />
      </div>
    </>
  );
}
