"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Gamepad2, ArrowRight, ArrowLeft, AlertCircle, Check, X } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import axios from "axios";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import CRTWarp from "@/components/CRTWarp";
import SocialLoginButtons from "@/components/SocialLoginButtons";
import BorderGlow from "@/components/BorderGlow";
import { useLoader } from "@/components/loading/LoaderProvider";

gsap.registerPlugin(useGSAP);

export default function LoginPage() {
  const router = useRouter();
  const { startLoader } = useLoader();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState<{message: string, type: 'error'|'success'} | null>(null);
  
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useGSAP(() => {
    // Entrance animation timeline
    const tl = gsap.timeline();
    
    tl.from(".glass-card", {
      y: 40,
      opacity: 0,
      rotationX: 10,
      scale: 0.95,
      duration: 1,
      ease: "power3.out",
    })
    .from(".animate-item", {
      y: 20,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out",
    }, "-=0.6");
  }, { scope: containerRef });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setToast(null);
    setIsLoading(true);

    try {
      const response = await axios.post("/api/login", {
        identifier,
        password,
      });

      if (response.data.success) {
        localStorage.setItem("vader_token", response.data.data.token);
        if (response.data.data.user?.username) {
          localStorage.setItem("vader_username", response.data.data.user.username);
        }
        window.dispatchEvent(new Event("vader_auth_change"));
        
        if (response.data.data.user?.onboardingCompleted) {
          startLoader("/");
          router.push("/");
        } else {
          startLoader("/onboarding");
          router.push("/onboarding");
        }
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "An error occurred during login."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="flex-1 flex flex-col items-center justify-center py-24 px-4 relative min-h-screen">
      {/* Background styling */}
      <div className="absolute inset-0 -z-10 bg-black">
        <div className="absolute inset-0 opacity-80 mix-blend-screen">
          <CRTWarp 
            color="#ff0000"
            backgroundColor="#110000"
          />
        </div>
      </div>
      
      <div className="absolute top-6 left-6 z-50 animate-item">
        <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
      </div>

      <BorderGlow 
        className="glass-card w-full max-w-md p-6 sm:p-8 !rounded-3xl"
        backgroundColor="#000000"
        glowColor="0 100% 50%"
        colors={['#ef4444', '#b91c1c', '#dc2626']}
        borderRadius={24}
        animated={true}
      >
        
        <div className="animate-item flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-red-600/20 to-transparent rounded-2xl flex items-center justify-center mb-4 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
            <Gamepad2 className="w-6 h-6 text-red-500" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-3 bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent">Welcome Back</h1>
          <p className="text-zinc-400 text-sm font-medium">Enter your credentials to access Vader-Verse</p>
        </div>

        {false && (
          <div className="animate-item mb-6 p-4 bg-red-950/30 border border-red-900/50 rounded-xl flex items-start gap-3 backdrop-blur-sm">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="animate-item space-y-2.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1" htmlFor="identifier">
              Username or Email
            </label>
            <input
              id="identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all placeholder:text-zinc-600"
              placeholder="DarthVader or vader@example.com"
              required
            />
          </div>

          <div className="animate-item space-y-2.5">
            <div className="flex items-center justify-between ml-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider" htmlFor="password">
                Password
              </label>
              <Link href="#" className="text-xs text-red-500 hover:text-red-400 font-medium transition-colors">
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all placeholder:text-zinc-600"
              placeholder="••••••••"
              required
            />
            {password.length > 0 && (
              <div className="flex flex-col gap-1.5 mt-2 ml-1 p-3 bg-black/20 rounded-xl border border-white/5">
                <div className="flex items-center gap-2 text-xs font-medium">
                  {password.length >= 8 ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <X className="w-3.5 h-3.5 text-zinc-600" />}
                  <span className={password.length >= 8 ? "text-emerald-500/90" : "text-zinc-500"}>At least 8 characters</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium">
                  {/[A-Z]/.test(password) && /[a-z]/.test(password) ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <X className="w-3.5 h-3.5 text-zinc-600" />}
                  <span className={/[A-Z]/.test(password) && /[a-z]/.test(password) ? "text-emerald-500/90" : "text-zinc-500"}>Upper & lowercase letters</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium">
                  {/[0-9]/.test(password) ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <X className="w-3.5 h-3.5 text-zinc-600" />}
                  <span className={/[0-9]/.test(password) ? "text-emerald-500/90" : "text-zinc-500"}>At least one number</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium">
                  {/[^A-Za-z0-9]/.test(password) ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <X className="w-3.5 h-3.5 text-zinc-600" />}
                  <span className={/[^A-Za-z0-9]/.test(password) ? "text-emerald-500/90" : "text-zinc-500"}>At least one special char</span>
                </div>
                <div className="flex gap-1 mt-2 h-1 w-full rounded-full overflow-hidden bg-white/5">
                  {[
                    password.length >= 8,
                    /[A-Z]/.test(password) && /[a-z]/.test(password),
                    /[0-9]/.test(password),
                    /[^A-Za-z0-9]/.test(password)
                  ].map((passed, i, arr) => {
                    const score = arr.filter(Boolean).length;
                    let color = "bg-zinc-700";
                    if (passed) {
                      if (score <= 2) color = "bg-red-500";
                      else if (score === 3) color = "bg-amber-500";
                      else color = "bg-emerald-500";
                    }
                    return <div key={i} className={`flex-1 transition-colors duration-300 ${passed ? color : "bg-transparent"}`} />;
                  })}
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 px-6 py-3 font-bold text-white hover:from-red-500 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6 shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]"
          >
            {isLoading ? "Signing in..." : "Sign in"} 
            {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="animate-item w-full">
          <SocialLoginButtons />
        </div>

        <div className="animate-item mt-6 text-center text-sm text-zinc-500 font-medium">
          Don't have an account?{" "}
          <Link href="/register" className="text-zinc-300 hover:text-red-400 transition-colors ml-1">
            Register here
          </Link>
        </div>
      </BorderGlow>
    </div>
  );
}
