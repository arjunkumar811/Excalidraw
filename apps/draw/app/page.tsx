"use client";

import { useState, useEffect } from "react";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import {
  Pencil,
  Share2,
  Users2,
  Github,
  Plus,
  ArrowRight,
  Palette,
  Zap,
  Sparkles,
  Star,
  Mail,
  MessageCircle,
  Twitter,
  Linkedin,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import { FaDiscord, FaYoutube } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { HTTP_BACKEND } from "@/config";
import { useClientOnly } from "../hooks/useClientOnly";

function App() {
  const [roomName, setRoomName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [user, setUser] = useState<{ name: string; token: string } | null>(
    null
  );
  const router = useRouter();
  const isClient = useClientOnly();

  useEffect(() => {
    
    if (isClient && typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const userName = localStorage.getItem("userName");
      if (token && userName) {
        setUser({ name: userName, token });
      }
    }
  }, [isClient]);

  const createRoom = async () => {
    if (!roomName.trim()) {
      alert("Please enter a room name");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please sign in first to create a room");
      router.push("/signin");
      return;
    }

    setIsCreating(true);
    try {
      console.log("Creating room with name:", roomName);
      console.log("Using token:", token);

      const response = await axios.post(
        `${HTTP_BACKEND}/room`,
        { name: roomName },
        {
          headers: {
            authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Room creation response:", response.data);

      if (response.data.roomId || response.data.slug) {
        const roomSlug = response.data.slug || roomName;
        console.log("Navigating to room:", roomSlug);
        router.push(`/canvas/${roomSlug}`);
      } else {
        alert("Failed to create room: No room ID returned");
      }
    } catch (error: unknown) {
      console.error("Failed to create room:", error);
      if (axios.isAxiosError(error) && error.response) {
        console.error("Error response:", error.response.data);
        alert(
          `Failed to create room: ${error.response.data.message || error.response.status}`
        );
      } else {
        alert("Failed to create room: Network error");
      }
    } finally {
      setIsCreating(false);
    }
  };

  const joinRandomRoom = () => {
    const randomId = Math.random().toString(36).substring(2, 8);
    router.push(`/canvas/${randomId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      
      <nav className="relative border-b border-purple-200/50 bg-white/70 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <Palette className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-black bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Excalidraw
                </span>
                <p className="text-xs text-slate-500 font-medium -mt-1">Collaborative Studio</p>
              </div>
            </motion.div>

            <div className="flex items-center gap-3">
              {isClient ? (
                user ? (
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-violet-100 to-purple-100 rounded-full border border-purple-200">
                      <div className="w-9 h-9 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        {user.name[0].toUpperCase()}
                      </div>
                      <span className="text-sm font-semibold text-slate-800">
                        {user.name}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        localStorage.clear();
                        setUser(null);
                      }}
                      className="border-slate-300 hover:bg-red-50 hover:border-red-300 hover:text-red-600 font-medium"
                    >
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link href="/signin">
                      <Button variant="ghost" className="font-semibold text-slate-700 hover:text-violet-600">Sign In</Button>
                    </Link>
                    <Link href="/signup">
                      <Button className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all font-bold">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Get Started Free
                      </Button>
                    </Link>
                  </div>
                )
              ) : (
                <div className="w-40 h-10 bg-slate-200 animate-pulse rounded-lg"></div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden py-32 sm:py-40">
        <div className="absolute top-20 left-10 w-72 h-72 bg-violet-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-100 to-purple-100 border border-purple-200 text-violet-700 rounded-full text-sm font-bold mb-8 shadow-lg"
            >
              <Star className="w-4 h-4 fill-violet-600" />
              100% Free & Open Source Forever
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight mb-8"
            >
              <span className="text-slate-900">Create.</span>
              <span className="text-slate-900"> Collaborate.</span>
              <span className="block mt-3 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                Design Together.
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl sm:text-2xl md:text-3xl text-slate-600 mb-16 max-w-4xl mx-auto leading-relaxed font-light"
            >
              The next-generation collaborative whiteboard. Create stunning diagrams, 
              wireframes, and illustrations with your team in perfect real-time sync.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20"
            >
              {isClient ? (
                user ? (
                  <div className="w-full max-w-3xl">
                    <div className="flex flex-col sm:flex-row gap-4 p-3 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-purple-500/20 border border-purple-200">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Name your creative workspace..."
                          value={roomName}
                          onChange={(e) => setRoomName(e.target.value)}
                          className="w-full px-8 py-5 border-0 rounded-2xl focus:ring-2 focus:ring-purple-500 text-slate-900 placeholder:text-slate-400 text-lg font-medium bg-white"
                          onKeyPress={(e) => e.key === "Enter" && createRoom()}
                        />
                      </div>
                      <Button
                        onClick={createRoom}
                        disabled={!roomName.trim() || isCreating}
                        className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 px-10 py-5 h-auto text-lg font-bold transition-all"
                      >
                        {isCreating ? (
                          <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Plus className="w-6 h-6 mr-2" />
                            Create Workspace
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-5">
                    <Link href="/signup">
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-110 px-12 py-7 h-auto text-xl font-black rounded-2xl transition-all duration-300"
                      >
                        <Sparkles className="w-6 h-6 mr-2" />
                        Start Creating Free
                        <ArrowRight className="ml-2 w-6 h-6" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={joinRandomRoom}
                      disabled={isCreating}
                      className="px-12 py-7 h-auto text-xl border-3 border-purple-300 hover:border-purple-500 hover:bg-purple-50 font-black rounded-2xl transition-all duration-300"
                    >
                      {isCreating ? (
                        <div className="w-6 h-6 border-3 border-purple-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Zap className="w-6 h-6 mr-2 text-purple-600" />
                          Try Live Demo
                        </>
                      )}
                    </Button>
                  </div>
                )
              ) : (
                <div className="flex justify-center gap-5">
                  <div className="w-64 h-16 bg-gradient-to-r from-slate-200 to-slate-300 animate-pulse rounded-2xl"></div>
                  <div className="w-64 h-16 bg-gradient-to-r from-slate-200 to-slate-300 animate-pulse rounded-2xl"></div>
                </div>
              )}
            </motion.div>

            {!user && isClient && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-center gap-8 text-sm text-slate-600"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="font-medium">No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="font-medium">Start in 30 seconds</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="font-medium">Free forever</span>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <section className="relative py-32 bg-gradient-to-b from-white to-purple-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-24"
          >
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-6">
              Everything you need to
              <span className="block bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                create amazing things
              </span>
            </h2>
            <p className="text-2xl text-slate-600 max-w-3xl mx-auto font-light">
              Professional-grade tools designed for modern teams
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-10 border-2 border-violet-200 hover:border-violet-400 hover:shadow-2xl hover:shadow-violet-500/20 transition-all duration-500 group bg-gradient-to-br from-white to-violet-50 h-full">
                <div className="mb-8">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative w-24 h-24 bg-gradient-to-br from-violet-600 to-purple-700 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all">
                      <Share2 className="w-12 h-12 text-white" />
                    </div>
                  </div>
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-5">
                  Real-Time Sync
                </h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  Experience lightning-fast collaboration. Every stroke, every shape, 
                  synced instantly across all users with zero lag.
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="p-10 border-2 border-blue-200 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 group bg-gradient-to-br from-white to-blue-50 h-full">
                <div className="mb-8">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all">
                      <Pencil className="w-12 h-12 text-white" />
                    </div>
                  </div>
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-5">
                  Powerful Tools
                </h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  Professional drawing tools that feel natural. Create complex 
                  diagrams, beautiful sketches, and precise wireframes effortlessly.
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="p-10 border-2 border-emerald-200 hover:border-emerald-400 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 group bg-gradient-to-br from-white to-emerald-50 h-full">
                <div className="mb-8">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all">
                      <Users2 className="w-12 h-12 text-white" />
                    </div>
                  </div>
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-5">
                  Team Workspaces
                </h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  Organized spaces for every project. Invite unlimited team members 
                  with a simple link. Stay productive, stay organized.
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative py-40 bg-gradient-to-br from-violet-700 via-purple-700 to-pink-700 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-5xl mx-auto"
          >
            <h2 className="text-5xl md:text-7xl font-black text-white mb-10 leading-tight">
              Ready to transform your creative workflow?
            </h2>
            <p className="text-2xl md:text-3xl text-purple-100 mb-16 font-light leading-relaxed">
              Join thousands of teams creating amazing things with Excalidraw every single day.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/signup">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    className="bg-white text-slate-900 hover:bg-gray-50 px-14 py-8 h-auto text-xl font-black shadow-2xl rounded-2xl"
                  >
                    <Sparkles className="w-6 h-6 mr-2 text-purple-600" />
                    Start Creating Now
                    <ArrowRight className="ml-2 w-6 h-6" />
                  </Button>
                </motion.div>
              </Link>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  onClick={joinRandomRoom}
                  disabled={isCreating}
                  className="border-4 border-white text-white bg-white/10 hover:bg-white/20 backdrop-blur-md px-14 py-8 h-auto text-xl font-black rounded-2xl transition-all"
                >
                  {isCreating ? (
                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Zap className="w-6 h-6 mr-2" />
                      Try Live Demo
                    </>
                  )}
                </Button>
              </motion.div>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-10 text-purple-200 text-lg flex items-center justify-center gap-8"
            >
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                No installation required
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Works in browser
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Free forever
              </span>
            </motion.p>
          </motion.div>
        </div>
      </section>

      <footer className="relative bg-slate-950 text-white pt-24 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 rounded-2xl blur-lg opacity-75"></div>
                  <div className="relative w-14 h-14 bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <Palette className="w-7 h-7 text-white" />
                  </div>
                </div>
                <span className="text-3xl font-black bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                  Excalidraw
                </span>
              </div>
              <p className="text-slate-400 text-lg mb-8 max-w-md leading-relaxed">
                The next-generation collaborative whiteboard that empowers creative teams 
                to bring their ideas to life with stunning visual communication.
              </p>
              <div className="flex items-center gap-4">
                <a 
                  href="#" 
                  className="w-12 h-12 bg-slate-900 hover:bg-gradient-to-r hover:from-violet-600 hover:to-purple-600 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <Github className="w-6 h-6" />
                </a>
                <a 
                  href="#" 
                  className="w-12 h-12 bg-slate-900 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-500 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <Twitter className="w-6 h-6" />
                </a>
                <a 
                  href="#" 
                  className="w-12 h-12 bg-slate-900 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-indigo-500 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <FaDiscord className="w-6 h-6" />
                </a>
                <a 
                  href="#" 
                  className="w-12 h-12 bg-slate-900 hover:bg-gradient-to-r hover:from-red-600 hover:to-red-500 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <FaYoutube className="w-6 h-6" />
                </a>
                <a 
                  href="#" 
                  className="w-12 h-12 bg-slate-900 hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-600 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Product
              </h3>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Roadmap
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Changelog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                <Users2 className="w-5 h-5 text-purple-400" />
                Resources
              </h3>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    API Reference
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Community
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-slate-400 text-sm flex items-center gap-2">
                <span>© 2025 Excalidraw.</span>
                <span className="hidden sm:inline">Built with</span>
                <span className="text-pink-500 animate-pulse">❤</span>
                <span className="hidden sm:inline">for creative teams worldwide.</span>
              </div>
              <div className="flex items-center gap-8 text-sm">
                <a href="#" className="text-slate-400 hover:text-white transition-colors font-medium">
                  Privacy Policy
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors font-medium">
                  Terms of Service
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Contact
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
