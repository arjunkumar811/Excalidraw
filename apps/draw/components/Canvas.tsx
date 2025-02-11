import { initDraw } from "@/drawgame";
import { useEffect, useRef } from "react";

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
     </div>


}