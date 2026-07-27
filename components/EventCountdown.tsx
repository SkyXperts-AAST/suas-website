"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const EVENT_DATE = new Date("2026-09-14T00:00:00");

function getTimeLeft() {
  const diff = EVENT_DATE.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

// Pre-reveal state, applied imperatively rather than rendered — see
// VehicleSpecs for why (avoids shipping invisible copy if hydration never
// happens). The countdown digits get their own, more dramatic reveal since
// they're the section's focal point.
const HIDDEN_CLASSES = ["opacity-0", "translate-y-3"];
const HIDDEN_UNIT_CLASSES = ["opacity-0", "translate-y-6", "scale-90"];

export default function EventCountdown() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const sectionRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const unitsRef = useRef<HTMLDivElement>(null);
  const outroRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTime(getTimeLeft());
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const node = sectionRef.current;
    const intro = introRef.current;
    const units = unitsRef.current;
    const outro = outroRef.current;
    if (!node || !intro || !units || !outro) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
      return;
    }

    intro.classList.add(...HIDDEN_CLASSES);
    units.classList.add(...HIDDEN_UNIT_CLASSES);
    outro.classList.add(...HIDDEN_CLASSES);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setRevealed(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const units = [
    { label: "Days", value: time.days },
    { label: "Hours", value: time.hours },
    { label: "Min", value: time.minutes },
    { label: "Sec", value: time.seconds },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-navy px-6 py-20 text-center md:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_50%_35%,rgba(227,28,28,0.14),transparent_65%)]"
      />

      <div
        ref={introRef}
        className={`relative transition-[opacity,transform] duration-700 ease-out ${
          revealed ? "translate-y-0 opacity-100" : ""
        }`}
      >
        <p className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
          Chapter 05 · Mission
        </p>
        <h2 className="mx-auto mt-3 max-w-2xl text-balance font-display text-3xl leading-[1.05] tracking-tight text-[#F5F5F7] sm:text-4xl">
          The mission ahead
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#F5F5F7]/70 sm:text-base">
          Every chapter of SkyXperts&apos; story has been leading here —
          Storm, ready to fly the Storm Response mission at SUAS 2026.
        </p>

        <p className="mt-10 font-display text-xs font-bold uppercase tracking-[0.2em] text-[#E31C1C]">
          SUAS 2026 · Sep 14–17 · Tulsa, Oklahoma
        </p>
      </div>

      {/* The countdown: the section's main point, so it gets the largest
          type on the page and its own dramatic, slightly-delayed reveal
          (scale + slide) instead of the gentler fade used for copy. */}
      <div
        ref={unitsRef}
        className={`relative mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-center gap-3 transition-[opacity,transform] delay-150 duration-700 ease-out sm:gap-5 ${
          revealed ? "translate-y-0 scale-100 opacity-100" : ""
        }`}
      >
        {units.map((u) => (
          <div
            key={u.label}
            className="flex min-w-[5.5rem] flex-1 flex-col items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-6 shadow-[0_0_40px_rgba(227,28,28,0.08)] sm:min-w-[7.5rem] sm:px-6 sm:py-8"
          >
            <span className="font-mono text-6xl font-bold leading-none tabular-nums text-[#F5F5F7] sm:text-7xl md:text-8xl">
              {mounted ? String(u.value).padStart(2, "0") : "00"}
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#F5F5F7]/50 sm:text-xs">
              {u.label}
            </span>
          </div>
        ))}
      </div>

      <div
        ref={outroRef}
        className={`relative transition-[opacity,transform] delay-300 duration-700 ease-out ${
          revealed ? "translate-y-0 opacity-100" : ""
        }`}
      >
        <div className="mx-auto mt-12 flex max-w-md flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/build-log"
            className="rounded-full bg-white px-5 py-2 text-sm font-medium text-navy transition hover:bg-white/90"
          >
            Follow the build log
          </Link>
          <Link
            href="/sponsorships"
            className="rounded-full border-2 border-white px-5 py-2 text-sm font-medium text-white transition hover:bg-white hover:text-navy"
          >
            Support the mission
          </Link>
        </div>
      </div>
    </section>
  );
}
