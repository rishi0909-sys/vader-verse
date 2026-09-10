"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Edit2, Shield, Loader2 } from "lucide-react";

interface AvatarUploadProps {
  user: {
    username: string;
    avatar?: string;
    role: "user" | "admin" | "organizer";
  };
}

export function AvatarUpload({ user }: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validation
    if (file.size > 5 * 1024 * 1024) {
      setError("File must be less than 5MB");
      return;
    }
    
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError("Only JPEG, PNG, and WebP are supported");
      return;
    }

    setError(null);
    setIsUploading(true);

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      // In this app, auth is primarily via 'vader_token' localStorage string used as Bearer token for client fetch.
      // But we recently updated the login route to also set the 'vader_token' HTTP-only cookie!
      // The API route will check for both. We'll send the Authorization header just in case.
      const token = localStorage.getItem("vader_token");
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch("/api/user/avatar", {
        method: "POST",
        headers,
        body: formData, // don't set Content-Type manually, fetch sets it with boundary
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to upload avatar");
      }

      // Success
      router.refresh(); 
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      <div 
        className="group relative w-32 h-32 rounded-full border-4 border-black shadow-[0_0_30px_rgba(168,85,247,0.5)] flex items-center justify-center overflow-hidden cursor-pointer"
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        {/* Current Avatar or Fallback */}
        {user.avatar ? (
            <Image 
              src={user.avatar} 
              alt={`${user.username}'s avatar`}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <span className="text-5xl font-black text-white">{user.username.charAt(0).toUpperCase()}</span>
            </div>
          )}

        {/* Hover Overlay */}
        <div className={`absolute inset-0 rounded-full bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-2 transition-opacity duration-300 ${isUploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          {isUploading ? (
            <>
              <Loader2 className="w-6 h-6 text-white animate-spin" />
              <span className="text-xs font-bold text-white uppercase tracking-widest">Uploading</span>
            </>
          ) : (
            <>
              <Edit2 className="w-6 h-6 text-white" />
              <span className="text-[10px] font-bold text-white uppercase tracking-widest text-center px-2">Update PFP</span>
            </>
          )}
        </div>

        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/jpeg, image/png, image/webp" 
          className="hidden" 
          disabled={isUploading}
        />
      </div>

      {user.role === "admin" && (
        <div className="absolute -bottom-1 -right-1 bg-red-600 text-white p-2 rounded-full border-4 border-black z-20 pointer-events-none shadow-[0_0_15px_rgba(220,38,38,0.5)]" title="Admin">
          <Shield className="w-5 h-5" />
        </div>
      )}

      {error && (
        <div className="absolute top-full mt-4 bg-red-950/90 border border-red-500/50 text-red-200 text-xs px-3 py-2 rounded-lg whitespace-nowrap z-30 shadow-xl backdrop-blur-md">
          {error}
        </div>
      )}
    </div>
  );
}
