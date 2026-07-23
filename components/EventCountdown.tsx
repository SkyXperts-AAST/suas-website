"use client";

import { useEffect, useState } from "react";

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
    <section className="border-b border-gray-200 bg-white px-6 py-8 text-center">
      <p className="mb-4 text-xs font-medium uppercase tracking-wide text-gray-500">
        SUAS 2026 · Sep 14–17 · Tulsa, Oklahoma
      </p>
      <div className="flex justify-center gap-6">
        {units.map((u) => (
          <div key={u.label} className="flex flex-col items-center">
            <span className="text-2xl font-semibold text-[#0A1A33] tabular-nums">
              {String(u.value).padStart(2, "0")}
            </span>
            <span className="text-xs text-gray-500">{u.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}