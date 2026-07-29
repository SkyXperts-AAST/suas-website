"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  ASSEMBLY_ORDER,
  assemblyProgressForGroup,
  type AssemblyScrollApi,
} from "@/lib/vehicle/assemblyOrder";
import { subsystemLabel } from "@/lib/vehicle/subsystemLookup";

const DroneAssemblyCanvas = dynamic(
  () => import("@/components/DroneAssemblyCanvas"),
  { ssr: false }
);

const SCROLL_HEIGHT = "220vh";
const DESKTOP_QUERY = "(min-width: 768px)";

function labelForKey(key: string): string {
  if (key.startsWith("motor:")) return `Motor ${Number(key.split(":")[1]) + 1}`;
  return subsystemLabel(key);
}

function activeAssemblyKey(scrollProgress: number): string {
  let active: string = ASSEMBLY_ORDER[0];
  for (const key of ASSEMBLY_ORDER) {
    const p = assemblyProgressForGroup(scrollProgress, key);
    if (p < 1) {
      active = key;
      break;
    }
    active = key;
  }
  return active;
}

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function getSectionProgress(section: HTMLElement, sticky: HTMLElement): number {
  const rect = section.getBoundingClientRect();
  // Measure the pinned pane itself instead of re-deriving its height from
  // `window.innerHeight`/`NAV_OFFSET_PX`: the pane is sized with `dvh` in
  // CSS, which doesn't always equal `vh`-derived math (browser chrome,
  // OS-level scaling, etc.). Reading the live layout keeps this in sync no
  // matter which unit ends up governing the actual render.
  const stickyHeight = Math.max(sticky.offsetHeight, 1);
  const scrollRange = section.offsetHeight - stickyHeight;

  if (scrollRange <= 0) return 1;

  // Map the full pinned scroll distance to 0→1 assembly progress.
  return clamp01(-rect.top / scrollRange);
}

function ChapterHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="shrink-0 text-center">
      <p className="font-display text-[13px] font-bold uppercase tracking-[0.2em] text-accent">
        Build
      </p>
      {children}
    </div>
  );
}

function StaticAssembly() {
  return (
    <section className="relative bg-navy" aria-label="Storm assembly diagram">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(227,28,28,0.08),transparent_70%)]" />

      <div className="relative z-10 flex flex-col gap-3 px-5 py-10">
        <ChapterHeading>
          <h2 className="mt-2 font-display text-2xl leading-[1.05] tracking-tight text-offwhite sm:text-3xl">
            Storm, fully assembled
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-offwhite/65 sm:text-base">
            Avionics, power, vision and propulsion, integrated into one
            airframe.{" "}
            <Link
              href="/vehicles"
              className="font-medium text-accent underline-offset-2 hover:underline"
            >
              Explore every subsystem →
            </Link>
          </p>
        </ChapterHeading>

        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#050d18]">
          <Image
            src="/drone-assembled.webp"
            alt="Storm, fully assembled"
            width={1400}
            height={872}
            className="h-auto w-full"
          />
        </div>
      </div>
    </section>
  );
}

