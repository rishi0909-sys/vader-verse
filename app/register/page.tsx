"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Gamepad2, ArrowRight, ArrowLeft, AlertCircle, CheckCircle2, Check, X, Eye, EyeOff } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import axios from "axios";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import GhostFibers from "@/components/GhostFibers";
import SocialLoginButtons from "@/components/SocialLoginButtons";
import BorderGlow from "@/components/BorderGlow";
import { useLoader } from "@/components/loading/LoaderProvider";

gsap.registerPlugin(useGSAP);

export default function RegisterPage() {
  const router = useRouter();
  const { startLoader } = useLoader();
  const containerRef = useRef<HTMLDivElement>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'error'|'success'} | null>(null);
  
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const [emailStatus, setEmailStatus] = useState<'idle'|'checking'|'available'|'taken'>('idle');
  const [usernameStatus, setUsernameStatus] = useState<'idle'|'checking'|'available'|'taken'>('idle');

  const checkUniqueness = async (field: 'email' | 'username', value: string) => {
    if (!value || value.length < 3) return;
    if (field === 'email') setEmailStatus('checking');
    else setUsernameStatus('checking');

    try {
      const res = await fetch(`/api/auth/check?${field}=${encodeURIComponent(value)}`);
      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      const status = data.available ? 'available' : 'taken';
      
      if (field === 'email') setEmailStatus(status);
      else setUsernameStatus(status);
      
      if (!data.available) {
        setToast({ message: `That ${field} is already in use`, type: 'error' });
      }
    } catch {
      if (field === 'email') setEmailStatus('idle');
      else setUsernameStatus('idle');
    }
  };

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isPasswordValid = 
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password);

    if (!isPasswordValid) {
      setToast({ message: "Please ensure your password meets all constraints", type: 'error' });
      return;
    }

    if (emailStatus === 'taken' || usernameStatus === 'taken') {
      setToast({ message: "Please resolve the errors before continuing", type: 'error' });
      return;
    }
    setToast(null);
    setSuccess("");
    setIsLoading(true);

    try {
      const response = await axios.post("/api/register", {
        username,
        email,
        password,
      });

      if (response.data.success) {
        setToast({message: "Account created successfully! Redirecting...", type: "success"});
        localStorage.setItem("vader_token", response.data.data.token);
        if (response.data.data.user?.username) {
          localStorage.setItem("vader_username", response.data.data.user.username);
        }
        window.dispatchEvent(new Event("vader_auth_change"));
        
        setTimeout(() => {
          if (response.data.data.user?.onboardingCompleted) {
            startLoader("/");
            window.location.href = "/";
          } else {
            startLoader("/onboarding");
            window.location.href = "/onboarding";
          }
        }, 1500);
      }
    } catch (err: any) {
      if (err.response?.data?.errors) {
        // Zod validation errors
        setError("Please check your inputs and try again.");
      } else {
        setError(
          err.response?.data?.message || "An error occurred during registration."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="flex-1 flex flex-col items-center justify-center py-24 px-4 relative min-h-screen">
      {/* Background styling */}
      <div className="absolute inset-0 -z-10 bg-black">
        <div className="absolute inset-0 opacity-80 mix-blend-screen">
          <GhostFibers 
            lineColor="#ff3333"
            glowColor="#990000"
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
        className="glass-card w-full max-w-md p-5 sm:p-8 !rounded-3xl mt-6 sm:mt-8 mb-6 sm:mb-8"
        backgroundColor="#000000"
        glowColor="0 100% 50%"
        colors={['#ef4444', '#b91c1c', '#dc2626']}
        borderRadius={24}
        animated={true}
      >
        
        <div className="animate-item flex flex-col items-center text-center mb-4 sm:mb-6">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-600/20 to-transparent rounded-2xl flex items-center justify-center mb-3 sm:mb-4 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
            <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2 sm:mb-3 bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent">Join Vader-Verse</h1>
          <p className="text-zinc-400 text-sm font-medium">Create an account to start tracking games and joining tournaments.</p>
        </div>

        {error && (
          <div className="animate-item mb-6 p-4 bg-red-950/30 border border-red-900/50 rounded-xl flex items-start gap-3 backdrop-blur-sm">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        {success && (
          <div className="animate-item mb-6 p-4 bg-green-950/30 border border-green-900/50 rounded-xl flex items-start gap-3 backdrop-blur-sm">
            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
            <p className="text-sm text-green-200">{success}</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-3 sm:space-y-4">
          <div className="animate-item space-y-2.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => {setUsername(e.target.value); setUsernameStatus('idle');}}
              onBlur={(e) => checkUniqueness('username', e.target.value)}
              className={`w-full bg-black/40 border rounded-2xl px-4 sm:px-5 py-3 sm:py-4 text-sm focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all placeholder:text-zinc-600 ${usernameStatus === 'taken' ? 'border-red-500' : usernameStatus === 'available' ? 'border-emerald-500' : 'border-white/5'}`}
              placeholder="DarthVader"
              required
              minLength={3}
              maxLength={30}
            />
            {usernameStatus === 'taken' && <p className="text-xs text-red-500 ml-1 mt-1">Username is taken</p>}
            {usernameStatus === 'available' && <p className="text-xs text-emerald-500 ml-1 mt-1">Username is available</p>}
          </div>

          <div className="animate-item space-y-2.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {setEmail(e.target.value); setEmailStatus('idle');}}
              onBlur={(e) => checkUniqueness('email', e.target.value)}
              className={`w-full bg-black/40 border rounded-2xl px-4 sm:px-5 py-3 sm:py-4 text-sm focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all placeholder:text-zinc-600 ${emailStatus === 'taken' ? 'border-red-500' : emailStatus === 'available' ? 'border-emerald-500' : 'border-white/5'}`}
              placeholder="vader@example.com"
              required
            />
            {emailStatus === 'taken' && <p className="text-xs text-red-500 ml-1 mt-1">Email is already in use</p>}
            {emailStatus === 'available' && <p className="text-xs text-emerald-500 ml-1 mt-1">Email is available</p>}
          </div>

          <div className="animate-item space-y-2.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 sm:px-5 py-3 sm:py-4 pr-12 sm:pr-14 text-sm focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all placeholder:text-zinc-600"
                placeholder="••••••••"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-4 flex items-center justify-center text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
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
            disabled={isLoading || !!success}
            className="group w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 px-4 sm:px-6 py-3 sm:py-4 font-bold text-white hover:from-red-500 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4 sm:mt-6 shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]"
          >
            {isLoading ? "Creating account..." : "Create Account"} 
            {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="animate-item w-full">
          <SocialLoginButtons />
        </div>

        <div className="animate-item mt-4 sm:mt-6 text-center text-sm text-zinc-500 font-medium">
          Already have an account?{" "}
          <Link href="/login" className="text-zinc-300 hover:text-red-400 transition-colors ml-1">
            Log in here
          </Link>
        </div>
      </BorderGlow>
    </div>
  );
}
