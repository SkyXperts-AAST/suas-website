"use client";

import { useEffect, useRef, useState } from "react";
import { TbDrone } from "react-icons/tb";

export default function HeroDroneExperience() {
  const [ended, setEnded] = useState(false);
  const [active, setActive] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  const handleVideoEnded = () => {
    setEnded(true);
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const landingSpot = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height * 0.75,
      };
      current.current = landingSpot;
      target.current = landingSpot;
      setPos(landingSpot);
    }
    setActive(true);
  };

  useEffect(() => {
    if (!active) return;
    const handleMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMove);

    let frame: number;
    const animate = () => {
      current.current.x += (target.current.x - current.current.x) * 0.08;
      current.current.y += (target.current.y - current.current.y) * 0.08;
      setPos({ x: current.current.x, y: current.current.y });
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(frame);
    };
  }, [active]);

  return (
    <>
      <div
        ref={containerRef}
        className={`absolute inset-0 z-10 bg-[#0A1A33] transition-opacity duration-700 ${
          ended ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <video
          className="h-full w-full object-cover"
          src="/landing.mp4"
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnded}
        />
      </div>

      {active && (
        <div
          className="pointer-events-none fixed z-50 hidden sm:block"
          style={{
            left: pos.x,
            top: pos.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          <TbDrone className="h-8 w-8 text-[#0A1A33] drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
        </div>
      )}
    </>
  );
}