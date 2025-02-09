"use client";

import { Canvas } from "@/components/Canvas";
import { initDraw } from "@/drawgame";
import { useEffect, useRef } from "react";

export default async function CanvasPage({ params }: {
  params: {
  roomId: string
  }
}) {
  const roomId = (await params).roomId;
  console.log(roomId)

  return <Canvas roomId={roomId} />
}
