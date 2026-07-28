"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import BuildLogEntryBody from "@/components/build-log/BuildLogEntryBody";
import TeamIcon from "@/components/build-log/TeamIcon";
import { buildLogImagePositionStyle } from "@/lib/build-log/imagePosition";
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

function formatShortDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

type BuildLogTimelineProps = {
  entries: BuildLogEntry[];
  teamSlug: SubTeamSlug;
};

function scrollElementToCenter(
  container: HTMLElement,
  element: HTMLElement,
  behavior: ScrollBehavior = "smooth",
) {
  const containerRect = container.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();
  const elementCenter =
    container.scrollLeft + (elementRect.left - containerRect.left) + elementRect.width / 2;

  container.scrollTo({
    left: elementCenter - container.clientWidth / 2,
    behavior,
  });
}

function findClosestSlotId(
  container: HTMLElement,
  slotRefs: Map<string, HTMLElement>,
) {
  const containerRect = container.getBoundingClientRect();
  const containerCenterX = containerRect.left + containerRect.width / 2;

  let closestId = "";
  let closestDistance = Infinity;

  for (const [id, node] of slotRefs.entries()) {
    const rect = node.getBoundingClientRect();
    const distance = Math.abs(rect.left + rect.width / 2 - containerCenterX);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestId = id;
    }
  }

  return closestId;
}

function isSlotCentered(
  container: HTMLElement,
  slot: HTMLElement,
  threshold = 12,
) {
  const containerRect = container.getBoundingClientRect();
  const slotRect = slot.getBoundingClientRect();
  const containerCenterX = containerRect.left + containerRect.width / 2;
  const slotCenterX = slotRect.left + slotRect.width / 2;

  return Math.abs(slotCenterX - containerCenterX) <= threshold;
}

type FeaturedEntryProps = {
  entry: BuildLogEntry;
  isLatest: boolean;
  theme: ReturnType<typeof getTeamTheme>;
  canGoNewer: boolean;
  canGoOlder: boolean;
  onGoNewer: () => void;
  onGoOlder: () => void;
};

