"use client"

import { HTTP_BACKEND } from "@/config";
import axios from "axios";

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

type Tool = "select" | "rectangle" | "circle" | "diamond" | "arrow" | "line" | "pencil" | "text" | "image" | "eraser";

let currentTool: Tool = "select";
let isDrawing = false;
let startX = 0;
let startY = 0;
let elements: DrawingElement[] = [];
let currentElement: DrawingElement | null = null;

export async function initDraw(
    canvas: HTMLCanvasElement, 
    roomId: string, 
    socket: WebSocket, 
    tool: Tool,
    callbacks: {
        onHistoryChange: (history: DrawingElement[], step: number) => void;
    }
) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    currentTool = tool;
    elements = await getExistingElements(roomId);
    redrawCanvas(canvas, ctx);

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === "drawing") {
            const element = JSON.parse(message.message);
            elements.push(element);
            redrawCanvas(canvas, ctx);
            callbacks.onHistoryChange(elements, elements.length - 1);
        }
    };

    const handleMouseDown = (e: MouseEvent) => {
        if (currentTool === "select" || currentTool === "eraser") return;

        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        startX = e.clientX - rect.left;
        startY = e.clientY - rect.top;

        const id = Math.random().toString(36).substr(2, 9);
        
        switch (currentTool) {
            case "pencil":
                currentElement = {
                    type: "pencil",
                    id,
                    x: startX,
                    y: startY,
                    points: [{ x: startX, y: startY }],
                    strokeColor: "#000000",
                    strokeWidth: 2
                };
                break;
            case "line":
                currentElement = {
                    type: "line",
                    id,
                    x: startX,
                    y: startY,
                    endX: startX,
                    endY: startY,
                    strokeColor: "#000000",
                    strokeWidth: 2
                };
                break;
            case "rectangle":
                currentElement = {
                    type: "rectangle",
                    id,
                    x: startX,
                    y: startY,
                    width: 0,
                    height: 0,
                    strokeColor: "#000000",
                    strokeWidth: 2
                };
                break;
            case "circle":
                currentElement = {
                    type: "circle",
                    id,
                    x: startX,
                    y: startY,
                    radius: 0,
                    strokeColor: "#000000",
                    strokeWidth: 2
                };
                break;
            case "diamond":
                currentElement = {
                    type: "diamond",
                    id,
                    x: startX,
                    y: startY,
                    width: 0,
                    height: 0,
                    strokeColor: "#000000",
                    strokeWidth: 2
                };
                break;
            case "arrow":
                currentElement = {
                    type: "arrow",
                    id,
                    x: startX,
                    y: startY,
                    endX: startX,
                    endY: startY,
                    strokeColor: "#000000",
                    strokeWidth: 2
                };
                break;
        }
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDrawing || !currentElement) return;

        const rect = canvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        switch (currentTool) {
            case "pencil":
                if (currentElement.points) {
                    currentElement.points.push({ x: currentX, y: currentY });
                }
                break;
            case "line":
            case "arrow":
                currentElement.endX = currentX;
                currentElement.endY = currentY;
                break;
            case "rectangle":
            case "diamond":
                currentElement.width = currentX - startX;
                currentElement.height = currentY - startY;
                break;
            case "circle":
                const radius = Math.sqrt(Math.pow(currentX - startX, 2) + Math.pow(currentY - startY, 2));
                currentElement.radius = radius;
                break;
        }

        redrawCanvas(canvas, ctx);
        if (currentElement) {
            drawElement(ctx, currentElement);
        }
    };

    const handleMouseUp = () => {
        if (!isDrawing || !currentElement) return;

        isDrawing = false;
        elements.push(currentElement);
        
        socket.send(JSON.stringify({
            type: "drawing",
            message: JSON.stringify(currentElement),
            roomId
        }));

        currentElement = null;
        callbacks.onHistoryChange(elements, elements.length - 1);
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseout", handleMouseUp);

    return () => {
        canvas.removeEventListener("mousedown", handleMouseDown);
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseup", handleMouseUp);
        canvas.removeEventListener("mouseout", handleMouseUp);
    };
}

function drawElement(ctx: CanvasRenderingContext2D, element: DrawingElement) {
    ctx.strokeStyle = element.strokeColor;
    ctx.lineWidth = element.strokeWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    switch (element.type) {
        case "rectangle":
            if (element.width && element.height) {
                ctx.strokeRect(element.x, element.y, element.width, element.height);
            }
            break;
        case "circle":
            if (element.radius) {
                ctx.beginPath();
                ctx.arc(element.x, element.y, element.radius, 0, 2 * Math.PI);
                ctx.stroke();
            }
            break;
        case "diamond":
            if (element.width && element.height) {
                const centerX = element.x + element.width / 2;
                const centerY = element.y + element.height / 2;
                const halfWidth = Math.abs(element.width) / 2;
                const halfHeight = Math.abs(element.height) / 2;
                
                ctx.beginPath();
                ctx.moveTo(centerX, element.y);
                ctx.lineTo(element.x + element.width, centerY);
                ctx.lineTo(centerX, element.y + element.height);
                ctx.lineTo(element.x, centerY);
                ctx.closePath();
                ctx.stroke();
            }
            break;
        case "line":
            if (element.endX !== undefined && element.endY !== undefined) {
                ctx.beginPath();
                ctx.moveTo(element.x, element.y);
                ctx.lineTo(element.endX, element.endY);
                ctx.stroke();
            }
            break;
        case "arrow":
            if (element.endX !== undefined && element.endY !== undefined) {
                const headLength = 20;
                const angle = Math.atan2(element.endY - element.y, element.endX - element.x);
                
                ctx.beginPath();
                ctx.moveTo(element.x, element.y);
                ctx.lineTo(element.endX, element.endY);
                ctx.stroke();
                
                ctx.beginPath();
                ctx.moveTo(element.endX, element.endY);
                ctx.lineTo(
                    element.endX - headLength * Math.cos(angle - Math.PI / 6),
                    element.endY - headLength * Math.sin(angle - Math.PI / 6)
                );
                ctx.moveTo(element.endX, element.endY);
                ctx.lineTo(
                    element.endX - headLength * Math.cos(angle + Math.PI / 6),
                    element.endY - headLength * Math.sin(angle + Math.PI / 6)
                );
                ctx.stroke();
            }
            break;
        case "pencil":
            if (element.points && element.points.length > 1) {
                ctx.beginPath();
                ctx.moveTo(element.points[0].x, element.points[0].y);
                for (let i = 1; i < element.points.length; i++) {
                    ctx.lineTo(element.points[i].x, element.points[i].y);
                }
                ctx.stroke();
            }
            break;
    }
}

function redrawCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    elements.forEach(element => drawElement(ctx, element));
}

async function getExistingElements(roomId: string): Promise<DrawingElement[]> {
    try {
        const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
        const messages = res.data.messages;
        
        return messages
            .filter((msg: { message: string }) => {
                try {
                    const parsed = JSON.parse(msg.message);
                    return parsed.type && parsed.id;
                } catch {
                    return false;
                }
            })
            .map((msg: { message: string }) => JSON.parse(msg.message));
    } catch (error) {
        console.error("Failed to load existing elements:", error);
        return [];
    }
}
