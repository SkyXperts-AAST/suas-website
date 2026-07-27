"use client";

import { useEffect, useRef, useState } from "react";

type Award = {
  icon: string;
  title: string;
  detail: string;
};

const AWARDS: Award[] = [
  {
    icon: "🏆",
    title: "Best Mission Award",
    detail:
      "Recognized for the most complete and effective mission execution at ICMTC 2026.",
  },
  {
    icon: "🥉",
    title: "3rd Place Overall",
    detail: "Storm placed 3rd overall against every competing team at ICMTC 2026.",
  },
];

const SCROLL_HEIGHT = `${AWARDS.length * 110}vh`;

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function getSectionProgress(section: HTMLElement): number {
  const rect = section.getBoundingClientRect();
  const viewport = window.innerHeight;
  const scrollRange = section.offsetHeight - viewport;
  if (scrollRange <= 0) return 1;
  return clamp01(-rect.top / scrollRange);
}

function RadarBadge({ icon, active }: { icon: string; active: boolean }) {
  return (
    <div className="relative mx-auto flex h-28 w-28 shrink-0 items-center justify-center sm:mx-0 sm:h-32 sm:w-32">
      <span
        aria-hidden="true"
        className={`absolute inset-0 rounded-full border border-dashed border-accent/30 motion-reduce:animate-none ${
          active ? "animate-spin [animation-duration:14s]" : ""
        }`}
      />
      <span
        aria-hidden="true"
        className={`absolute inset-2 rounded-full border border-accent/40 motion-reduce:animate-none sm:inset-3 ${
          active ? "animate-ping [animation-duration:2.6s]" : ""
        }`}
      />
      <span
        className={`relative flex h-20 w-20 items-center justify-center rounded-full bg-accent/15 text-4xl shadow-[0_0_36px_rgba(227,28,28,0.4)] transition-transform duration-700 ease-out sm:h-24 sm:w-24 sm:text-5xl ${
          active ? "scale-100" : "scale-50"
        }`}
      >
        {icon}
      </span>
    </div>
  );
}

/** Static fallback for reduced-motion visitors — every award laid out and
 * visible at once, no pinning or animated hand-off between them. */
function StaticAwardList() {
  return (
    <section id="award" className="scroll-mt-24 bg-navy px-6 py-20 text-center md:py-28">
      <div className="mx-auto max-w-3xl">
        <p className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
          Chapter 03 · Recognition
        </p>
        <p className="mt-2 text-xs uppercase tracking-[0.16em] text-offwhite/50">
          ICMTC 2026
        </p>

        <div className="mt-12 flex flex-col gap-12">
          {AWARDS.map((award) => (
            <div
              key={award.title}
              className="mx-auto flex max-w-xl flex-col items-center gap-6 sm:flex-row sm:text-left"
            >
              <RadarBadge icon={award.icon} active />
              <div>
                <h3 className="font-display text-2xl leading-[1.05] tracking-tight text-offwhite sm:text-3xl">
                  {award.title}
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-offwhite/70 sm:mx-0">
                  {award.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Pins the recognition chapter in place while scrolling hands off from one
 * award to the next, one at a time — same "stays put while it plays out"
 * technique as the timeline and build chapters. */
export default function AwardHighlight() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    if (!section) return;

    let rafId = 0;
    const sync = () => setProgress(getSectionProgress(section));
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
  }, [reducedMotion]);

  if (reducedMotion) return <StaticAwardList />;

  const activeIndex = Math.min(
    AWARDS.length - 1,
    Math.floor(progress * AWARDS.length)
  );

  return (
    <section
      ref={sectionRef}
      id="award"
      style={{ height: SCROLL_HEIGHT }}
      className="relative scroll-mt-24"
    >
      <div className="sticky top-16 flex h-[calc(100dvh-4rem)] flex-col items-center justify-center overflow-hidden bg-navy px-6 text-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_50%_at_50%_18%,rgba(227,28,28,0.14),transparent_65%)]"
        />

        <div className="absolute top-8 sm:top-10">
          <p className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
            Chapter 03 · Recognition
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.16em] text-offwhite/50">
            ICMTC 2026
          </p>
        </div>

        <div className="relative mx-auto min-h-[19rem] w-full max-w-xl sm:min-h-[16rem]">
          {AWARDS.map((award, index) => {
            const isActive = index === activeIndex;
            const isPast = index < activeIndex;
            return (
              <div
                key={award.title}
                aria-hidden={!isActive}
                className={`absolute inset-0 flex flex-col items-center gap-6 transition-all duration-700 ease-out sm:flex-row sm:gap-10 sm:text-left ${
                  isActive
                    ? "translate-y-0 opacity-100"
                    : isPast
                      ? "-translate-y-10 opacity-0"
                      : "translate-y-10 opacity-0"
                }`}
              >
                <RadarBadge icon={award.icon} active={isActive} />
                <div>
                  <p className="font-mono text-xs font-bold tracking-[0.2em] text-accent">
                    {String(index + 1).padStart(2, "0")} /{" "}
                    {String(AWARDS.length).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 font-display text-3xl leading-[1.05] tracking-tight text-offwhite sm:text-4xl lg:text-5xl">
                    {award.title}
                  </h3>
                  <p className="mx-auto mt-3 max-w-md text-pretty text-sm leading-relaxed text-offwhite/70 sm:mx-0 sm:text-base">
                    {award.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="absolute bottom-8 flex items-center gap-2 sm:bottom-10">
          {AWARDS.map((award, index) => (
            <span
              key={award.title}
              aria-hidden="true"
              className={`h-1.5 rounded-full transition-all duration-500 ${
                index === activeIndex ? "w-6 bg-accent" : "w-1.5 bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
