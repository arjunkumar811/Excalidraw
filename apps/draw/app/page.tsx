"use client";

import { useState, useEffect } from "react";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Pencil, Share2, Users2, Github, Plus, ArrowRight, Palette, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { HTTP_BACKEND } from "@/config";

function App() {
  const [roomName, setRoomName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [user, setUser] = useState<{ name: string; token: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("userName");
    if (token && userName) {
      setUser({ name: userName, token });
    }
  }, []);

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
            'Content-Type': 'application/json'
          } 
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
        alert(`Failed to create room: ${error.response.data.message || error.response.status}`);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">Excalidraw</span>
            </div>
            
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-slate-600">Welcome, {user.name}!</span>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      localStorage.clear();
                      setUser(null);
                    }}
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/signin">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6">
              Create, Collaborate,
              <span className="bg-gradient-to-r from-violet-500 to-purple-500 bg-clip-text text-transparent block">
                Draw Together
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              The ultimate collaborative whiteboarding experience. Create beautiful diagrams, 
              sketches, and wireframes with your team in real-time.
            </p>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              {user ? (
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Enter room name..."
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && createRoom()}
                    />
                  </div>
                  <Button 
                    onClick={createRoom}
                    disabled={!roomName.trim() || isCreating}
                    className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 px-6 py-3 h-auto"
                  >
                    {isCreating ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Plus className="w-5 h-5 mr-2" />
                        Create Room
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/signin">
                    <Button size="lg" className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 px-8 py-4 h-auto text-lg">
                      Get Started
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={joinRandomRoom}
                    className="px-8 py-4 h-auto text-lg border-2"
                  >
                    Try Demo
                  </Button>
                </div>
              )}
            </div>

            {/* Quick demo access */}
            <div className="text-center">
              <p className="text-sm text-slate-500 mb-4">or</p>
              <Button 
                variant="ghost" 
                onClick={joinRandomRoom}
                className="text-violet-600 hover:text-violet-700 hover:bg-violet-50"
              >
                <Zap className="w-4 h-4 mr-2" />
                Quick Start - No Account Needed
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Everything you need to create
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Powerful tools designed for seamless collaboration and beautiful results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 border-2 hover:border-violet-200 hover:shadow-lg transition-all duration-300 group">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Share2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Real-time Collaboration</h3>
                <p className="text-slate-600">
                  Work together with your team in real-time. See changes instantly as they happen.
                </p>
              </div>
            </Card>

            <Card className="p-8 border-2 hover:border-violet-200 hover:shadow-lg transition-all duration-300 group">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Pencil className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Intuitive Drawing</h3>
                <p className="text-slate-600">
                  Powerful drawing tools that feel natural. Create shapes, diagrams, and sketches effortlessly.
                </p>
              </div>
            </Card>

            <Card className="p-8 border-2 hover:border-violet-200 hover:shadow-lg transition-all duration-300 group">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Users2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Team Spaces</h3>
                <p className="text-slate-600">
                  Create dedicated rooms for different projects. Invite team members with a simple link.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-violet-500 to-purple-500">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to start creating?
            </h2>
            <p className="text-xl text-violet-100 mb-10">
              Join thousands of teams already using Excalidraw for their creative projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" variant="secondary" className="bg-white text-violet-600 hover:bg-gray-50 px-8 py-4 h-auto text-lg">
                  Create Free Account
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={joinRandomRoom}
                className="border-2 border-white text-white hover:bg-white hover:text-violet-600 px-8 py-4 h-auto text-lg"
              >
                Try Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Excalidraw</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                <Github className="w-4 h-4" />
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;