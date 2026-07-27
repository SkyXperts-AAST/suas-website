"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import BuildLogEntryBody from "@/components/build-log/BuildLogEntryBody";
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

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      className={`h-4 w-4 shrink-0 text-offwhite/50 transition-transform duration-200 ${
        expanded ? "rotate-180" : ""
      }`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export default function BuildLogTimeline({
  entries,
  teamSlug,
}: BuildLogTimelineProps) {
  const theme = getTeamTheme(teamSlug);
  const latestEntryId = entries[0]?.id ?? "";
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(latestEntryId ? [latestEntryId] : []),
  );
  const [activeEntryId, setActiveEntryId] = useState(latestEntryId);
  const entryRefs = useRef(new Map<string, HTMLElement>());
  const ratiosRef = useRef(new Map<string, number>());

  useEffect(() => {
    setExpandedIds(new Set(latestEntryId ? [latestEntryId] : []));
    setActiveEntryId(latestEntryId);
  }, [latestEntryId, teamSlug]);

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

  const toggleEntry = (id: string) => {
    if (id === latestEntryId) {
      return;
    }

    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
    setActiveEntryId(id);
  };

  const allExpanded =
    entries.length > 0 && entries.every((entry) => expandedIds.has(entry.id));

  const toggleAllEntries = () => {
    if (allExpanded) {
      setExpandedIds(new Set(latestEntryId ? [latestEntryId] : []));
      setActiveEntryId(latestEntryId);
      return;
    }

    setExpandedIds(new Set(entries.map((entry) => entry.id)));
  };

  useEffect(() => {
    if (entries.length === 0) {
      return;
    }

    const pickActiveEntry = () => {
      let bestId = latestEntryId;
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
  }, [entries, latestEntryId]);

  if (entries.length === 0) {
    return (
      <p className="border border-white/10 bg-white/[0.03] px-6 py-10 text-center text-offwhite/70">
        No build log entries yet. Check back soon.
      </p>
    );
  }

  return (
    <div className="relative isolate -mx-4 -mb-10 min-h-[calc(100dvh-12rem)] md:-mx-5 md:-mb-16">
      <button
        type="button"
        onClick={toggleAllEntries}
        aria-expanded={allExpanded}
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 border bg-[#0a1628]/92 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-offwhite shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent md:bottom-8 md:right-8 md:text-[0.8125rem] ${theme.tag}`}
      >
        <svg
          className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${
            allExpanded ? "" : "rotate-180"
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="square"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
        {allExpanded ? "Collapse all" : "Expand all"}
      </button>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-1/2 z-0 w-screen min-h-full -translate-x-1/2 overflow-hidden"
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
                priority={entry.id === latestEntryId}
              />
              <div className="absolute inset-0 bg-navy/82" />
              <div
                className={`absolute inset-0 bg-gradient-to-br ${theme.gradient}`}
              />
            </div>
          );
        })}
        <div className="absolute inset-x-0 top-0 z-[1] h-32 bg-gradient-to-b from-[#0a1628] via-[#0a1628]/80 to-transparent md:h-40" />
      </div>

      <ol className="relative z-10 mx-4 ml-8 space-y-8 pb-10 md:mx-5 md:ml-10 md:space-y-10 md:pb-16">
        <span
          aria-hidden="true"
          className={`absolute bottom-4 left-0 top-4 w-px bg-gradient-to-b ${theme.timelineLine}`}
        />

        {entries.map((entry, index) => {
          const isLatest = entry.id === latestEntryId;
          const isExpanded = expandedIds.has(entry.id);
          const isActive = activeEntryId === entry.id;
          const entryNumber = String(entries.length - index).padStart(2, "0");

          return (
            <li
              key={entry.id}
              ref={(node) => registerEntry(entry.id, node)}
              data-entry-id={entry.id}
              className="relative pl-8 md:pl-10"
            >
              <span
                aria-hidden="true"
                className={`build-log-dot absolute -left-[0.4rem] top-8 h-4 w-4 border-2 md:-left-[0.45rem] md:top-9 md:h-[1.125rem] md:w-[1.125rem] ${theme.timelineDot} ${
                  isExpanded || isLatest ? theme.timelineDotGlow : ""
                }`}
              />

              <article
                className={`overflow-hidden border bg-[#0a1628]/90 transition-all duration-300 motion-reduce:transition-none ${
                  isActive
                    ? `border-white/20 ${theme.glow}`
                    : "border-white/10 opacity-95"
                }`}
              >
                <div className="border-b border-white/10 px-5 py-5 md:px-8 md:py-6">
                  <time
                    dateTime={entry.date}
                    className={`text-sm font-semibold uppercase tracking-[0.08em] md:text-base ${theme.date}`}
                  >
                    {formatDate(entry.date)}
                  </time>

                  {isLatest ? (
                    <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
                      <h3 className="font-display text-xl font-bold leading-snug text-offwhite md:text-2xl md:leading-tight">
                        {entry.title}
                      </h3>
                      <span className="text-xs font-black uppercase tracking-[0.16em] text-offwhite/40">
                        Latest · #{entryNumber}
                      </span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => toggleEntry(entry.id)}
                      aria-expanded={isExpanded}
                      className="mt-4 flex w-full items-start justify-between gap-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
                    >
                      <div className="min-w-0 flex-1">
                        <h3 className="font-display text-lg font-bold leading-snug text-offwhite md:text-xl md:leading-tight">
                          {entry.title}
                        </h3>
                        {!isExpanded && (
                          <p className="mt-2 line-clamp-2 font-sans text-[0.9375rem] font-normal leading-7 text-offwhite/72 md:text-base md:leading-8">
                            {entry.summary}
                          </p>
                        )}
                      </div>
                      <div className="flex shrink-0 items-center gap-3 pt-1">
                        <span className="text-xs font-black uppercase tracking-[0.16em] text-offwhite/40">
                          #{entryNumber}
                        </span>
                        <ChevronIcon expanded={isExpanded} />
                      </div>
                    </button>
                  )}
                </div>

                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-in-out motion-reduce:transition-none ${
                    isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="relative h-52 w-full md:h-64 lg:h-72">
                      <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black_0%,black_52%,rgba(0,0,0,0.6)_72%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_52%,rgba(0,0,0,0.6)_72%,transparent_100%)]">
                        <Image
                          src={entry.image}
                          alt={entry.imageAlt}
                          fill
                          sizes="(max-width: 768px) 100vw, 1280px"
                          className="object-cover object-center"
                        />
                      </div>
                    </div>

                    <div className="space-y-5 px-5 pb-6 pt-2 md:space-y-6 md:px-8 md:pb-8 md:pt-3">
                      <span
                        className={`inline-block border px-2 py-0.5 text-[0.625rem] font-black uppercase tracking-[0.14em] ${theme.tag}`}
                      >
                        {isLatest ? "Latest update" : "Update"}
                      </span>

                      {!isLatest && <h3 className="sr-only">{entry.title}</h3>}

                      <BuildLogEntryBody blocks={entry.body} summary={entry.summary} />

                      {entry.tags && entry.tags.length > 0 && (
                        <ul className="flex flex-wrap gap-1.5 pt-1">
                          {entry.tags.map((tag) => (
                            <li
                              key={tag}
                              className={`border px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-[0.08em] ${theme.tag}`}
                            >
                              {tag}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
