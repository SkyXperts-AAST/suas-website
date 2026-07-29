"use client";

import { useEffect, useState } from "react";
import { TbDrone } from "react-icons/tb";

export default function CursorDrone() {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  if (!pos) return null;

  return (
    <div
      className="pointer-events-none fixed z-[60] hidden sm:block"
      style={{ left: pos.x, top: pos.y, transform: "translate(-50%, -50%)" }}
    >
      <TbDrone className="h-7 w-7 text-[#E31C1C] drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]" />
    </div>
  );
}