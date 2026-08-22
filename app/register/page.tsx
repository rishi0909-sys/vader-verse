"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Gamepad2, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import axios from "axios";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const response = await axios.post("/api/register", {
        username,
        email,
        password,
      });

      if (response.data.success) {
        setSuccess("Account created successfully! Redirecting to login...");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
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
    <div className="flex-1 flex flex-col items-center justify-center py-24 px-4 relative overflow-hidden">
      {/* Background styling */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-zinc-950 to-zinc-950 -z-10" />
      
      <div className="w-full max-w-md border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 bg-red-600/10 rounded-full flex items-center justify-center mb-4 border border-red-500/20">
            <Gamepad2 className="w-6 h-6 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Join Vader-Verse</h1>
          <p className="text-zinc-400 text-sm">Create an account to start tracking games and joining tournaments.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-950/50 border border-red-900 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-950/50 border border-green-900 rounded-lg flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
            <p className="text-sm text-green-200">{success}</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 transition-colors"
              placeholder="vader_player_1"
              required
              minLength={3}
              maxLength={30}
            />
          </div>

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
            <label className="text-sm font-medium text-zinc-300" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 transition-colors"
              placeholder="••••••••"
              required
              minLength={6}
            />
            <p className="text-xs text-zinc-500 mt-1">Must be at least 6 characters.</p>
          </div>

          <button
            type="submit"
            disabled={isLoading || !!success}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-600 px-8 py-3 font-bold text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? "Creating account..." : "Create Account"} 
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-zinc-400">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-white hover:text-red-400 transition-colors">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
}
