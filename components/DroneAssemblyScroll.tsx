"use client";

import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import DroneAssemblyModel, {
  ASSEMBLY_ORDER,
  assemblyProgressForGroup,
  type AssemblyScrollApi,
} from "@/components/DroneAssemblyModel";
import SceneLighting from "@/components/vehicle/SceneLighting";
import { subsystemLabel } from "@/lib/vehicle/subsystemLookup";

const SCROLL_HEIGHT = "220vh";

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

function getSectionProgress(section: HTMLElement): number {
  const rect = section.getBoundingClientRect();
  const viewport = window.innerHeight;
  const scrollRange = section.offsetHeight - viewport;
  if (scrollRange <= 0) return 1;
  const raw = clamp01(-rect.top / scrollRange);
  return clamp01(raw / 0.72);
}

function CanvasLoader() {
  return (
    <mesh>
      <boxGeometry args={[0.01, 0.01, 0.01]} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  );
}

export default function DroneAssemblyScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollApi = useMemo<AssemblyScrollApi>(() => ({ progress: 0 }), []);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let rafId = 0;
    let lastUiUpdate = 0;

    const syncProgress = () => {
      const next = reducedMotion ? 1 : getSectionProgress(section);
      scrollApi.progress = next;

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
  }, [reducedMotion, scrollApi]);

  const activeKey = useMemo(
    () => activeAssemblyKey(scrollProgress),
    [scrollProgress]
  );
  const isComplete = scrollProgress > 0.9;
  const doneCount = useMemo(
    () =>
      ASSEMBLY_ORDER.filter(
        (key) => assemblyProgressForGroup(scrollProgress, key) >= 1
      ).length,
    [scrollProgress]
  );

  return (
    <section
      ref={sectionRef}
      style={{ height: SCROLL_HEIGHT }}
      className="relative bg-navy"
      aria-label="Storm assembly diagram"
    >
      <div className="sticky top-16 h-[calc(100dvh-4rem)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(227,28,28,0.08),transparent_70%)]" />

        <div className="relative z-10 flex h-full flex-col gap-3 px-5 py-4 sm:px-6 sm:py-5 lg:gap-5 lg:px-8 lg:py-6">
          <div className="shrink-0 text-center">
            <p className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
              Chapter 04 · Build
            </p>
            <h2 className="mt-2 font-display text-2xl leading-[1.05] tracking-tight text-offwhite sm:text-3xl lg:text-4xl">
              Scroll to assemble
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-offwhite/65 sm:text-base">
              Every subsystem starts separated. Keep scrolling — this view
              stays pinned while Storm assembles piece by piece. The build
              order is tracked live on the model itself.
            </p>
            <p
              className={`mt-2 text-sm text-offwhite/70 transition-opacity duration-500 ${
                isComplete ? "opacity-100" : "opacity-0"
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

          <div className="relative min-h-[220px] flex-1 overflow-hidden rounded-2xl border border-white/10 bg-[#050d18]">
            <Canvas
              className="h-full w-full"
              style={{ touchAction: "pan-y" }}
              frameloop="always"
              camera={{ fov: 45, near: 0.01, far: 100 }}
              gl={{ alpha: true, antialias: true }}
              dpr={[1, 1.75]}
            >
              <SceneLighting preset="studio" />
              <Suspense fallback={<CanvasLoader />}>
                <DroneAssemblyModel
                  scrollApi={scrollApi}
                  reducedMotion={reducedMotion}
                />
                <ContactShadows
                  position={[0, -0.12, 0]}
                  opacity={0.45}
                  scale={2.5}
                  blur={2.2}
                  far={1.2}
                />
              </Suspense>
            </Canvas>

            {/* Build checklist — floats directly on the model instead of
                living in a separate column, so the diagram and the progress
                it represents read as one object. */}
            <div className="nav-glass absolute right-2.5 top-2.5 z-20 max-h-[calc(100%-4.5rem)] w-[10.5rem] overflow-y-auto rounded-xl border border-white/10 p-2.5 shadow-lg shadow-black/30 sm:right-4 sm:top-4 sm:w-56 sm:p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="font-display text-[9px] font-bold uppercase tracking-[0.16em] text-white/50 sm:text-[10px]">
                  Build order
                </p>
                <p className="font-mono text-[9px] text-white/40 sm:text-[10px]">
                  {doneCount}/{ASSEMBLY_ORDER.length}
                </p>
              </div>

              <div className="space-y-1">
                {ASSEMBLY_ORDER.map((key) => {
                  const progress = assemblyProgressForGroup(scrollProgress, key);
                  const isActive = key === activeKey && !isComplete;
                  const isDone = progress >= 1;

                  return (
                    <div
                      key={key}
                      className={`flex items-center gap-2 rounded-md px-1.5 py-1 transition-all duration-300 ${
                        isActive
                          ? "bg-accent/15"
                          : isDone
                            ? "bg-white/5"
                            : "opacity-50"
                      }`}
                    >
                      <div
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[8px] font-bold ${
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
