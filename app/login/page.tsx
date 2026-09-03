"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Gamepad2, ArrowRight, AlertCircle } from "lucide-react";
import axios from "axios";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post("/api/login", {
        email,
        password,
      });

      if (response.data.success) {
        localStorage.setItem("vader_token", response.data.data.token);
        if (response.data.data.user?.onboardingCompleted) {
          router.push("/profile");
        } else {
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
    <div className="flex-1 flex flex-col items-center justify-center py-24 px-4 relative overflow-hidden">
      {/* Background styling */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-zinc-950 to-zinc-950 -z-10" />
      
      <div className="w-full max-w-md border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 bg-red-600/10 rounded-full flex items-center justify-center mb-4 border border-red-500/20">
            <Gamepad2 className="w-6 h-6 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome Back</h1>
          <p className="text-zinc-400 text-sm">Enter your credentials to access Vader-Verse</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-950/50 border border-red-900 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 transition-colors"
              placeholder="vader@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-300" htmlFor="password">
                Password
              </label>
              <Link href="#" className="text-xs text-red-500 hover:text-red-400">
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-600 px-8 py-3 font-bold text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? "Signing in..." : "Sign in"} 
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-zinc-400">
          Don't have an account?{" "}
          <Link href="/register" className="font-bold text-white hover:text-red-400 transition-colors">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
