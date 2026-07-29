"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const milestones = [
  { year: "2023", text: "SkyXperts founded", x: 170, y: 60 },
  { year: "2024–25", text: "Built our first drone and won 2nd place at ICMTC", x: 510, y: 190 },
  { year: "2025–26", text: "Built a small prototype multirotor to begin testing the mission", x: 170, y: 320 },
  { year: "2026", text: "Returned to ICMTC flying Storm — Best Mission Award, 3rd place overall", x: 510, y: 450 },
  { year: "2026", text: "Preparing Storm for SUAS 2026: Storm Response", x: 170, y: 580 },
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
const VIEW_W = 680;
const VIEW_H = 660;

function MobileJourney({ progress }: { progress: number }) {
  return (
    <ol className="relative mx-auto mt-10 max-w-md space-y-4 px-1 md:hidden">
      <span
        aria-hidden="true"
        className="absolute bottom-3 left-[1.15rem] top-3 w-px bg-white/15"
      />
      <span
        aria-hidden="true"
        className="absolute left-[1.15rem] top-3 w-px origin-top bg-accent/80 transition-[height] duration-300"
        style={{
          height: `calc(${Math.min(Math.max(progress, 0), 1) * 100}% - 0.75rem)`,
        }}
      />

      {milestones.map((m, i) => {
        const active = progress >= i / (milestones.length - 1) - 0.03;

        return (
          <li key={`${m.year}-${i}`} className="relative flex gap-4 pl-1">
            <span
              aria-hidden="true"
              className={`relative z-10 mt-5 h-3 w-3 shrink-0 rounded-full border-2 transition-colors duration-300 ${
                active
                  ? "border-accent bg-accent shadow-[0_0_12px_rgba(227,28,28,0.55)]"
                  : "border-white/30 bg-navy"
              }`}
            />
            <div
              className={`flex-1 rounded-xl border p-4 transition-all duration-500 ${
                active
                  ? "border-accent/40 bg-accent/[0.08] opacity-100 shadow-[0_0_30px_-8px_rgba(227,28,28,0.5)]"
                  : "border-white/10 bg-white/[0.04] opacity-55"
              }`}
            >
              <p
                className={`font-display text-sm font-bold uppercase tracking-[0.1em] ${
                  active ? "text-accent" : "text-white/50"
                }`}
              >
                {m.year}
              </p>
              <p className="mt-1.5 text-sm leading-snug text-white/80">{m.text}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default function ScatteredJourney() {
  const pathRef = useRef<SVGPathElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const [progress, setProgress] = useState(0);
  const [dronePoint, setDronePoint] = useState({
    x: milestones[0].x,
    y: milestones[0].y,
  });

  useEffect(() => {
    if (pathRef.current) setPathLength(pathRef.current.getTotalLength());
  }, []);

  useEffect(() => {
    // Scroll events can fire far more often than the screen repaints
    // (especially with trackpad/inertial scrolling), and each one here
    // triggers a state update that re-renders the mask, path, and every
    // milestone card. Without throttling to one update per frame, those
    // re-renders queue up faster than React can flush them, so the drone
    // visibly falls behind the scroll position — this keeps it locked to
    // the actual scroll on every frame, same technique used elsewhere in
    // the codebase for scroll-linked animation (see DroneAssemblyScroll).
    let rafId = 0;

    const sync = () => {
      const wrapper = wrapperRef.current;
      const path = pathRef.current;
      if (!wrapper || pathLength === 0) return;

      const rect = wrapper.getBoundingClientRect();
      const vh = window.innerHeight;
      // Reach full progress while the wrapper's bottom edge still has a
      // margin of viewport below it, not exactly when the whole element has
      // scrolled past the top. Mapping over the full (vh + rect.height)
      // range means the last milestone — which sits ~88% of the way down
      // the wrapper, not at its very bottom edge — crosses off-screen while
      // progress is still short of 1, so it scrolls away dim, never
      // reaching its "active" state, and the drone never visually arrives.
      const endBuffer = vh * 0.3;
      const raw = (vh - rect.top) / (vh + rect.height - endBuffer);
      const clamped = Math.min(Math.max(raw, 0), 1);
      setProgress(clamped);

      if (path) {
        const point = path.getPointAtLength(clamped * pathLength);
        setDronePoint({ x: point.x, y: point.y });
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(sync);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    sync();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathLength]);

  return (
    <div ref={wrapperRef}>
      <MobileJourney progress={progress} />

      <div
        className="relative mx-auto mt-16 hidden w-full max-w-[620px] sm:max-w-[760px] md:block lg:max-w-[960px]"
        style={{ aspectRatio: `${VIEW_W} / ${VIEW_H}` }}
      >
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="absolute inset-0 h-full w-full"
          fill="none"
        >
          <defs>
            <mask id="reveal-mask">
              <path
                d={pathD}
                stroke="white"
                strokeWidth={26}
                strokeLinecap="round"
                strokeDasharray={pathLength}
                strokeDashoffset={pathLength * (1 - progress)}
              />
            </mask>
          </defs>
          <path
            d={pathD}
            stroke="white"
            strokeOpacity={0.15}
            strokeWidth={2}
            strokeDasharray="2 10"
            strokeLinecap="round"
          />
          <path
            ref={pathRef}
            d={pathD}
            stroke="#E31C1C"
            strokeOpacity={0.75}
            strokeWidth={2.5}
            strokeLinecap="round"
            mask="url(#reveal-mask)"
          />
        </svg>

        {milestones.map((m, i) => {
          const active = progress >= i / (milestones.length - 1) - 0.03;
          return (
            <div
              key={i}
              className={`absolute w-48 rounded-xl border p-4 text-center backdrop-blur-sm transition-all duration-500 sm:w-52 ${
                active
                  ? "scale-100 border-accent/40 bg-accent/[0.08] opacity-100 shadow-[0_0_30px_-8px_rgba(227,28,28,0.5)]"
                  : "scale-95 border-white/10 bg-white/[0.04] opacity-40"
              }`}
              style={{
                left: `${(m.x / VIEW_W) * 100}%`,
                top: `${(m.y / VIEW_H) * 100}%`,
                transform: `translate(-50%, -50%) scale(${active ? 1 : 0.95})`,
              }}
            >
              <p
                className={`font-display text-sm font-bold uppercase tracking-[0.1em] ${
                  active ? "text-accent" : "text-white/50"
                }`}
              >
                {m.year}
              </p>
              <p className="mt-1.5 text-sm leading-snug text-white/80">{m.text}</p>
            </div>
          );
        })}

        <div
          className="absolute z-20 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_18px_rgba(227,28,28,0.65)]"
          style={{
            left: `${(dronePoint.x / VIEW_W) * 100}%`,
            top: `${(dronePoint.y / VIEW_H) * 100}%`,
          }}
        >
          <Image
            src="/drone-nobackground.png"
            alt=""
            width={80}
            height={80}
            className="drop-shadow-md"
          />
        </div>
      </div>
    </div>
  );
}
