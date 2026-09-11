"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Hash, MessageSquare, ShieldAlert, Swords, Users, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { GameCommunity, CommunityEvent } from '@/types/community';
import { generateDeterministicEvents } from '@/services/communityService';

export default function CommunityClient({ community }: { community: GameCommunity }) {
  const [activeChannelId, setActiveChannelId] = useState<string>(community.channels[0]?.id || 'general');
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("vader_token");
    setIsAuthorized(!!token);
  }, []);

  useEffect(() => {
    // We deterministically generate events for the selected channel
    // In a real app, this would fetch from an API
    const channelEvents = generateDeterministicEvents(community.slug, activeChannelId);
    setEvents(channelEvents);
  }, [activeChannelId, community.slug]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthorized) {
      setShowLoginPrompt(true);
      return;
    }
    if (!inputMessage.trim()) return;

    const newMessage: CommunityEvent = {
      id: Date.now().toString(), // User messages are client-side only for now
      type: 'message',
      channelId: activeChannelId,
      timestamp: new Date().toISOString(),
      content: inputMessage,
      author: {
        name: 'You',
        role: 'user',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You'
      }
    };

    setEvents(prev => [...prev, newMessage]);
    setInputMessage('');
  };

  const renderEvent = (event: CommunityEvent) => {
    const timeString = new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (event.type === 'system') {
      return (
        <div key={event.id} className="flex items-center gap-3 py-2 px-4 rounded-lg bg-zinc-900/50 border border-zinc-800 text-sm text-zinc-400 my-2">
          <MessageSquare size={16} className="text-zinc-500" />
          <span className="font-mono text-xs opacity-50">[{timeString}]</span>
          <span>{event.content}</span>
        </div>
      );
    }

    if (event.type === 'warning') {
      return (
        <div key={event.id} className="flex items-start gap-4 py-3 px-4 rounded-lg bg-red-950/20 border border-red-900/50 my-2">
          <div className="mt-1">
            <ShieldAlert size={20} className="text-red-500" />
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-bold text-red-400">{event.author?.name}</span>
              <span className="text-[10px] uppercase tracking-wider text-red-500/70 border border-red-500/30 px-1.5 py-0.5 rounded">System</span>
              <span className="text-xs text-zinc-500 ml-auto">{timeString}</span>
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed">{event.content}</p>
          </div>
        </div>
      );
    }
    
    if (event.type === 'tournament') {
      return (
        <div key={event.id} className="flex items-start gap-4 py-3 px-4 rounded-lg bg-indigo-950/20 border border-indigo-900/50 my-2">
          <div className="mt-1">
            <Swords size={20} className="text-indigo-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-bold text-indigo-400">{event.author?.name}</span>
              <span className="text-[10px] uppercase tracking-wider text-indigo-500/70 border border-indigo-500/30 px-1.5 py-0.5 rounded">Announcement</span>
              <span className="text-xs text-zinc-500 ml-auto">{timeString}</span>
            </div>
            <p className="text-indigo-100 text-sm leading-relaxed">{event.content}</p>
          </div>
        </div>
      );
    }

    // Standard Message
    const isMod = event.author?.role === 'moderator' || event.author?.role === 'admin';
    return (
      <div key={event.id} className="flex items-start gap-4 py-3 px-2 group hover:bg-white/5 transition-colors rounded-lg my-1">
        <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden shrink-0 border border-zinc-700">
          {event.author?.avatar ? (
            <img src={event.author.avatar} alt={event.author.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-500 font-bold">
              {event.author?.name?.charAt(0) || '?'}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-1">
            <span className={`font-bold ${isMod ? 'text-red-400' : 'text-zinc-200'}`}>
              {event.author?.name}
            </span>
            {isMod && (
              <span className="text-[10px] uppercase tracking-wider text-red-500/70 border border-red-500/30 px-1.5 py-0.5 rounded">Mod</span>
            )}
            <span className="text-xs text-zinc-500 ml-2">{timeString}</span>
          </div>
          <p className="text-zinc-300 text-sm leading-relaxed break-words">{event.content}</p>
        </div>
      </div>
    );
  };

  const activeChannel = community.channels.find(c => c.id === activeChannelId);

  const requireAuth = (callback: () => void) => {
    if (!isAuthorized) {
      setShowLoginPrompt(true);
    } else {
      callback();
    }
  };

  return (
    <>
      <div className="flex flex-col h-screen bg-black text-white overflow-hidden font-sans animate-in fade-in duration-500">
      
      {/* Top Banner / Header */}
      <header className="h-24 flex-none border-b border-zinc-800/50 bg-black/60 backdrop-blur-xl flex flex-col justify-center px-4 md:px-6 z-20 relative shadow-2xl">
        <div className="absolute inset-0 z-[-1] opacity-40 bg-cover bg-center mix-blend-luminosity" style={{ backgroundImage: community.rawgData?.background_image ? `url(${community.rawgData.background_image})` : undefined }} />
        
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md">
              <ArrowLeft size={16} />
              <span>Vader-Verse</span>
            </Link>
            <div className="mx-4 h-8 w-px bg-white/20" />
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-lg overflow-hidden border-2 border-red-500/50 bg-cover bg-center shadow-[0_0_15px_rgba(220,38,38,0.3)]"
                style={{
                  backgroundImage: community.rawgData?.background_image ? `url(${community.rawgData.background_image})` : (community.bannerImage ? `url(${community.bannerImage})` : undefined),
                  background: (!community.rawgData?.background_image && !community.bannerImage && community.fallbackGradient) ? community.fallbackGradient : undefined
                }}
              />
              <div className="flex flex-col drop-shadow-md">
                <h1 className="font-black text-2xl leading-none tracking-tight text-white uppercase italic">{community.name}</h1>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1.5 text-xs text-green-400 font-bold tracking-wide uppercase">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
                    {community.activePlayers.toLocaleString()} Online
                  </div>
                  {community.rawgData?.rating && (
                    <div className="flex items-center gap-1 text-xs text-yellow-400 font-bold bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/20">
                      ★ {community.rawgData.rating}/5
                    </div>
                  )}
                  {community.rawgData?.released && (
                    <div className="text-xs text-zinc-400 font-medium">
                      Released: {community.rawgData.released}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Subtle Background Glow */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-900/20 blur-[100px] rounded-full" />
          <div className="absolute top-1/2 -left-20 w-72 h-72 bg-indigo-900/10 blur-[80px] rounded-full" />
        </div>

        {/* Sidebar Overlay (Mobile) */}
        {isSidebarOpen && (
          <div 
            className="absolute inset-0 bg-black/60 z-40 md:hidden" 
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`absolute md:relative inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 w-64 flex-none border-r border-zinc-800/50 bg-zinc-950/95 md:bg-zinc-950/40 backdrop-blur-md z-50 flex flex-col transition-transform duration-300 ease-in-out`}>
          <div className="p-4">
            <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 px-2">Channels</h2>
            <div className="space-y-1">
              {community.channels.map(channel => (
                <button
                  key={channel.id}
                  onClick={() => {
                    requireAuth(() => setActiveChannelId(channel.id));
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-all text-sm font-medium ${
                    activeChannelId === channel.id
                      ? 'bg-zinc-800/80 text-white shadow-inner'
                      : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {channel.type === 'announcements' ? (
                      <Swords size={16} className={activeChannelId === channel.id ? 'text-indigo-400' : 'text-zinc-500'} />
                    ) : (
                      <Hash size={16} className={activeChannelId === channel.id ? 'text-zinc-300' : 'text-zinc-500'} />
                    )}
                    <span className="truncate">{channel.name}</span>
                  </div>
                  {channel.unreadCount && channel.unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                      {channel.unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-auto p-4 border-t border-zinc-800/50">
            <div className="flex items-center gap-3 px-2">
              <div className="w-8 h-8 rounded-full bg-red-900 flex items-center justify-center border border-red-500/30">
                <Users size={14} className="text-red-300" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-zinc-200">Community Hub</span>
                <span className="text-[10px] text-zinc-500">Global Network</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Chat Area */}
        <main className="flex-1 flex flex-col min-w-0 bg-black/40 backdrop-blur-md z-10 relative">
          
          {/* Channel Header */}
          <div className="h-14 border-b border-zinc-800/30 flex items-center px-4 md:px-6 gap-2 flex-none bg-zinc-950/30">
            <button 
              className="md:hidden p-2 -ml-2 mr-1 text-zinc-400 hover:text-white"
              onClick={() => setIsSidebarOpen(true)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            {activeChannel?.type === 'announcements' ? (
              <Swords size={20} className="text-zinc-400" />
            ) : (
              <Hash size={20} className="text-zinc-400" />
            )}
            <h2 className="font-bold text-zinc-200">{activeChannel?.name}</h2>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-1 scroller">
            {events.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-zinc-500 text-sm">
                No messages yet. Be the first to start the conversation!
              </div>
            ) : (
              events.map(renderEvent)
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 md:p-6 flex-none bg-gradient-to-t from-black to-transparent">
            <form onSubmit={handleSendMessage} className="relative group">
              <input
                type="text"
                value={inputMessage}
                onFocus={(e) => {
                  if (!isAuthorized) {
                    e.target.blur();
                    setShowLoginPrompt(true);
                  }
                }}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`Message #${activeChannel?.name}`}
                className="w-full bg-zinc-900/80 border border-zinc-700/50 rounded-xl py-3.5 pl-4 pr-12 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:bg-zinc-800/80"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg bg-red-600 text-white disabled:bg-zinc-800 disabled:text-zinc-500 transition-colors hover:bg-red-500"
              >
                <Send size={14} className={inputMessage.trim() ? "translate-x-[-1px] translate-y-[1px]" : ""} />
              </button>
            </form>
          </div>

        </main>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .scroller::-webkit-scrollbar {
          width: 8px;
        }
        .scroller::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.2);
        }
        .scroller::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
        }
        .scroller::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.2);
        }
      `}} />
      </div>

      <AlertDialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt}>
        <AlertDialogContent className="bg-zinc-950 border-red-900 text-white sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-red-500">Access Restricted</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-300">
              You must be logged into your Vader-Verse account to interact with the community.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-2">
            <AlertDialogCancel 
              onClick={() => setShowLoginPrompt(false)}
              className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 hover:text-white"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => router.push("/login")}
              className="bg-red-600 hover:bg-red-700 text-white border-0"
            >
              Log in
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
