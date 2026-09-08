"use client";

import { useEffect, useState } from "react";
import { User as UserIcon, Calendar, MessageSquareWarning, ShieldCheck, XCircle } from "lucide-react";

export default function AdminReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
    try {
      const token = localStorage.getItem("vader_token");
      const res = await fetch("/api/admin/reports?status=pending", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const json = await res.json();
        setReports(json.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(reportId: string, status: "reviewed" | "dismissed" | "action_taken") {
    setProcessingId(reportId);
    try {
      const token = localStorage.getItem("vader_token");
      const res = await fetch("/api/admin/reports", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ reportId, status })
      });
      if (res.ok) {
        // Remove from pending list
        setReports(prev => prev.filter((r: any) => r._id !== reportId));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-8 h-8 border-t-2 border-red-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-white/90">User Reports</h1>
        <p className="text-white/50 mt-2">Analyze and moderate reported content and users.</p>
      </header>

      {reports.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
          <p className="text-white/50 text-lg">No pending reports.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {reports.map((r: any) => (
            <div key={r._id} className="bg-black/40 border border-white/5 backdrop-blur-md p-6 rounded-2xl flex flex-col gap-6 hover:border-white/10 transition-colors">
              
              {/* Header Info */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
                    <MessageSquareWarning size={16} />
                  </div>
                  <div>
                    <span className="text-white font-medium text-sm">Report from: </span>
                    <span className="text-white/70 text-sm">{r.reporter?.username || "Unknown"}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg text-white/50 text-xs">
                  <Calendar size={12} />
                  <span>{new Date(r.createdAt).toLocaleString()}</span>
                </div>
              </div>

              {/* Main Content */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-white/40 mb-2">Reason</h4>
                  <p className="text-red-400 font-medium mb-4">{r.reason}</p>
                  
                  <h4 className="text-xs uppercase tracking-wider text-white/40 mb-2">Description</h4>
                  <p className="text-white/80 text-sm whitespace-pre-wrap">{r.description}</p>
                </div>
                
                <div className="bg-white/5 rounded-xl p-4 space-y-3">
                  <h4 className="text-xs uppercase tracking-wider text-white/40 mb-2">Target Information</h4>
                  
                  {r.reportedUser && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-white/50 w-24">User:</span>
                      <span className="text-white/90 font-medium">{r.reportedUser.username}</span>
                    </div>
                  )}
                  {r.reportedContentType && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-white/50 w-24">Content Type:</span>
                      <span className="text-white/90 capitalize">{r.reportedContentType}</span>
                    </div>
                  )}
                  {r.reportedContentId && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-white/50 w-24">Content ID:</span>
                      <span className="text-white/60 font-mono text-xs break-all">{r.reportedContentId}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-white/5">
                <button
                  onClick={() => handleAction(r._id, "action_taken")}
                  disabled={processingId === r._id}
                  className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30 hover:border-purple-500/50 transition-all px-4 py-2 rounded-xl flex items-center gap-2 disabled:opacity-50 text-sm font-medium"
                >
                  <ShieldCheck size={16} />
                  Take Action & Resolve
                </button>
                <button
                  onClick={() => handleAction(r._id, "dismissed")}
                  disabled={processingId === r._id}
                  className="bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 hover:border-white/20 transition-all px-4 py-2 rounded-xl flex items-center gap-2 disabled:opacity-50 text-sm font-medium"
                >
                  <XCircle size={16} />
                  Dismiss Report
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
