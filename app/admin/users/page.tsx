"use client";

import { useEffect, useState } from "react";
import { Users, Shield, User as UserIcon, Mail, Calendar, Activity } from "lucide-react";
import { Iridescence } from "@/components/Backgrounds";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const token = localStorage.getItem("vader_token");
        const res = await fetch("/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setUsers(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-8 h-8 border-t-2 border-red-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <header>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Users className="text-blue-400 w-5 h-5" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white/90">User Management</h1>
        </div>
        <p className="text-white/50">Comprehensive directory of all registered Vader-Verse citizens.</p>
      </header>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-black/40 border border-white/5 backdrop-blur-md p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <h3 className="text-white/60 font-medium text-sm mb-4">Total Registered</h3>
          <p className="text-4xl font-bold text-white">{users.length}</p>
        </div>
        <div className="bg-black/40 border border-white/5 backdrop-blur-md p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <h3 className="text-white/60 font-medium text-sm mb-4">Administrators</h3>
          <p className="text-4xl font-bold text-white">{users.filter(u => u.role === "admin").length}</p>
        </div>
        <div className="bg-black/40 border border-white/5 backdrop-blur-md p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <h3 className="text-white/60 font-medium text-sm mb-4">Recent Joins (7d)</h3>
          <p className="text-4xl font-bold text-white">
            {users.filter(u => new Date(u.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-black/40 border border-white/5 backdrop-blur-md rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/70">
            <thead className="text-xs uppercase bg-white/5 border-b border-white/5 text-white/40">
              <tr>
                <th className="px-6 py-4 font-medium">Citizen</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-white/10 shrink-0">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.username} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <UserIcon className="w-4 h-4 text-white/50" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-white/90 group-hover:text-white">{user.username}</p>
                        <p className="text-xs text-white/40 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3" /> {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.role === "admin" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                        <Shield className="w-3.5 h-3.5" /> Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white/5 text-white/60 border border-white/10">
                        User
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-white/50">
                      <Calendar className="w-4 h-4" />
                      {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg transition-colors border border-blue-500/20">
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
