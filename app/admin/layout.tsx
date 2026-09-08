"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldAlert, LayoutDashboard, Flag, Swords, LogOut, Users, Gamepad2, BrainCircuit, ShoppingCart, UsersRound } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Basic frontend UX guard. The real security is on the server-side API.
    const token = localStorage.getItem("vader_token");
    if (!token) {
      router.replace("/");
      return;
    }

    try {
      // Decode JWT safely without verification on client just for UX routing
      const payloadBase64 = token.split(".")[1];
      const payloadStr = atob(payloadBase64);
      const payload = JSON.parse(payloadStr);

      if (payload.role !== "admin") {
        router.replace("/");
      } else {
        setIsAdmin(true);
      }
    } catch (e) {
      router.replace("/");
    } finally {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-t-2 border-red-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row relative overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-full md:w-[600px] h-[600px] bg-red-900/10 blur-[150px] rounded-full mix-blend-screen"></div>
        <div className="absolute bottom-0 left-0 w-full md:w-[600px] h-[600px] bg-purple-900/10 blur-[150px] rounded-full mix-blend-screen"></div>
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay"></div>
      </div>

      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 border-r border-white/5 bg-black/50 backdrop-blur-xl z-10 flex flex-col h-auto md:h-screen sticky top-0">
        <div className="p-6 flex items-center space-x-3 border-b border-white/5">
          <div className="w-10 h-10 bg-red-500/20 border border-red-500/40 rounded-xl flex items-center justify-center text-red-500">
            <ShieldAlert size={20} />
          </div>
          <div>
            <h1 className="font-bold tracking-widest text-sm text-red-50">VADER ADMIN</h1>
            <p className="text-[10px] text-red-500/60 uppercase tracking-wider">Level 4 Clearance</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link href="/admin">
            <div className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors text-white/70 hover:text-white cursor-pointer group">
              <LayoutDashboard size={18} className="group-hover:text-red-400 transition-colors" />
              <span className="font-medium text-sm tracking-wide">Overview</span>
            </div>
          </Link>
          <Link href="/admin/users">
            <div className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors text-white/70 hover:text-white cursor-pointer group">
              <Users size={18} className="group-hover:text-red-400 transition-colors" />
              <span className="font-medium text-sm tracking-wide">Users</span>
            </div>
          </Link>
          <Link href="/admin/arcade">
            <div className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors text-white/70 hover:text-white cursor-pointer group">
              <Gamepad2 size={18} className="group-hover:text-red-400 transition-colors" />
              <span className="font-medium text-sm tracking-wide">Arcade Analytics</span>
            </div>
          </Link>
          <Link href="/admin/ai">
            <div className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors text-white/70 hover:text-white cursor-pointer group">
              <BrainCircuit size={18} className="group-hover:text-red-400 transition-colors" />
              <span className="font-medium text-sm tracking-wide">AI Agent</span>
            </div>
          </Link>
          <Link href="/admin/sales">
            <div className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors text-white/70 hover:text-white cursor-pointer group">
              <ShoppingCart size={18} className="group-hover:text-red-400 transition-colors" />
              <span className="font-medium text-sm tracking-wide">Merch Sales</span>
            </div>
          </Link>
          <Link href="/admin/communities">
            <div className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors text-white/70 hover:text-white cursor-pointer group">
              <UsersRound size={18} className="group-hover:text-red-400 transition-colors" />
              <span className="font-medium text-sm tracking-wide">Communities</span>
            </div>
          </Link>
          <Link href="/admin/tournaments">
            <div className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors text-white/70 hover:text-white cursor-pointer group">
              <Swords size={18} className="group-hover:text-red-400 transition-colors" />
              <span className="font-medium text-sm tracking-wide">Tournaments</span>
            </div>
          </Link>
          <Link href="/admin/reports">
            <div className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors text-white/70 hover:text-white cursor-pointer group">
              <Flag size={18} className="group-hover:text-red-400 transition-colors" />
              <span className="font-medium text-sm tracking-wide">Reports</span>
            </div>
          </Link>
        </nav>

        <div className="p-4 border-t border-white/5">
          <Link href="/">
            <div className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-900/20 transition-colors text-red-400/70 hover:text-red-400 cursor-pointer">
              <LogOut size={18} />
              <span className="font-medium text-sm tracking-wide">Exit Admin</span>
            </div>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-screen z-10 p-6 md:p-10 relative">
        {children}
      </main>
    </div>
  );
}
