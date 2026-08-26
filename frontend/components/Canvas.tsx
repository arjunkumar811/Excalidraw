import { initDraw, setCurrentTool, setDarkMode, undo, redo, clearCanvas } from "@/drawgame";
import {
  Circle,
  Eraser,
  Pencil,
  Square,
  Redo,
  Save,
  Trash2,
  Undo,
  Download,
  Users,
  Settings,
  Home,
  MessageCircle,
  Minus,
  ArrowUpRight,
  Diamond,
  Sun,
  Moon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import Link from "next/link";

type Tool =
  | "select"
  | "rectangle"
  | "circle"
  | "diamond"
  | "arrow"
  | "line"
  | "pencil"
  | "eraser";

export function Canvas({
  roomId,
  socket,
}: {
  socket: WebSocket;
  roomId: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState<Tool>("select");
  const [userCount, setUserCount] = useState(1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    let cleanupDraw: (() => void) | void;

    if (canvasRef.current) {
      initDraw(
        canvasRef.current,
        roomId,
        socket,
        selectedTool,
        {
          onHistoryChange: () => {},
        },
        isDarkMode
      ).then(cleanup => {
        cleanupDraw = cleanup;
      });

      socket.send(
        JSON.stringify({
          type: "join_room",
          roomId: roomId,
        })
      );
    }

    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.type === "userCount") {
        setUserCount(data.count);
      }
    };

    socket.addEventListener("message", handleMessage);
    return () => {
      socket.removeEventListener("message", handleMessage);
      if (cleanupDraw) cleanupDraw();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasRef, roomId, socket]);

  useEffect(() => {
    setCurrentTool(selectedTool);
  }, [selectedTool]);

  useEffect(() => {
    setDarkMode(isDarkMode);
  }, [isDarkMode]);

  const handleUndo = () => {
    undo();
  };

  const handleRedo = () => {
    redo();
  };

  const handleClear = () => {
    clearCanvas();
  };

  return (
    <div
      className={`relative h-screen w-screen overflow-hidden transition-colors bg-dot-pattern ${
        isDarkMode ? "bg-slate-900" : "bg-slate-50"
      }`}
    >
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        className="block"
      />

      {/* TOP LEFT: Home & Room Info */}
      <div className="fixed top-4 left-4 z-10 flex items-center gap-3">
        <Link href="/">
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all cursor-pointer">
            <Home size={20} className="text-slate-600 dark:text-slate-300" />
          </div>
        </Link>
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm px-3 py-2 flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
            <Users size={14} className="text-violet-500" />
            <span>{userCount}</span>
          </div>
          <div className="w-px h-4 bg-slate-200 dark:bg-slate-700"></div>
          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
            Room: {roomId.slice(-6)}
          </div>
        </div>
      </div>

      {/* TOP CENTER: Drawing Tools */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm px-2 py-1.5 flex items-center gap-1">
          <IconButton
            activated={selectedTool === "select"}
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
              </svg>
            }
            onClick={() => setSelectedTool("select")}
            tooltip="Select"
          />
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
          <IconButton activated={selectedTool === "rectangle"} icon={<Square size={18} />} onClick={() => setSelectedTool("rectangle")} tooltip="Rectangle" />
          <IconButton activated={selectedTool === "circle"} icon={<Circle size={18} />} onClick={() => setSelectedTool("circle")} tooltip="Circle" />
          <IconButton activated={selectedTool === "diamond"} icon={<Diamond size={18} />} onClick={() => setSelectedTool("diamond")} tooltip="Diamond" />
          <IconButton activated={selectedTool === "arrow"} icon={<ArrowUpRight size={18} />} onClick={() => setSelectedTool("arrow")} tooltip="Arrow" />
          <IconButton activated={selectedTool === "line"} icon={<Minus size={18} />} onClick={() => setSelectedTool("line")} tooltip="Line" />
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
          <IconButton activated={selectedTool === "pencil"} icon={<Pencil size={18} />} onClick={() => setSelectedTool("pencil")} tooltip="Pencil" />
          <IconButton activated={selectedTool === "eraser"} icon={<Eraser size={18} />} onClick={() => setSelectedTool("eraser")} tooltip="Eraser" />
        </div>
      </div>

      {/* TOP RIGHT: Settings & Actions */}
      <div className="fixed top-4 right-4 z-10 flex items-center gap-2">
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm px-2 py-1.5 flex items-center gap-1">
          <IconButton activated={false} icon={<Save size={18} />} onClick={() => {}} tooltip="Save" />
          <IconButton activated={false} icon={<Download size={18} />} onClick={() => {}} tooltip="Export" />
          <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1"></div>
          <IconButton activated={false} icon={<Trash2 size={18} className="text-red-500" />} onClick={handleClear} tooltip="Clear Canvas" />
        </div>
      </div>

      {/* BOTTOM LEFT: Undo/Redo & Zoom & Dark Mode */}
      <div className="fixed bottom-4 left-4 z-10 flex items-center gap-3">
        {/* Undo/Redo */}
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm px-2 py-1.5 flex items-center gap-1">
          <IconButton activated={false} icon={<Undo size={18} />} onClick={handleUndo} tooltip="Undo" />
          <IconButton activated={false} icon={<Redo size={18} />} onClick={handleRedo} tooltip="Redo" />
        </div>
        
        {/* Theme Toggle */}
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm px-2 py-1.5">
          <IconButton
            activated={false}
            icon={isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            onClick={() => setIsDarkMode(!isDarkMode)}
            tooltip={isDarkMode ? "Light Mode" : "Dark Mode"}
          />
        </div>
      </div>

      {/* BOTTOM RIGHT: Help/Menu */}
      <div className="fixed bottom-4 right-4 z-10">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95"
        >
          <Settings size={20} className="text-slate-600 dark:text-slate-300" />
        </button>

        {isMenuOpen && (
          <div className="absolute bottom-14 right-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg py-2 min-w-[200px] animate-in fade-in slide-in-from-bottom-4 duration-200">
            <button className="w-full px-4 py-2 text-left text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors">
              <MessageCircle size={16} className="text-violet-500" />
              Toggle Chat
            </button>
            <div className="h-px w-full bg-slate-100 dark:bg-slate-700 my-1"></div>
            <button className="w-full px-4 py-2 text-left text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors">
              <Download size={16} />
              Export PNG
            </button>
            <button className="w-full px-4 py-2 text-left text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors">
              <Download size={16} />
              Export SVG
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
