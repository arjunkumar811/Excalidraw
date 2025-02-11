import { initDraw } from "@/drawgame";
import { Circle, Eraser, Pencil, RectangleHorizontal, Redo, Save, Square, Trash2, Undo, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";

type Shape = "Circle" | "Rectangle" | "Pencil" | "Square" | "Eraser" | "Undo" | "Redo" | "Trash" | "Save" | "Upload";

export function Canvas({
    roomId,
    socket
}: {
    socket: WebSocket;
    roomId: string;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedTool, setSelectedTool] = useState<Shape>("Circle");

    useEffect(() => {
        if (canvasRef.current) {
            initDraw(canvasRef.current, roomId, socket);
        }
    }, [canvasRef]);

    return (
        <div style={{ height: "100vh", overflow: "hidden" }}>
            <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
            <TopBar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
        </div>
    );
}

function TopBar({
    selectedTool,
    setSelectedTool
}: {
    selectedTool: Shape;
    setSelectedTool: (s: Shape) => void;
}) {
    return (
        <div className="fixed top-2 left-1/2 -translate-x-1/2 bg-[#232329] px-4 py-2 flex items-center gap-2 rounded-lg shadow-md">
            <IconButton activated={selectedTool === "Pencil"} icon={<Pencil size={20} />} onClick={() => setSelectedTool("Pencil")} />
            <IconButton activated={selectedTool === "Square"} icon={<Square size={20} />} onClick={() => setSelectedTool("Square")} />
            <IconButton activated={selectedTool === "Circle"} icon={<Circle size={20} />} onClick={() => setSelectedTool("Circle")} />
            <IconButton activated={selectedTool === "Eraser"} icon={<Eraser size={20} />} onClick={() => setSelectedTool("Eraser")} />
            <IconButton activated={selectedTool === "Undo"} icon={<Undo size={20} />} onClick={() => setSelectedTool("Undo")} />
            <IconButton activated={selectedTool === "Redo"} icon={<Redo size={20} />} onClick={() => setSelectedTool("Redo")} />
            <IconButton activated={selectedTool === "Trash"} icon={<Trash2 size={20} />} onClick={() => setSelectedTool("Trash")} />
            <IconButton activated={selectedTool === "Save"} icon={<Save size={20} />} onClick={() => setSelectedTool("Save")} />
            <IconButton activated={selectedTool === "Upload"} icon={<Upload size={20} />} onClick={() => setSelectedTool("Upload")} />
        </div>
    );
}
