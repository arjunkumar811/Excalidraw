"use client"

import { HTTP_BACKEND } from "@/config";
import axios from "axios";

type Shape = {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
} | {
    type: "circle";
    centerX: number;
    centerY: number;
    radius: number
}




export function initDraw(canvas: HTMLCanvasElement, roomId: string) {
    const ctx = canvas.getContext("2d");
  
        let existingShapes: Shape[] = [];
  
    if (!ctx) {
      return;
    }

    clearCanvas(existingShapes, canvas, ctx)


let Clicked = false;
let startX = 0;
let startY = 0;

      canvas.addEventListener("mousedown", (e) => {
        Clicked = true;
        startX =  e.clientX
        startY =  e.clientY
      })


      canvas.addEventListener("mouseup", (e) => {
        Clicked = false;
        const width = e.clientX - startX;
        const height = e.clientY - startY;
        existingShapes.push({
            type: "rect",
            x: startX,
            y: startY,
            height,
            width
        })
      })


      canvas.addEventListener("mousemove", (e) => {
if(Clicked) {
const width = e.clientX - startX;
const height = e.clientY - startY;
clearCanvas(existingShapes, canvas, ctx)
ctx.strokeStyle = "rgba(255, 255, 255)"
ctx.strokeRect(startX, startY, width, height)
    
}
      })
}


function clearCanvas(existingShapes: Shape[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0, 0, 0)"
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    existingShapes.map((shape) => {
        if(shape.type === "rect") {
            ctx.strokeStyle = "rgba(255, 255, 255)"
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        }
    })
}


async function getExistingShapes(roomId: string) {
    const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
    const messages = res.data.messages;

    const shapes = messages.map((x: { message: string }) => {
        const messageData = JSON.parse(x.message);
        return messageData;
    });

    return shapes;
}
