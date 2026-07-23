"use client";

import { useEffect, useRef, useState } from "react";
import { TbDrone } from "react-icons/tb";

export default function CursorDrone() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMove);

    let frame: number;
    const animate = () => {
      current.current.x += (target.current.x - current.current.x) * 0.1;
      current.current.y += (target.current.y - current.current.y) * 0.1;
      setPos({ x: current.current.x, y: current.current.y });
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
        id="cursor-drone-icon"
className="pointer-events-none fixed z-50 hidden sm:block"        style={{
        left: pos.x,
        top: pos.y,
        transform: "translate(-50%, -50%)",
      }}
    >
<TbDrone className="h-8 w-8 text-[#0A1A33] drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
    </div>);
}