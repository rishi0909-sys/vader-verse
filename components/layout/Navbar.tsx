import Link from "next/link";
import { Gamepad2, Trophy, Newspaper, ShoppingBag, User } from "lucide-react";

export function Navbar() {
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
          <Link href="/login" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
            Log in
          </Link>
          <Link 
            href="/register" 
            className="rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 transition-colors"
          >
            Sign up
          </Link>
          <Link href="/profile" className="ml-2 text-zinc-400 hover:text-white transition-colors">
            <User className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
