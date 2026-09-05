"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import axios from "axios";
import { Gamepad2, Loader2 } from "lucide-react";
import CRTWarp from "@/components/CRTWarp"; // Just a nice background for the loading state

export default function AuthSuccessPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const exchangeToken = async () => {
      try {
        // Exchange the temporary NextAuth session for the canonical vader_token
        const response = await axios.get("/api/auth/exchange");
        
        if (response.data.success && isMounted) {
          const { token, user } = response.data.data;
          
          // Save standard token
          localStorage.setItem("vader_token", token);
          
          // Destroy the NextAuth session so it doesn't linger in the browser
          await signOut({ redirect: false });
          
          // Redirect to appropriate flow based on existing backend logic
          if (user.onboardingCompleted) {
            router.replace("/profile");
          } else {
            router.replace("/onboarding");
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.response?.data?.message || "Failed to finalize authentication.");
          setTimeout(() => router.replace("/login?error=ExchangeFailed"), 3000);
        }
      }
    };

    exchangeToken();

    return () => {
      isMounted = false;
    };
  }, [router]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-24 px-4 relative min-h-screen">
      <div className="absolute inset-0 -z-10 bg-black">
        <div className="absolute inset-0 opacity-80 mix-blend-screen">
          <CRTWarp />
        </div>
      </div>
      
      <div className="w-full max-w-sm border border-white/5 bg-black/40 backdrop-blur-xl p-10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col items-center text-center">
        {error ? (
          <>
            <div className="w-14 h-14 bg-red-950/30 rounded-2xl flex items-center justify-center mb-6 border border-red-900/50">
              <span className="text-red-500 font-bold text-xl">X</span>
            </div>
            <h2 className="text-xl font-bold text-red-400 mb-2">Auth Failed</h2>
            <p className="text-zinc-400 text-sm">{error}</p>
          </>
        ) : (
          <>
            <div className="w-14 h-14 bg-gradient-to-br from-red-600/20 to-transparent rounded-2xl flex items-center justify-center mb-6 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
              <Gamepad2 className="w-7 h-7 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-white tracking-tight">Authenticating...</h2>
            <div className="flex items-center gap-3 text-zinc-400 mt-2">
              <Loader2 className="w-4 h-4 animate-spin text-red-500" />
              <span className="text-sm font-medium">Securing connection to Vader-Verse</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
