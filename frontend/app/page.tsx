"use client";

import { useState } from "react";
import { Button } from "@/components/button";
import {
  Palette,
  Plus,
  Zap,
  Github,
  Users2,
  Share2,
  Pencil
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useClientOnly } from "../hooks/useClientOnly";

function App() {
  const [roomName, setRoomName] = useState("");
  const router = useRouter();
  const isClient = useClientOnly();

  const createRoom = () => {
    let slug = roomName.trim();
    if (!slug) {
      slug = `demo-${Math.random().toString(36).substring(2, 8)}`;
    }
    router.push(`/canvas/${slug}`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 bg-dot-pattern transition-colors flex flex-col font-sans">
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-violet-600 text-white p-1.5 rounded-lg shadow-sm">
              <Palette className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Excalidraw</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center py-20 md:py-32 px-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800 text-xs font-medium mb-8">
          <Zap className="w-3.5 h-3.5" />
          Free & Open Source
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white max-w-4xl mb-6">
          Virtual whiteboard for sketching hand-drawn like diagrams.
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mb-12">
          Collaborate with your team in real-time. Just share the URL and start drawing.
        </p>

        <div className="w-full max-w-xl mx-auto mb-8">
          {isClient ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Name your room... (optional)"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && createRoom()}
                className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 shadow-sm transition-all text-black dark:text-white"
              />
              <Button variant="primary" size="lg" onClick={createRoom} className="bg-violet-600 hover:bg-violet-700 text-white py-3 shadow-sm whitespace-nowrap">
                <Plus className="w-4 h-4 mr-2 inline" /> Go to Room
              </Button>
            </div>
          ) : (
             <div className="flex justify-center gap-4"><div className="w-32 h-12 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg" /></div>
          )}
        </div>
        
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full text-left">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center mb-4">
              <Share2 className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Real-Time Collaboration</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Work together seamlessly. See changes instantly as your team creates.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center mb-4">
              <Pencil className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Intuitive Tools</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Professional-grade tools that feel natural. Create shapes and visuals easily.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center mb-4">
              <Users2 className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Instant Access</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">No signups required. Create a room instantly and share the URL.</p>
          </div>
        </div>
      </main>
      
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <div>© 2025 Excalidraw Clone. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="https://github.com/arjunkumar811/Excalidraw" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-2">
              <Github className="w-4 h-4" /> GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
