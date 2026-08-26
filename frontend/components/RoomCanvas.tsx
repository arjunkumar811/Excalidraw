"use client";

import { WS_URL } from "@/config";
import { useEffect, useState, useRef } from "react";
import { Canvas } from "./Canvas";
import { Loader2, AlertCircle } from "lucide-react";

export function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "error"
  >("connecting");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let reconnectTimer: NodeJS.Timeout;

    const connect = () => {
      try {
        const ws = new WebSocket(`${WS_URL}`);
        wsRef.current = ws;

        ws.onopen = () => {
          setConnectionStatus("connected");
          setSocket(ws);
        };

        ws.onclose = () => {
          setConnectionStatus("connecting");
          setSocket(null);
          reconnectTimer = setTimeout(connect, 3000);
        };

        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          setConnectionStatus("error");
          setErrorMessage("Failed to connect to the collaboration server");
        };
      } catch (error) {
        console.error("Failed to setup WebSocket:", error);
        setConnectionStatus("error");
        setErrorMessage("Unable to establish connection");
      }
    };

    connect();

    return () => {
      clearTimeout(reconnectTimer);
      if (wsRef.current) {
        // Remove listeners so it doesn't trigger onclose reconnects
        wsRef.current.onclose = null;
        wsRef.current.onerror = null;
        wsRef.current.onopen = null;
        wsRef.current.close();
      }
    };
  }, [roomId]);

  if (connectionStatus === "error") {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-900 bg-dot-pattern transition-colors">
        <div className="text-center bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 p-8 rounded-2xl shadow-lg animate-in fade-in zoom-in-95 duration-300">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Connection Failed
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">{errorMessage}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-700 active:scale-95 transition-all shadow-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!socket || connectionStatus === "connecting") {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-900 bg-dot-pattern transition-colors">
        <div className="text-center bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 p-8 rounded-2xl shadow-lg animate-in fade-in zoom-in-95 duration-300">
          <Loader2 className="w-12 h-12 text-violet-600 mx-auto mb-4 animate-spin" />
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Connecting to Room
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Setting up your collaborative workspace...
          </p>
          <div className="mt-6 inline-flex items-center justify-center px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-xs font-medium text-slate-500 dark:text-slate-400 font-mono">
            Room: {roomId.slice(-6)}
          </div>
        </div>
      </div>
    );
  }

  return <Canvas roomId={roomId} socket={socket} />;
}
