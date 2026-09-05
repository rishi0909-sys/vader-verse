"use client";

import { signIn } from "next-auth/react";

import { useLoader } from "@/components/loading/LoaderProvider";

export default function SocialLoginButtons() {
  const { startLoader } = useLoader();

  const handleSocialLogin = (provider: string) => {
    startLoader("/auth/success");
    // Redirect to the exchange bridge after successful OAuth
    signIn(provider, { callbackUrl: "/auth/success" });
  };

  return (
    <div className="w-full flex flex-col items-center mt-6">
      <div className="w-full flex items-center gap-3 mb-6">
        <div className="h-px bg-white/10 flex-1"></div>
        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Or continue with</span>
        <div className="h-px bg-white/10 flex-1"></div>
      </div>
      
      <div className="flex items-center justify-center gap-4">
        {/* Google */}
        <button
          onClick={() => handleSocialLogin("google")}
          type="button"
          className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:scale-105 transition-all focus:ring-2 focus:ring-red-500/50 outline-none group"
          aria-label="Sign in with Google"
        >
          <svg className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        </button>

        {/* Twitch */}
        <button
          onClick={() => handleSocialLogin("twitch")}
          type="button"
          className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:scale-105 transition-all focus:ring-2 focus:ring-red-500/50 outline-none group"
          aria-label="Sign in with Twitch"
        >
          <svg className="w-5 h-5 text-zinc-400 group-hover:text-[#9146FF] transition-colors" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.149 0l-1.612 4.119v16.836h5.731v3.045h3.224l3.045-3.045h4.657l6.269-6.269v-14.686h-21.314zm19.164 13.612l-4.119 4.119h-5.731l-3.045 3.045v-3.045h-4.836v-15.045h17.731v10.926zm-9.493-6.806h2.149v5.373h-2.149v-5.373zm4.836 0h2.149v5.373h-2.149v-5.373z"/>
          </svg>
        </button>

        {/* Apple */}
        <button
          onClick={() => handleSocialLogin("apple")}
          type="button"
          className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:scale-105 transition-all focus:ring-2 focus:ring-red-500/50 outline-none group"
          aria-label="Sign in with Apple"
        >
          <svg className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.641-.026 2.67-1.48 3.673-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.68.727-1.325 2.155-1.144 3.531 1.35.105 2.602-.505 3.431-1.519z"/>
          </svg>
        </button>

        {/* Steam */}
        <button
          onClick={() => handleSocialLogin("steam")}
          type="button"
          className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:scale-105 transition-all focus:ring-2 focus:ring-red-500/50 outline-none group"
          aria-label="Sign in with Steam"
        >
          <svg className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.979 0C5.353 0 0 5.385 0 12c0 3.04 1.148 5.8 3.023 7.893l3.417-4.886c-.035-.246-.063-.5-.063-.758 0-2.39 1.942-4.331 4.331-4.331 2.39 0 4.332 1.941 4.332 4.33 0 2.39-1.942 4.332-4.332 4.332-.705 0-1.371-.169-1.954-.468l-4.538 6.554c2.408.85 4.98.922 7.763.922 6.626 0 12-5.384 12-12C24 5.385 18.605 0 11.979 0zm-1.266 17.585a2.235 2.235 0 1 1 .003-4.47 2.235 2.235 0 0 1-.003 4.47zm8.441-6.19l-4.068 1.696c-.341-.531-.83-.954-1.428-1.2l3.407-3.957a.383.383 0 0 1 .527-.087l1.52.986c.162.105.215.32.115.485-.015.025-.043.052-.073.077z"/>
          </svg>
        </button>

        {/* X (Twitter) */}
        <button
          onClick={() => handleSocialLogin("twitter")}
          type="button"
          className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:scale-105 transition-all focus:ring-2 focus:ring-red-500/50 outline-none group"
          aria-label="Sign in with X"
        >
          <svg className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
