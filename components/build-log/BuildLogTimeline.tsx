"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { getTeamTheme } from "@/lib/build-log/themes";
import type { BuildLogEntry, SubTeamSlug } from "@/lib/build-log/types";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

type BuildLogTimelineProps = {
  entries: BuildLogEntry[];
  teamSlug: SubTeamSlug;
};

export default function BuildLogTimeline({
  entries,
  teamSlug,
}: BuildLogTimelineProps) {
  const theme = getTeamTheme(teamSlug);
  const [activeEntryId, setActiveEntryId] = useState(entries[0]?.id ?? "");
  const entryRefs = useRef(new Map<string, HTMLElement>());
  const ratiosRef = useRef(new Map<string, number>());

  const registerEntry = useCallback(
    (id: string, node: HTMLElement | null) => {
      if (node) {
        entryRefs.current.set(id, node);
      } else {
        entryRefs.current.delete(id);
      }
    },
    [],
  );

  useEffect(() => {
    if (entries.length === 0) {
      return;
    }

    const pickActiveEntry = () => {
      let bestId = entries[0]?.id ?? "";
      let bestRatio = -1;

      for (const entry of entries) {
        const ratio = ratiosRef.current.get(entry.id) ?? 0;
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestId = entry.id;
        }
      }

      if (bestId) {
        setActiveEntryId(bestId);
      }
    };

    const observer = new IntersectionObserver(
      (observed) => {
        for (const record of observed) {
          const id = record.target.getAttribute("data-entry-id");
          if (!id) {
            continue;
          }

          ratiosRef.current.set(id, record.intersectionRatio);
        }

        pickActiveEntry();
      },
      {
        threshold: [0, 0.15, 0.35, 0.55, 0.75, 1],
        rootMargin: "-12% 0px -12% 0px",
      },
    );

    for (const node of entryRefs.current.values()) {
      observer.observe(node);
    }

    return () => observer.disconnect();
  }, [entries]);

  if (entries.length === 0) {
    return (
      <p className="rounded-2xl border border-white/10 bg-white/5 px-6 py-10 text-center text-offwhite/70">
        No build log entries yet. Check back soon.
      </p>
    );
  }

  return (
    <div className="relative isolate">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        {entries.map((entry) => {
          const isActive = activeEntryId === entry.id;

          return (
            <div
              key={entry.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out motion-reduce:transition-none ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={entry.image}
                alt=""
                fill
                sizes="100vw"
                className="scale-110 object-cover blur-3xl"
                priority={entry.id === entries[0]?.id}
              />
              <div className="absolute inset-0 bg-navy/82" />
              <div
                className={`absolute inset-0 bg-gradient-to-br ${theme.gradient}`}
              />
            </div>
          );
        })}
      </div>

      <ol className="relative z-10 space-y-16 md:space-y-24">
        {entries.map((entry, index) => {
          const isActive = activeEntryId === entry.id;

          return (
            <li
              key={entry.id}
              ref={(node) => registerEntry(entry.id, node)}
              data-entry-id={entry.id}
              className="relative"
            >
              <article
                className={`overflow-hidden rounded-[1.75rem] border bg-navy/55 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all duration-500 motion-reduce:transition-none ${
                  isActive
                    ? `border-white/20 ${theme.glow}`
                    : "border-white/10 opacity-95"
                }`}
              >
                <div className="border-b border-white/10 px-6 py-5 md:px-10 md:py-6">
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <time
                      dateTime={entry.date}
                      className={`text-lg font-bold uppercase tracking-[0.14em] md:text-2xl ${theme.date}`}
                    >
                      {formatDate(entry.date)}
                    </time>
                    <span className="text-sm font-semibold uppercase tracking-[0.18em] text-offwhite/40">
                      Entry #{String(entries.length - index).padStart(2, "0")}
                    </span>
                  </div>
                </div>

                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src={entry.image}
                    alt={entry.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 1152px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/10 to-transparent" />
                </div>

                <div className="space-y-5 px-6 py-8 md:space-y-6 md:px-10 md:py-10">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <h3 className="max-w-3xl text-3xl font-semibold leading-tight text-offwhite md:text-4xl">
                      {entry.title}
                    </h3>
                    <span
                      className={`rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] ${theme.tag}`}
                    >
                      Update
                    </span>
                  </div>

                  <p className="max-w-4xl text-lg leading-9 text-offwhite/78 md:text-xl md:leading-9">
                    {entry.summary}
                  </p>

                  {entry.tags && entry.tags.length > 0 && (
                    <ul className="flex flex-wrap gap-2 pt-1">
                      {entry.tags.map((tag) => (
                        <li
                          key={tag}
                          className={`rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] ${theme.tag}`}
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
