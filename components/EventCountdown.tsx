"use client";

import { useEffect, useState } from "react";
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

export default function EventCountdown() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setMounted(true);
    setTime(getTimeLeft());
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!mounted) return null;

  const units = [
    { label: "Days", value: time.days },
    { label: "Hours", value: time.hours },
    { label: "Min", value: time.minutes },
    { label: "Sec", value: time.seconds },
  ];

  return (
    <section className="bg-navy px-6 py-20 text-center md:py-28">
      <p className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
        Chapter 06 · Mission
      </p>
      <h2 className="mx-auto mt-3 max-w-2xl text-balance font-display text-4xl leading-[1.05] tracking-tight text-[#F5F5F7] sm:text-5xl">
        The mission ahead
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#F5F5F7]/70 sm:text-base">
        Every chapter of SkyXperts&apos; story has been leading here —
        Storm, ready to fly the Storm Response mission at SUAS 2026.
      </p>

      <p className="mt-10 font-display text-xs font-bold uppercase tracking-[0.16em] text-[#E31C1C]">
        SUAS 2026 · Sep 14–17 · Tulsa, Oklahoma
      </p>
      <div className="mt-4 flex justify-center gap-6">
        {units.map((u) => (
          <div key={u.label} className="flex flex-col items-center">
            <span className="font-display text-2xl font-bold text-[#F5F5F7] tabular-nums">
              {String(u.value).padStart(2, "0")}
            </span>
            <span className="text-xs text-[#F5F5F7]/60">{u.label}</span>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-10 flex max-w-md flex-col items-center justify-center gap-4 sm:flex-row">
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
    </section>
  );
}