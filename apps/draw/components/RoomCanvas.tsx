"use client"

import { WS_URL } from "@/config";
import { initDraw } from "@/drawgame";
import { useEffect, useRef, useState } from "react";
import { Canvas } from "./Canvas";



export function RoomCanvas({roomId}: {roomId: string}) {
    const [socket, setSocket] = useState<WebSocket | null>(null);


    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyZjA1ODQ2OC1lYmM5LTRkZDAtYjAzZi01MTFmZTg1ZmM2MmIiLCJpYXQiOjE3MzkxODk5MTh9.TLBCe5i0m84BnXNt9xgER6PdX1BBVt-EBez1u-o5g5M`)

        ws.onopen = () => {
            setSocket(ws);
            ws.send(JSON.stringify({
                type: "join_room",
                roomId: roomId
            }));
        };
    }, [roomId])


    if(!socket) {
        return <div>
            Connectiong to yhe server...........
        </div>
    }


return <div>
    <Canvas roomId={roomId} socket={socket} />
    
</div>

}
