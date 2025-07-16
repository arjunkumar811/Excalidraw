"use client";

import { WS_URL } from "@/config";
import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";
import { Loader2, AlertCircle } from "lucide-react";

export function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "error"
  >("connecting");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const token =
      localStorage.getItem("token") ||
      "guest_" + Math.random().toString(36).substring(7);

    const connectWebSocket = () => {
      try {
        const ws = new WebSocket(`${WS_URL}?token=${token}`);

        ws.onopen = () => {
          console.log("WebSocket connected");
          setConnectionStatus("connected");
          setSocket(ws);
          ws.send(
            JSON.stringify({
              type: "join_room",
              roomId: roomId,
            })
          );
        };

        ws.onclose = () => {
          console.log("WebSocket disconnected");
          setConnectionStatus("connecting");
          setSocket(null);
          // Attempt to reconnect after 3 seconds
          setTimeout(connectWebSocket, 3000);
        };

        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          setConnectionStatus("error");
          setErrorMessage("Failed to connect to the collaboration server");
        };
      } catch (error) {
        console.error("Failed to create WebSocket:", error);
        setConnectionStatus("error");
        setErrorMessage("Unable to establish connection");
      }
    };

    connectWebSocket();

    // Cleanup function
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [roomId]); // socket is managed within the effect, so we don't include it in dependencies

  if (connectionStatus === "error") {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Connection Failed
          </h2>
          <p className="text-gray-600 mb-4">{errorMessage}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!socket || connectionStatus === "connecting") {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Connecting to Room
          </h2>
          <p className="text-gray-600">
            Setting up your collaborative workspace...
          </p>
          <div className="mt-4 text-sm text-gray-500">Room ID: {roomId}</div>
        </div>
      </div>
    );
  }

  return <Canvas roomId={roomId} socket={socket} />;
}
