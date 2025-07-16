import { initDraw } from "@/drawgame";
import { 
    Circle, 
    Eraser, 
    Pencil, 
    Square, 
    Redo, 
    Save, 
    Trash2, 
    Undo, 
    Upload, 
    Download,
    Users,
    Settings,
    Home,
    MessageCircle,
    Minus,
    ArrowUpRight,
    Type,
    Diamond
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import Link from "next/link";

type Tool = "select" | "rectangle" | "circle" | "diamond" | "arrow" | "line" | "pencil" | "text" | "image" | "eraser";

type DrawingElement = {
    type: "rectangle" | "circle" | "diamond" | "arrow" | "line" | "pencil" | "text" | "image";
    id: string;
    x: number;
    y: number;
    width?: number;
    height?: number;
    radius?: number;
    endX?: number;
    endY?: number;
    points?: { x: number; y: number }[];
    text?: string;
    strokeColor: string;
    fillColor?: string;
    strokeWidth: number;
}

export function Canvas({
    roomId,
    socket
}: {
    socket: WebSocket;
    roomId: string;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedTool, setSelectedTool] = useState<Tool>("select");
    const [userCount, setUserCount] = useState(1);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [history, setHistory] = useState<DrawingElement[]>([]);
    const [historyStep, setHistoryStep] = useState(-1);

    useEffect(() => {
        if (canvasRef.current) {
            initDraw(canvasRef.current, roomId, socket, selectedTool, {
                onHistoryChange: (newHistory: DrawingElement[], step: number) => {
                    setHistory(newHistory);
                    setHistoryStep(step);
                }
            });
        }

        socket.addEventListener('message', (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'userCount') {
                setUserCount(data.count);
            }
        });
    }, [canvasRef, roomId, socket, selectedTool]);

    const handleUndo = () => {
        if (historyStep > 0) {
            setHistoryStep(historyStep - 1);
        }
    };

    const handleRedo = () => {
        if (historyStep < history.length - 1) {
            setHistoryStep(historyStep + 1);
        }
    };

    const handleClear = () => {
        setHistory([]);
        setHistoryStep(-1);
    };

    return (
        <div className="relative h-screen w-screen overflow-hidden bg-white">
            {/* Canvas */}
            <canvas 
                ref={canvasRef} 
                width={window.innerWidth} 
                height={window.innerHeight}
                className="block"
            />
            
            {/* Top Toolbar */}
            <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-10">
                <div className="bg-white/95 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-lg px-4 py-3">
                    <div className="flex items-center gap-2">
                        {/* Main drawing tools */}
                        <div className="flex items-center gap-1 pr-2 border-r border-gray-200">
                            <IconButton 
                                activated={selectedTool === "select"} 
                                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg>} 
                                onClick={() => setSelectedTool("select")}
                                tooltip="Select" 
                            />
                            <IconButton 
                                activated={selectedTool === "rectangle"} 
                                icon={<Square size={18} />} 
                                onClick={() => setSelectedTool("rectangle")}
                                tooltip="Rectangle" 
                            />
                            <IconButton 
                                activated={selectedTool === "circle"} 
                                icon={<Circle size={18} />} 
                                onClick={() => setSelectedTool("circle")}
                                tooltip="Circle" 
                            />
                            <IconButton 
                                activated={selectedTool === "diamond"} 
                                icon={<Diamond size={18} />} 
                                onClick={() => setSelectedTool("diamond")}
                                tooltip="Diamond" 
                            />
                            <IconButton 
                                activated={selectedTool === "arrow"} 
                                icon={<ArrowUpRight size={18} />} 
                                onClick={() => setSelectedTool("arrow")}
                                tooltip="Arrow" 
                            />
                            <IconButton 
                                activated={selectedTool === "line"} 
                                icon={<Minus size={18} />} 
                                onClick={() => setSelectedTool("line")}
                                tooltip="Line" 
                            />
                            <IconButton 
                                activated={selectedTool === "pencil"} 
                                icon={<Pencil size={18} />} 
                                onClick={() => setSelectedTool("pencil")}
                                tooltip="Pencil" 
                            />
                            <IconButton 
                                activated={selectedTool === "text"} 
                                icon={<Type size={18} />} 
                                onClick={() => setSelectedTool("text")}
                                tooltip="Text" 
                            />
                            <IconButton 
                                activated={selectedTool === "image"} 
                                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>} 
                                onClick={() => setSelectedTool("image")}
                                tooltip="Image" 
                            />
                            <IconButton 
                                activated={selectedTool === "eraser"} 
                                icon={<Eraser size={18} />} 
                                onClick={() => setSelectedTool("eraser")}
                                tooltip="Eraser" 
                            />
                        </div>

                        {/* Action tools */}
                        <div className="flex items-center gap-1 pr-2 border-r border-gray-200">
                            <IconButton 
                                activated={false} 
                                icon={<Undo size={18} />} 
                                onClick={handleUndo}
                                tooltip="Undo" 
                            />
                            <IconButton 
                                activated={false} 
                                icon={<Redo size={18} />} 
                                onClick={handleRedo}
                                tooltip="Redo" 
                            />
                            <IconButton 
                                activated={false} 
                                icon={<Trash2 size={18} />} 
                                onClick={handleClear}
                                tooltip="Clear All" 
                            />
                        </div>

                        {/* File operations */}
                        <div className="flex items-center gap-1">
                            <IconButton 
                                activated={false} 
                                icon={<Save size={18} />} 
                                onClick={() => setSelectedTool("Save")}
                                tooltip="Save" 
                            />
                            <IconButton 
                                activated={false} 
                                icon={<Download size={18} />} 
                                onClick={() => setSelectedTool("Save")}
                                tooltip="Export" 
                            />
                            <IconButton 
                                activated={false} 
                                icon={<Upload size={18} />} 
                                onClick={() => setSelectedTool("Upload")}
                                tooltip="Import" 
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Right - User count and room info */}
            <div className="fixed top-4 right-4 z-10">
                <div className="bg-white/95 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-lg px-4 py-3">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Users size={16} />
                            <span className="font-medium">{userCount}</span>
                        </div>
                        <div className="w-px h-4 bg-gray-200"></div>
                        <div className="text-xs text-gray-500 font-mono">
                            Room: {roomId.slice(-6)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Left - Home button */}
            <div className="fixed top-4 left-4 z-10">
                <Link href="/">
                    <div className="bg-white/95 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-lg p-3 hover:bg-gray-50 transition-all">
                        <Home size={20} className="text-gray-600" />
                    </div>
                </Link>
            </div>

            {/* Bottom Right - Settings */}
            <div className="fixed bottom-4 right-4 z-10">
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="bg-white/95 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-lg p-3 hover:bg-gray-50 transition-all"
                >
                    <Settings size={20} className="text-gray-600" />
                </button>
                
                {isMenuOpen && (
                    <div className="absolute bottom-16 right-0 bg-white border border-gray-200 rounded-xl shadow-lg py-2 min-w-[200px]">
                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                            <MessageCircle size={16} />
                            Toggle Chat
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                            <Download size={16} />
                            Export PNG
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                            <Download size={16} />
                            Export SVG
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