function NavArrow({
  direction,
  disabled,
  onClick,
  label,
}: {
  direction: "left" | "right";
  disabled: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-7 w-7 shrink-0 items-center justify-center border border-white/15 bg-[#0a1628]/90 text-offwhite transition-colors hover:border-white/30 hover:bg-white/[0.06] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:border-white/5 disabled:text-offwhite/20 disabled:hover:bg-[#0a1628]/90 sm:h-9 sm:w-9 md:h-10 md:w-10"
    >
      <svg
        className="h-3.5 w-3.5 sm:h-4 sm:w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="square"
        aria-hidden="true"
      >
        {direction === "left" ? <path d="M15 6 9 12l6 6" /> : <path d="m9 6 6 6-6 6" />}
      </svg>
    </button>
  );
}

function FeaturedEntry({
  entry,
  isLatest,
  theme,
  canGoNewer,
  canGoOlder,
  onGoNewer,
  onGoOlder,
}: FeaturedEntryProps) {
  return (
    <article className="build-log-featured build-log-article overflow-hidden rounded-xl border border-white/20 bg-[#0a1628]/90 shadow-[0_12px_40px_rgba(0,0,0,0.35)] sm:rounded-none">
      <header className="build-log-article-header mx-auto max-w-4xl border-b border-white/10 px-4 py-8 md:px-4 md:py-10">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span
            className={`inline-block border px-2.5 py-1 text-[0.625rem] font-black uppercase tracking-[0.12em] sm:text-[0.625rem] sm:tracking-[0.14em] ${theme.tag}`}
          >
            {isLatest ? "Latest update" : "Update"}
          </span>
          <time
            dateTime={entry.date}
            className={`text-xs font-semibold uppercase tracking-[0.1em] sm:tracking-[0.12em] md:text-sm ${theme.date}`}
          >
            <span className="md:hidden">{formatShortDate(entry.date)}</span>
            <span className="hidden md:inline">{formatDate(entry.date)}</span>
          </time>
        </div>

        <h1 className="mt-5 font-display text-[1.625rem] font-bold leading-[1.12] tracking-tight text-offwhite sm:mt-5 sm:text-3xl md:mt-6 md:text-4xl md:leading-[1.06] lg:text-[2.75rem]">
          {entry.title}
        </h1>

        <p className="build-log-article-deck mt-5 max-w-[36rem] text-[0.9375rem] leading-7 text-offwhite/78 sm:text-lg sm:leading-8 md:mt-6 md:text-xl md:leading-9">
          {entry.summary}
        </p>

        <div className="mt-6 flex w-full items-center justify-between gap-2 sm:mt-7 sm:w-auto sm:justify-start md:mt-8 md:gap-3">
          <NavArrow
            direction="left"
            disabled={!canGoNewer}
            onClick={onGoNewer}
            label="Newer update"
          />
          <span className="min-w-0 flex-1 truncate text-center text-[0.5625rem] font-black uppercase tracking-[0.08em] text-offwhite/40 sm:min-w-[5.5rem] sm:flex-none sm:text-xs sm:tracking-[0.12em]">
            {isLatest
              ? `Latest · ${formatShortDate(entry.date)}`
              : formatShortDate(entry.date)}
          </span>
          <NavArrow
            direction="right"
            disabled={!canGoOlder}
            onClick={onGoOlder}
            label="Older update"
          />
        </div>
      </header>

      <figure className="build-log-article-hero mx-auto w-full max-w-5xl px-4 py-8 md:px-4 md:py-10">
        <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-white/10 md:rounded-xl">
          <Image
            src={entry.image}
            alt={entry.imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 896px"
            className="object-cover"
            style={buildLogImagePositionStyle(entry.imagePosition)}
            priority
          />
        </div>
        <figcaption className="mt-3 text-center text-sm leading-relaxed text-offwhite/55 md:text-[0.9375rem]">
          {entry.imageAlt}
        </figcaption>
      </figure>

      <div className="build-log-article-body mx-auto max-w-4xl px-4 pb-10 md:px-4 md:pb-10 lg:pb-12">
        <BuildLogEntryBody blocks={entry.body} summary={entry.summary} />
      </div>

      {entry.tags && entry.tags.length > 0 ? (
        <footer className="build-log-article-footer mx-auto max-w-4xl border-t border-white/10 px-4 py-7 md:px-4 md:py-7">
          <p className="text-[0.625rem] font-black uppercase tracking-[0.16em] text-offwhite/45">
            Topics
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {entry.tags.map((tag) => (
              <li
                key={tag}
                className={`border px-2.5 py-1 text-[0.625rem] font-bold uppercase tracking-[0.08em] ${theme.tag}`}
              >
                {tag}
              </li>
            ))}
          </ul>
        </footer>
      ) : null}
    </article>
  );
}

type TimelineUpdateNodeProps = {
  entry: BuildLogEntry;
  teamSlug: SubTeamSlug;
  theme: ReturnType<typeof getTeamTheme>;
  isSelected: boolean;
  isLatest: boolean;
  onSelect: () => void;
  shouldIgnoreClick: () => boolean;
};

function TimelineUpdateNode({
  entry,
  teamSlug,
  theme,
  isSelected,
  isLatest,
  onSelect,
  shouldIgnoreClick,
}: TimelineUpdateNodeProps) {
  const handleClick = () => {
    if (shouldIgnoreClick()) {
      return;
    }

    onSelect();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={(event) => {
        event.stopPropagation();
        handleClick();
      }}
      onKeyDown={handleKeyDown}
      aria-current={isSelected ? "true" : undefined}
      className={`group relative flex w-full max-w-[13.25rem] cursor-pointer flex-col items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628] sm:max-w-[16rem] md:max-w-[18rem] ${
        isSelected ? "z-10" : "z-0"
      }`}
    >
      <div
        className={`w-full origin-bottom transition-all duration-300 ease-out motion-reduce:transition-none max-sm:scale-100 ${
          isSelected
            ? "scale-[1.05] opacity-100"
            : "scale-[0.97] opacity-75 group-hover:scale-[0.99] group-hover:opacity-90 max-sm:group-hover:scale-100"
        }`}
      >
        <div
          className={`build-log-timeline-card min-h-[13rem] border p-3 text-left transition-colors duration-300 motion-reduce:transition-none sm:min-h-[14.75rem] sm:p-3 md:min-h-[15.5rem] md:p-4 ${
            isSelected
              ? `border-accent/70 bg-accent/10 shadow-[0_0_28px_rgba(227,28,28,0.22)] ring-2 max-sm:ring-1 ${theme.ring}`
              : `border-white/10 bg-[#0a1628]/88 ${theme.cardHover}`
          }`}
        >
          <div className="flex h-full flex-col space-y-2.5 md:space-y-3">
            <div className="relative h-14 w-full shrink-0 overflow-hidden border border-white/10 sm:h-16 md:h-[4.5rem]">
              <Image
                src={entry.image}
                alt=""
                fill
                sizes="(max-width: 768px) 240px, 288px"
                className="object-cover"
                style={buildLogImagePositionStyle(entry.imagePosition)}
              />
            </div>

            <div className="flex items-start gap-2.5 md:gap-3">
              <TeamIcon
                slug={teamSlug}
                className={`h-7 w-7 shrink-0 sm:h-8 sm:w-8 md:h-9 md:w-9 ${theme.iconText} ${
                  isSelected ? "opacity-100" : "opacity-85"
                }`}
              />
              <div className="min-w-0 flex-1">
                <p
                  className={`text-[0.5625rem] font-black uppercase tracking-[0.12em] sm:text-[0.625rem] sm:tracking-[0.14em] md:text-xs ${
                    isSelected ? theme.date : "text-offwhite/50"
                  }`}
                >
                  {formatShortDate(entry.date)}
                </p>
                <p
                  className={`mt-0.5 line-clamp-2 font-display text-xs font-bold leading-snug sm:text-sm md:text-base ${
                    isSelected ? "text-offwhite" : "text-offwhite/80"
                  }`}
                >
                  {entry.title}
                </p>
              </div>
            </div>

            <p
              className={`hidden line-clamp-2 font-sans text-sm leading-6 sm:line-clamp-3 sm:block md:text-[0.9375rem] md:leading-7 ${
                isSelected ? "text-offwhite/75" : "text-offwhite/60"
              }`}
            >
              {entry.summary}
            </p>
          </div>
        </div>

        <p
          className={`build-log-timeline-slot-label mt-2 text-center text-[0.5625rem] font-black uppercase tracking-[0.14em] md:text-[0.625rem] ${
            isSelected ? "text-offwhite/70" : "text-offwhite/40"
          }`}
        >
          {isLatest ? `Latest · ${formatShortDate(entry.date)}` : formatShortDate(entry.date)}
        </p>
      </div>

      <div className="build-log-timeline-dot-row mt-3 flex h-3.5 items-center justify-center">
        <span
          aria-hidden="true"
          className={`build-log-timeline-dot rounded-full border-2 transition-all duration-300 motion-reduce:transition-none ${
            isSelected
              ? "h-3.5 w-3.5 border-accent bg-accent shadow-[0_0_16px_rgba(227,28,28,0.75)]"
              : "h-3 w-3 border-white/30 bg-[#0a1628] group-hover:border-white/50"
          }`}
        />
      </div>
    </div>
  );
}

export default function BuildLogTimeline({
  entries,
  teamSlug,
}: BuildLogTimelineProps) {
  const theme = getTeamTheme(teamSlug);
  const latestEntryId = entries[0]?.id ?? "";
  const [selectedEntryId, setSelectedEntryId] = useState(latestEntryId);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timelineSectionRef = useRef<HTMLElement>(null);
  const slotRefs = useRef(new Map<string, HTMLDivElement>());
  const selectedEntryIdRef = useRef(selectedEntryId);
  const scrollAnchorRef = useRef<
    { mode: "timeline"; top: number } | { mode: "page"; top: number } | null
  >(null);
  const timelineDragRef = useRef({
    pointerId: -1,
    startX: 0,
    startScrollLeft: 0,
    dragged: false,
  });
  const scrollIdleTimerRef = useRef<number | null>(null);
  const suppressSelectionSyncRef = useRef(false);
  const isAutoScrollingRef = useRef(false);

  selectedEntryIdRef.current = selectedEntryId;

  const shouldIgnoreTimelineClick = useCallback(() => {
    return timelineDragRef.current.dragged;
  }, []);

  const scrollToEntry = useCallback(
    (id: string, behavior: ScrollBehavior = "smooth") => {
      const container = scrollRef.current;
      const node = slotRefs.current.get(id);
      if (!container || !node) {
        return;
      }

      scrollElementToCenter(container, node, behavior);
    },
    [],
  );

  const selectFromTimeline = useCallback((id: string) => {
    const section = timelineSectionRef.current;
    scrollAnchorRef.current = section
      ? { mode: "timeline", top: section.getBoundingClientRect().top }
      : { mode: "page", top: window.scrollY };
    setSelectedEntryId(id);
  }, []);

  const selectFromNav = useCallback((id: string) => {
    scrollAnchorRef.current = { mode: "page", top: window.scrollY };
    setSelectedEntryId(id);
  }, []);

  const selectFromScroll = useCallback((id: string) => {
    if (id === selectedEntryIdRef.current) {
      return;
    }

    setSelectedEntryId(id);
  }, []);

  const beginProgrammaticScroll = useCallback((durationMs: number) => {
    suppressSelectionSyncRef.current = true;
    isAutoScrollingRef.current = true;

    window.setTimeout(() => {
      suppressSelectionSyncRef.current = false;
      isAutoScrollingRef.current = false;
    }, durationMs);
  }, []);

  const snapClosestToCenter = useCallback(
    (behavior: ScrollBehavior = "smooth") => {
      if (
        suppressSelectionSyncRef.current ||
        isAutoScrollingRef.current ||
        timelineDragRef.current.dragged
      ) {
        return;
      }

      const container = scrollRef.current;
      if (!container) {
        return;
      }

      const closestId = findClosestSlotId(container, slotRefs.current);
      const closestSlot = closestId ? slotRefs.current.get(closestId) : null;

      if (!closestId || !closestSlot) {
        return;
      }

      if (closestId !== selectedEntryIdRef.current) {
        selectFromScroll(closestId);
      }

      if (isSlotCentered(container, closestSlot)) {
        return;
      }

      isAutoScrollingRef.current = true;
      scrollElementToCenter(container, closestSlot, behavior);

      window.setTimeout(() => {
        isAutoScrollingRef.current = false;
      }, behavior === "smooth" ? 420 : 0);
    },
    [selectFromScroll],
  );

  useLayoutEffect(() => {
    const anchor = scrollAnchorRef.current;
    if (!anchor) {
      return;
    }

    scrollAnchorRef.current = null;

    const compensateScroll = () => {
      if (anchor.mode === "timeline") {
        const timelineSection = timelineSectionRef.current;
        if (!timelineSection) {
          return;
        }

        const delta = timelineSection.getBoundingClientRect().top - anchor.top;
        if (Math.abs(delta) > 0.5) {
          window.scrollBy({ top: delta, left: 0, behavior: "auto" });
        }
        return;
      }

      if (Math.abs(window.scrollY - anchor.top) > 0.5) {
        window.scrollTo({ top: anchor.top, left: 0, behavior: "auto" });
      }
    };

    compensateScroll();
    requestAnimationFrame(compensateScroll);
  }, [selectedEntryId]);

  useEffect(() => {
    setSelectedEntryId(latestEntryId);
    requestAnimationFrame(() => {
      beginProgrammaticScroll(50);
      scrollToEntry(latestEntryId, "auto");
    });
  }, [beginProgrammaticScroll, latestEntryId, scrollToEntry, teamSlug]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) {
      return;
    }

    const syncSelectionAfterScroll = () => {
      if (
        suppressSelectionSyncRef.current ||
        isAutoScrollingRef.current ||
        timelineDragRef.current.dragged
      ) {
        return;
      }

      const closestId = findClosestSlotId(container, slotRefs.current);
      if (closestId) {
        selectFromScroll(closestId);
      }
    };

    const scheduleSnapToCenter = () => {
      if (scrollIdleTimerRef.current !== null) {
        window.clearTimeout(scrollIdleTimerRef.current);
      }

      scrollIdleTimerRef.current = window.setTimeout(() => {
        scrollIdleTimerRef.current = null;
        snapClosestToCenter("smooth");
      }, 140);
    };

    const handleScrollEnd = () => {
      if (scrollIdleTimerRef.current !== null) {
        window.clearTimeout(scrollIdleTimerRef.current);
        scrollIdleTimerRef.current = null;
      }

      snapClosestToCenter("smooth");
    };

    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey) {
        return;
      }

      const delta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY;

      if (delta === 0) {
        return;
      }

      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      const nextScrollLeft = Math.max(
        0,
        Math.min(container.scrollLeft + delta, maxScrollLeft),
      );

      if (nextScrollLeft === container.scrollLeft) {
        return;
      }

      container.scrollLeft = nextScrollLeft;
      event.preventDefault();
      syncSelectionAfterScroll();
      scheduleSnapToCenter();
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        return;
      }

      if (event.button !== 0) {
        return;
      }

      timelineDragRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startScrollLeft: container.scrollLeft,
        dragged: false,
      };
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        return;
      }

      const drag = timelineDragRef.current;
      if (event.pointerId !== drag.pointerId) {
        return;
      }

      const deltaX = event.clientX - drag.startX;
      if (Math.abs(deltaX) <= 4) {
        return;
      }

      if (!drag.dragged) {
        drag.dragged = true;
        container.setPointerCapture(event.pointerId);
      }

      container.scrollLeft = drag.startScrollLeft - deltaX;
      event.preventDefault();
    };

    const finishPointerInteraction = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        return;
      }

      const drag = timelineDragRef.current;
      const wasDragged = drag.dragged && event.pointerId === drag.pointerId;

      if (container.hasPointerCapture(event.pointerId)) {
        container.releasePointerCapture(event.pointerId);
      }

      timelineDragRef.current = {
        pointerId: -1,
        startX: 0,
        startScrollLeft: 0,
        dragged: false,
      };

      if (wasDragged) {
        syncSelectionAfterScroll();
        scheduleSnapToCenter();
      }
    };

    const handleScroll = () => {
      syncSelectionAfterScroll();
      scheduleSnapToCenter();
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("pointerdown", handlePointerDown);
    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerup", finishPointerInteraction);
    container.addEventListener("pointercancel", finishPointerInteraction);
    container.addEventListener("scroll", handleScroll, { passive: true });
    container.addEventListener("scrollend", handleScrollEnd);

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("pointerdown", handlePointerDown);
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerup", finishPointerInteraction);
      container.removeEventListener("pointercancel", finishPointerInteraction);
      container.removeEventListener("scroll", handleScroll);
      container.removeEventListener("scrollend", handleScrollEnd);
      if (scrollIdleTimerRef.current !== null) {
        window.clearTimeout(scrollIdleTimerRef.current);
      }
    };
  }, [selectFromScroll, snapClosestToCenter]);

  if (entries.length === 0) {
    return (
      <p className="build-log-empty-state border border-white/10 bg-white/[0.03] px-6 py-10 text-center text-offwhite/70">
        No build log entries yet. Check back soon.
      </p>
    );
  }

  const selectedEntry =
    entries.find((entry) => entry.id === selectedEntryId) ?? entries[0];
  const selectedIndex = entries.findIndex((entry) => entry.id === selectedEntry.id);
  const isLatestSelected = selectedEntry.id === latestEntryId;
  const canGoNewer = selectedIndex > 0;
  const canGoOlder = selectedIndex < entries.length - 1;

  const goNewer = () => {
    if (canGoNewer) {
      const id = entries[selectedIndex - 1].id;
      beginProgrammaticScroll(450);
      selectFromNav(id);
      scrollToEntry(id, "smooth");
    }
  };

  const goOlder = () => {
    if (canGoOlder) {
      const id = entries[selectedIndex + 1].id;
      beginProgrammaticScroll(450);
      selectFromNav(id);
      scrollToEntry(id, "smooth");
    }
  };

  const handleTimelineSelect = (id: string) => {
    beginProgrammaticScroll(450);

    if (id !== selectedEntryIdRef.current) {
      selectFromTimeline(id);
    }

    scrollToEntry(id, "smooth");
  };

  return (
    <div className="build-log-timeline relative isolate max-md:mx-0 -mx-4 -mb-10 min-h-[calc(100dvh-12rem)] md:-mx-4 md:-mb-16">
      <div
        aria-hidden="true"
        className="build-log-timeline-bg pointer-events-none absolute inset-y-0 left-1/2 z-0 w-screen min-h-full -translate-x-1/2 overflow-hidden bg-navy"
      >
        <div className="absolute left-0 top-32 h-72 w-72 -translate-x-1/3 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-80 w-80 translate-x-1/4 rounded-full bg-white/5 blur-3xl" />

        <div className="absolute inset-x-0 top-[8%] mx-auto aspect-square w-[min(92vw,36rem)] opacity-[0.14] md:top-[10%] md:w-[min(72vw,42rem)] md:opacity-[0.18]">
          <Image
            src="/drone-nobackground.png"
            alt=""
            fill
            sizes="(max-width: 768px) 92vw, 42rem"
            className="object-contain"
            priority
          />
        </div>

        <div className="absolute inset-x-0 top-0 z-[1] h-32 bg-gradient-to-b from-[#0a1628] via-[#0a1628]/80 to-transparent md:h-40" />
        <div className="absolute inset-x-0 bottom-0 z-[1] h-24 bg-gradient-to-t from-[#0a1628] to-transparent md:h-32" />
      </div>

      <div className="relative z-10 mx-0 space-y-10 pb-20 [overflow-anchor:none] md:space-y-10 md:pb-16">
        <FeaturedEntry
          entry={selectedEntry}
          isLatest={isLatestSelected}
          theme={theme}
          canGoNewer={canGoNewer}
          canGoOlder={canGoOlder}
          onGoNewer={goNewer}
          onGoOlder={goOlder}
        />

        {entries.length > 1 ? (
          <section
            ref={timelineSectionRef}
            aria-label="Update timeline"
            className="build-log-timeline-section mt-10 space-y-3 sm:mt-12 sm:space-y-4 md:mt-14 md:space-y-5 [overflow-anchor:none]"
          >
            <div className="build-log-timeline-divider flex items-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/25 to-white/10" />
              <h4 className="shrink-0 text-[0.625rem] font-black uppercase tracking-[0.18em] text-offwhite/45 md:text-xs">
                Timeline
              </h4>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-white/25 to-white/10" />
            </div>

            <div className="build-log-timeline-scroll-outer relative overflow-visible">
              <div className="build-log-timeline-scroll-fade pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[#0a1628] to-transparent sm:w-10 md:w-16" />
              <div className="build-log-timeline-scroll-fade pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[#0a1628] to-transparent sm:w-10 md:w-16" />

              <div
                ref={scrollRef}
                className="build-log-timeline-scroll w-full max-w-full cursor-grab touch-pan-x overflow-x-auto overflow-y-hidden overscroll-x-contain overscroll-y-none pb-4 pt-1 pl-[calc(50%-6.625rem)] pr-[calc(50%-6.625rem)] select-none active:cursor-grabbing sm:pt-4 sm:pl-[calc(50%-8rem)] sm:pr-[calc(50%-8rem)] md:pb-5 md:pt-7 md:pl-[calc(50%-10.5rem)] md:pr-[calc(50%-10.5rem)] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                <div className="relative inline-flex items-end gap-6 pb-2 sm:gap-4 md:gap-4">
                  <div
                    aria-hidden="true"
                    className="build-log-timeline-rail pointer-events-none absolute inset-x-0 z-0 h-px"
                    style={{ bottom: "calc(0.5rem + 0.4375rem)" }}
                  />

                  {entries.map((entry) => {
                    const isSelected = entry.id === selectedEntryId;

                    return (
                      <div
                        key={entry.id}
                        ref={(node) => {
                          if (node) {
                            slotRefs.current.set(entry.id, node);
                          } else {
                            slotRefs.current.delete(entry.id);
                          }
                        }}
                        className="flex w-[13.25rem] shrink-0 items-end justify-center overflow-visible sm:w-[16rem] md:w-[21rem]"
                      >
                        <TimelineUpdateNode
                          entry={entry}
                          teamSlug={teamSlug}
                          theme={theme}
                          isSelected={isSelected}
                          isLatest={entry.id === latestEntryId}
                          shouldIgnoreClick={shouldIgnoreTimelineClick}
                          onSelect={() => handleTimelineSelect(entry.id)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
