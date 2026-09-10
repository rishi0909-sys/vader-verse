import { Trophy, History, Shield, Calendar, LogOut, Swords } from "lucide-react";
import Link from "next/link";
import { Silk } from '@/components/Backgrounds';
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import Tournament from "@/models/Tournament";
import "@/models/Game";
import dbConnect from "@/lib/mongodb";
import Image from "next/image";
import { AvatarUpload } from "@/components/profile/AvatarUpload";

async function getProfileData() {
  const cookieStore = await cookies();
  const token = cookieStore.get("vader_token")?.value;
  
  if (!token) {
    // DEV OVERRIDE: Automatically load admin profile if no token is found in development
    if (process.env.NODE_ENV !== "production") {
      await dbConnect();
      const user = await User.findOne({ role: "admin" }).lean();
      if (user) {
        const myTournaments = await Tournament.find({ createdBy: user._id })
          .populate("game")
          .sort({ startDate: -1 })
          .lean();
        return { user, myTournaments };
      }
    }
    return null;
  }

  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) return null;
    const decoded = jwt.verify(token, jwtSecret, { algorithms: ["HS256"] }) as { userId: string };
    
    await dbConnect();
    const user = await User.findById(decoded.userId).lean();
    if (!user) return null;

    const myTournaments = await Tournament.find({ createdBy: user._id })
      .populate("game")
      .sort({ startDate: -1 })
      .lean();

    return { user, myTournaments };
  } catch (err) {
    return null;
  }
}

export default async function ProfilePage() {
  const data = await getProfileData();
  
  if (!data) {
    // Basic fallback if unauthenticated, though typically we'd redirect to /auth
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white text-center">
        <div>
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-white/50 mb-8">You must be logged in to view your profile.</p>
          <Link href="/login" className="bg-purple-600 px-8 py-3 rounded-full font-bold">Login to Vader-Verse</Link>
        </div>
      </main>
    );
  }

  const { user, myTournaments } = data;

  return (
    <main className="relative w-full min-h-[100dvh]">
      {/* Background Layer z-0 */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Silk color="#ee0000" speed={0.5} scale={1} noiseIntensity={1.5} rotation={0} />
      </div>
      
      {/* Contrast/Readability Layer z-1 */}
      <div className="fixed inset-0 pointer-events-none z-1 bg-gradient-to-b from-transparent via-black/40 to-black/80" />
      
      {/* Content z-10 */}
      <div className="relative z-10 container mx-auto px-4 pt-32 pb-24 min-h-[100dvh] flex flex-col gap-8 md:gap-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Header Section */}
        <section className="bg-black/60 border border-purple-500/20 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 backdrop-blur-md relative overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.1)]">
          <div className="absolute top-0 right-0 p-32 bg-purple-600/10 blur-[100px] rounded-full" />
          
            <AvatarUpload 
              user={{
                username: user.username,
                avatar: user.avatar,
                role: user.role
              }}
            />

          <div className="flex-1 text-center md:text-left z-10">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">{user.username}</h1>
            <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-white/70 tracking-widest uppercase">
                {user.email}
              </span>
              <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-xs font-bold text-purple-400 tracking-widest uppercase shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                {user.role === "admin" ? "Overlord" : "Gladiator"}
              </span>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-6 border-t border-white/10">
              <div className="bg-black/40 border border-white/5 rounded-xl px-6 py-4 text-center">
                <div className="text-3xl font-black text-white">{myTournaments.length}</div>
                <div className="text-xs uppercase tracking-widest text-white/40 font-bold mt-1">Tournaments Hosted</div>
              </div>
              <div className="bg-black/40 border border-white/5 rounded-xl px-6 py-4 text-center">
                <div className="text-3xl font-black text-emerald-400">0</div>
                <div className="text-xs uppercase tracking-widest text-white/40 font-bold mt-1">Matches Won</div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trophy Cabinet */}
          <section className="lg:col-span-1 bg-black/60 border border-yellow-500/20 rounded-3xl p-8 flex flex-col gap-6 backdrop-blur-md shadow-[0_0_30px_rgba(234,179,8,0.05)]">
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-bold text-white">Trophy Cabinet</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square bg-yellow-500/5 border border-yellow-500/20 rounded-2xl flex flex-col items-center justify-center gap-3 p-4 text-center group cursor-pointer hover:bg-yellow-500/10 transition-colors">
                <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 group-hover:scale-110 transition-transform">
                  <Swords className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-yellow-500/80">First Blood</span>
              </div>
              <div className="aspect-square bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3 p-4 text-center opacity-50 grayscale">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                  <Trophy className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-white/40">Champion</span>
              </div>
              {/* Locked Trophies */}
              <div className="aspect-square bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center opacity-30">
                <Shield className="w-8 h-8 text-white/20" />
              </div>
              <div className="aspect-square bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center opacity-30">
                <Trophy className="w-8 h-8 text-white/20" />
              </div>
            </div>
          </section>

          {/* Tournament History */}
          <section className="lg:col-span-2 bg-black/60 border border-white/10 rounded-3xl p-8 flex flex-col gap-6 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <History className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">Hosted Tournaments</h2>
            </div>

            <div className="flex flex-col gap-4">
              {myTournaments.length === 0 ? (
                <div className="text-center py-12 border border-white/5 rounded-2xl bg-white/5">
                  <p className="text-white/50 mb-4">You haven't hosted any tournaments yet.</p>
                  <Link href="/tournaments" className="text-purple-400 font-bold hover:text-purple-300">Head to the Arena</Link>
                </div>
              ) : (
                myTournaments.map((t: any) => (
                  <div key={t._id.toString()} className="bg-black/40 border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-6 hover:bg-white/5 transition-colors group">
                    <div className="w-full sm:w-32 h-20 bg-white/5 rounded-xl overflow-hidden relative shrink-0">
                      <Image 
                        src={(t.game as any)?.coverImage || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop'}
                        alt={t.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="128px"
                      />
                    </div>
                    <div className="flex-1 w-full text-center sm:text-left">
                      <h3 className="font-bold text-lg text-white mb-1 line-clamp-1">{t.title}</h3>
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-semibold text-white/50">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(t.startDate).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1">Status: {t.status}</span>
                      </div>
                    </div>
                    <div className="w-full sm:w-auto shrink-0 flex justify-center">
                      <Link href={`/tournaments`} className="px-4 py-2 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-lg text-sm font-bold hover:bg-purple-500 hover:text-white transition-colors">
                        View Details
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
