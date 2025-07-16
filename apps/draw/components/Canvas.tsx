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
    MessageCircle
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import Link from "next/link";

type Shape = "Circle" | "Rectangle" | "Pencil" | "Square" | "Eraser" | "Undo" | "Redo" | "Trash" | "Save" | "Upload";

export function Canvas({
    roomId,
    socket
}: {
    socket: WebSocket;
    roomId: string;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedTool, setSelectedTool] = useState<Shape>("Pencil");
    const [userCount, setUserCount] = useState(1);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        if (canvasRef.current) {
            initDraw(canvasRef.current, roomId, socket);
        }

        // Listen for user count updates
        socket.addEventListener('message', (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'userCount') {
                setUserCount(data.count);
            }
        });
    }, [canvasRef, roomId, socket]);

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
                                activated={selectedTool === "Pencil"} 
                                icon={<Pencil size={18} />} 
                                onClick={() => setSelectedTool("Pencil")}
                                tooltip="Pencil" 
                            />
                            <IconButton 
                                activated={selectedTool === "Square"} 
                                icon={<Square size={18} />} 
                                onClick={() => setSelectedTool("Square")}
                                tooltip="Rectangle" 
                            />
                            <IconButton 
                                activated={selectedTool === "Circle"} 
                                icon={<Circle size={18} />} 
                                onClick={() => setSelectedTool("Circle")}
                                tooltip="Circle" 
                            />
                            <IconButton 
                                activated={selectedTool === "Eraser"} 
                                icon={<Eraser size={18} />} 
                                onClick={() => setSelectedTool("Eraser")}
                                tooltip="Eraser" 
                            />
                        </div>

                        {/* Action tools */}
                        <div className="flex items-center gap-1 pr-2 border-r border-gray-200">
                            <IconButton 
                                activated={false} 
                                icon={<Undo size={18} />} 
                                onClick={() => setSelectedTool("Undo")}
                                tooltip="Undo" 
                            />
                            <IconButton 
                                activated={false} 
                                icon={<Redo size={18} />} 
                                onClick={() => setSelectedTool("Redo")}
                                tooltip="Redo" 
                            />
                            <IconButton 
                                activated={false} 
                                icon={<Trash2 size={18} />} 
                                onClick={() => setSelectedTool("Trash")}
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
    );
}
