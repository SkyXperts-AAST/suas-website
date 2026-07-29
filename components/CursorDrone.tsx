"use client";

import { useEffect, useState } from "react";
import { TbDrone } from "react-icons/tb";

// Embedded documents (the sponsorship proposal PDF) render in their own viewer
// and don't forward mousemove to this document, so the drone would freeze at
// the edge while the viewer drew its own cursor underneath — two cursors at
// once. Over these, the drone hides and globals.css restores the real cursor.
const EMBED_SELECTOR = "object, iframe, embed";

export default function CursorDrone() {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [overEmbed, setOverEmbed] = useState(false);

  useEffect(() => {
    const isEmbed = (target: EventTarget | null) =>
      target instanceof Element && target.closest(EMBED_SELECTOR) !== null;

    const handleMove = (e: MouseEvent) => {
      if (isEmbed(e.target)) {
        setOverEmbed(true);
        return;
      }
      setOverEmbed(false);
      setPos({ x: e.clientX, y: e.clientY });
    };

    // Backstop: entering the embed usually fires this once and then nothing
    // else, so it's the only signal that the pointer went in there at all.
    const handleOver = (e: MouseEvent) => {
      if (isEmbed(e.target)) setOverEmbed(true);
    };

    window.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseover", handleOver, true);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseover", handleOver, true);
    };
  }, []);

  if (!pos || overEmbed) return null;

  return (
    <div
      className="pointer-events-none fixed z-[60] hidden sm:block"
      style={{ left: pos.x, top: pos.y, transform: "translate(-50%, -50%)" }}
    >
      <TbDrone className="h-7 w-7 text-[#E31C1C] drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]" />
    </div>
  );
}