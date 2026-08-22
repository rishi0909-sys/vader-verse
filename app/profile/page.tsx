import { User, Shield, Gamepad2 } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden mb-8">
        <div className="h-32 bg-gradient-to-r from-red-900 to-black" />
        <div className="px-8 pb-8 relative">
          <div className="w-24 h-24 rounded-full bg-zinc-800 border-4 border-zinc-900 -mt-12 mb-4 flex items-center justify-center">
            <User className="w-12 h-12 text-zinc-500" />
          </div>
          <h1 className="text-3xl font-bold mb-1">Vader User</h1>
          <p className="text-zinc-400 mb-4">user@vaderverse.com</p>
          <div className="flex gap-2">
            <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 bg-red-900/30 text-red-500 rounded-full">
              <Shield className="w-3 h-3" /> Admin
            </span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-red-500" /> Favorite Genres
          </h2>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-zinc-800 rounded-full text-sm">RPG</span>
            <span className="px-3 py-1 bg-zinc-800 rounded-full text-sm">Action</span>
            <span className="px-3 py-1 bg-zinc-800 rounded-full text-sm">Strategy</span>
          </div>
        </section>

        <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Tournament History</h2>
          <p className="text-sm text-zinc-400 italic">No tournament history yet.</p>
        </section>
      </div>
    </div>
  );
}
