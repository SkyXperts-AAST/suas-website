"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const milestones = [
  { year: "2023", text: "SkyXperts founded", x: 140, y: 60 },
  { year: "2024–25", text: "Built our first drone and competed at ICMTC", x: 340, y: 190 },
  { year: "2025–26", text: "Built a small prototype multirotor to begin testing the mission", x: 140, y: 320 },
  { year: "2026", text: "Returned to ICMTC flying Storm — Best Mission Award, 3rd place overall", x: 340, y: 450 },
  { year: "2026", text: "Preparing Storm for SUAS 2026: Storm Response", x: 140, y: 580 },
];

function smoothPath(points: { x: number; y: number }[]) {
  if (points.length < 2) return "";
  let d = `M${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }
  return d;
}

const pathD = smoothPath(milestones);
const VIEW_W = 500;
const VIEW_H = 660;

export default function ScatteredJourney() {
  const pathRef = useRef<SVGPathElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const [progress, setProgress] = useState(0);
  const [dronePoint, setDronePoint] = useState({ x: milestones[0].x, y: milestones[0].y });

  useEffect(() => {
    if (pathRef.current) setPathLength(pathRef.current.getTotalLength());
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const wrapper = wrapperRef.current;
      const path = pathRef.current;
      if (!wrapper || !path || pathLength === 0) return;

      const rect = wrapper.getBoundingClientRect();
      const vh = window.innerHeight;
      const raw = (vh - rect.top) / (vh + rect.height);
      const clamped = Math.min(Math.max(raw, 0), 1);
      setProgress(clamped);

      const point = path.getPointAtLength(clamped * pathLength);
      setDronePoint({ x: point.x, y: point.y });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathLength]);

  return (
    <section className="bg-gray-50 px-6 py-16">
      <p className="mb-2 text-center text-xs font-medium uppercase tracking-wide text-gray-500">
        Our journey
      </p>
      <h2 className="mb-12 text-center text-2xl font-semibold text-gray-900">
        From first flight to Storm
      </h2>

      <div
        ref={wrapperRef}
        className="relative mx-auto"
        style={{ maxWidth: VIEW_W, aspectRatio: `${VIEW_W} / ${VIEW_H}` }}
      >
        <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="absolute inset-0 h-full w-full" fill="none">
          <defs>
            <mask id="reveal-mask">
              <path
                d={pathD}
                stroke="white"
                strokeWidth={20}
                strokeLinecap="round"
                strokeDasharray={pathLength}
                strokeDashoffset={pathLength * (1 - progress)}
              />
            </mask>
          </defs>
          <path
            ref={pathRef}
            d={pathD}
            stroke="#0A1A33"
            strokeWidth={2}
            strokeDasharray="2 10"
            strokeLinecap="round"
            mask="url(#reveal-mask)"
          />
        </svg>

        {milestones.map((m, i) => {
          const active = progress >= i / (milestones.length - 1) - 0.03;
          return (
            <div
              key={i}
              className={`absolute w-40 -translate-x-1/2 rounded-lg bg-white p-3 text-center shadow-sm transition-opacity duration-500 ${
                active ? "opacity-100" : "opacity-30"
              }`}
              style={{
  left: `${(m.x / VIEW_W) * 100}%`,
  top: `${(m.y / VIEW_H) * 100}%`,
  transform: "translate(-50%, -50%)",
}}
            >
              <p className="text-xs font-semibold text-[#0A1A33]">{m.year}</p>
              <p className="mt-1 text-xs text-gray-600">{m.text}</p>
            </div>
          );
        })}

        <div
          className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${(dronePoint.x / VIEW_W) * 100}%`,
            top: `${(dronePoint.y / VIEW_H) * 100}%`,
          }}
        >
          <Image src="/drone-nobackground.png" alt="" width={56} height={56} className="drop-shadow-md" />
        </div>
      </div>
    </section>
  );
}