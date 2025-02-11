import { initDraw } from "@/drawgame";
import { Circle, Eraser, Pencil, RectangleHorizontal, Redo, Save, Square, Trash2, Undo, Upload } from "lucide-react";
import { useEffect, useRef } from "react";
import { IconButton } from "./IconButton";

export function Canvas({
    roomId,
    socket
}: {
    socket: WebSocket
    roomId: string
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
     useEffect(() => {

        if(canvasRef.current) {
            initDraw(canvasRef.current, roomId, socket);
        }

     },[canvasRef]);

     return <div style={{
        height: "100vh",
        overflow: "hidden"
     }}>
        <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
      <TopBar/>
     </div>


}


function TopBar() {
    return (
        <div className="fixed top-2 left-1/2 -translate-x-1/2 bg-[#232329] px-4 py-2 flex items-center gap-2 rounded-lg shadow-md">
            <IconButton icon={<Pencil size={20} />} onClick={() => {}} />
            <IconButton icon={<Square size={20} />} onClick={() => {}} />
            <IconButton icon={<Circle size={20} />} onClick={() => {}} />
            <IconButton icon={<Eraser size={20} />} onClick={() => {}} />
            <IconButton icon={<Undo size={20} />} onClick={() => {}} />
            <IconButton icon={<Redo size={20} />} onClick={() => {}} />
            <IconButton icon={<Trash2 size={20} />} onClick={() => {}} />
            <IconButton icon={<Save size={20} />} onClick={() => {}} />
            <IconButton icon={<Upload size={20} />} onClick={() => {}} />
        </div>
    );
}