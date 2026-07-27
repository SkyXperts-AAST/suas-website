"use client";

import { useEffect, useState } from "react";

export type JourneyChapter = {
  id: string;
  label: string;
};

type JourneyRailProps = {
  chapters: JourneyChapter[];
};

/** Fixed side rail that tracks scroll position through the home page's
 * chapters and lets visitors jump straight to one — the connective thread
 * that turns a stack of sections into a single guided journey. */
export default function JourneyRail({ chapters }: JourneyRailProps) {
  const [activeId, setActiveId] = useState(chapters[0]?.id);

  useEffect(() => {
    const elements = chapters
      .map((chapter) => document.getElementById(chapter.id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (mostVisible) setActiveId(mostVisible.target.id);
      },
      { rootMargin: "-35% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [chapters]);

  const activeIndex = Math.max(
    chapters.findIndex((chapter) => chapter.id === activeId),
    0
  );

  return (
    <nav
      aria-label="Team journey chapters"
      className="pointer-events-none fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 xl:block"
    >
      <ol className="pointer-events-auto relative flex flex-col gap-7">
        <span
          aria-hidden="true"
          className="absolute left-[3px] top-1 bottom-1 w-px bg-white/10"
        />
        <span
          aria-hidden="true"
          className="absolute left-[3px] top-1 w-px bg-accent transition-[height] duration-500 ease-out"
          style={{
            height:
              chapters.length > 1
                ? `${(activeIndex / (chapters.length - 1)) * 100}%`
                : "0%",
          }}
        />

        {chapters.map((chapter, index) => {
          const active = chapter.id === activeId;
          return (
            <li key={chapter.id} className="group relative flex items-center">
              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById(chapter.id)
                    ?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
                aria-label={`Jump to ${chapter.label}`}
                aria-current={active ? "true" : undefined}
                className={`relative z-10 h-2 w-2 shrink-0 rounded-full border transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-navy ${
                  active
                    ? "scale-125 border-accent bg-accent"
                    : "border-white/30 bg-navy group-hover:border-white/60"
                }`}
              />
              <span
                aria-hidden="true"
                className={`ml-3 whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.16em] transition-all duration-300 ${
                  active
                    ? "translate-x-0 text-offwhite opacity-100"
                    : "-translate-x-1 text-offwhite/0 opacity-0 group-hover:translate-x-0 group-hover:text-offwhite/70 group-hover:opacity-100"
                }`}
              >
                {String(index + 1).padStart(2, "0")} · {chapter.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