export default function DroneAssemblyScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const scrollApi = useMemo<AssemblyScrollApi>(() => ({ progress: 0 }), []);
  // Set once the canvas mounts (it's behind next/dynamic); lets the scroll
  // handler below ask the R3F root for a redraw under frameloop="demand".
  const invalidateRef = useRef<(() => void) | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_QUERY);
    const update = () => setIsDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    if (!section || !sticky) return;

    let rafId = 0;
    let lastUiUpdate = 0;
    // Distinct from `scrollProgress` state: this tracks the last value we
    // actually applied, so a scroll/resize event that doesn't move the
    // needle (bounce scroll, a resize with no size change) skips the
    // scrollApi mutation and the setState below.
    let lastProgress = -1;

    const syncProgress = () => {
      const next = reducedMotion ? 1 : getSectionProgress(section, sticky);
      if (next === lastProgress) return;
      lastProgress = next;

      scrollApi.progress = next;
      // The mutation above happens outside any React/R3F commit, so under
      // frameloop="demand" nothing else will draw it — ask for one frame.
      invalidateRef.current?.();

      const now = performance.now();
      if (now - lastUiUpdate > 32 || next === 0 || next === 1) {
        lastUiUpdate = now;
        setScrollProgress(next);
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(syncProgress);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    syncProgress();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isDesktop, reducedMotion, scrollApi]);

  const activeKey = useMemo(
    () => activeAssemblyKey(scrollProgress),
    [scrollProgress]
  );
  const isComplete = scrollProgress > 0.96;
  const doneCount = useMemo(
    () =>
      ASSEMBLY_ORDER.filter(
        (key) => assemblyProgressForGroup(scrollProgress, key) >= 1
      ).length,
    [scrollProgress]
  );

  if (!isDesktop) return <StaticAssembly />;

  return (
    <section
      ref={sectionRef}
      style={{ height: SCROLL_HEIGHT }}
      className="relative bg-navy"
      aria-label="Storm assembly diagram"
    >
      <div
        ref={stickyRef}
        className="sticky top-16 h-[calc(100dvh-4rem)] overflow-hidden"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(227,28,28,0.08),transparent_70%)]" />

        <div className="relative z-10 flex h-full min-h-0 flex-col gap-3 px-5 py-4 sm:px-6 sm:py-5 lg:gap-4 lg:px-8 lg:py-5">
          <ChapterHeading>
            <h2 className="mt-2 font-display text-2xl leading-[1.05] tracking-tight text-offwhite sm:text-3xl lg:text-4xl">
              Scroll to assemble
            </h2>
            {/* Both states share one slot (stacked, not sequential) so the
                heading's height never grows when the completion message
                appears — that growth would shrink the canvas below and force
                the build-order list into its own scrollbar. */}
            <div className="relative mx-auto mt-2 max-w-xl">
              <p
                className={`text-sm leading-relaxed text-offwhite/65 transition-opacity duration-500 sm:text-base ${
                  isComplete ? "opacity-0" : "opacity-100"
                }`}
              >
                Every subsystem starts separated. Keep scrolling — this view
                stays pinned while Storm assembles piece by piece. The build
                order is tracked live on the model itself.
              </p>
              <p
                className={`absolute inset-x-0 top-0 text-sm text-offwhite/70 transition-opacity duration-500 sm:text-base ${
                  isComplete ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
              >
                Storm is fully assembled.{" "}
                <Link
                  href="/vehicles"
                  className="pointer-events-auto font-medium text-accent underline-offset-2 hover:underline"
                >
                  Explore every subsystem →
                </Link>
              </p>
            </div>
          </ChapterHeading>

          <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl border border-white/10 bg-[#050d18]">
            <DroneAssemblyCanvas
              scrollApi={scrollApi}
              reducedMotion={reducedMotion}
              invalidateRef={invalidateRef}
            />

            <div className="nav-glass absolute right-2.5 top-2.5 z-20 max-h-[calc(100%-3rem)] w-[10.5rem] overflow-y-auto overscroll-contain rounded-xl border border-white/10 p-2 shadow-lg shadow-black/30 [scrollbar-width:none] sm:right-4 sm:top-4 sm:w-56 sm:p-2.5 [&::-webkit-scrollbar]:hidden">
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <p className="font-display text-[9px] font-bold uppercase tracking-[0.16em] text-white/50 sm:text-[10px]">
                  Build order
                </p>
                <p className="font-mono text-[9px] text-white/40 sm:text-[10px]">
                  {doneCount}/{ASSEMBLY_ORDER.length}
                </p>
              </div>

              <div className="space-y-0.5">
                {ASSEMBLY_ORDER.map((key) => {
                  const progress = assemblyProgressForGroup(scrollProgress, key);
                  const isActive = key === activeKey && !isComplete;
                  const isDone = progress >= 1;

                  return (
                    <div
                      key={key}
                      className={`flex items-center gap-2 rounded-md px-1.5 py-0.5 transition-all duration-300 ${
                        isActive
                          ? "bg-accent/15"
                          : isDone
                            ? "bg-white/5"
                            : "opacity-50"
                      }`}
                    >
                      <div
                        className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full text-[8px] font-bold ${
                          isDone
                            ? "bg-accent text-white"
                            : isActive
                              ? "border border-accent text-accent"
                              : "border border-white/25 text-white/40"
                        }`}
                      >
                        {isDone ? "✓" : ""}
                      </div>
                      <span
                        className={`min-w-0 flex-1 truncate font-display text-[10px] tracking-wide sm:text-[11px] ${
                          isActive ? "text-offwhite" : "text-offwhite/70"
                        }`}
                      >
                        {labelForKey(key)}
                      </span>
                      <div className="h-0.5 w-6 shrink-0 overflow-hidden rounded-full bg-white/10 sm:w-8">
                        <div
                          className="h-full rounded-full bg-accent transition-all duration-150"
                          style={{ width: `${progress * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pointer-events-none absolute inset-x-4 bottom-4">
              <div className="h-1 overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-accent transition-[width] duration-75"
                  style={{ width: `${scrollProgress * 100}%` }}
                />
              </div>
              <p className="mt-2 text-center text-[10px] uppercase tracking-[0.2em] text-white/45">
                {scrollProgress < 0.04
                  ? "Scroll to assemble"
                  : isComplete
                    ? "Fully assembled"
                    : "Assembling…"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
