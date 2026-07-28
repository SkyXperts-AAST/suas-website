"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { PageBadge } from "@/components/layout/PageShell";
import type { GalleryItem } from "@/lib/gallery/types";

/** Matches sticky nav height (`h-16` in Nav.tsx). */
const NAV_OFFSET_PX = 64;

type ScrollGalleryProps = {
  items: GalleryItem[];
};

function formatIndex(index: number, total: number) {
  return `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function ScrollGallery({ items }: ScrollGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const updateActiveIndex = useCallback(() => {
    const container = containerRef.current;
    if (!container || items.length === 0) {
      return;
    }

    const rect = container.getBoundingClientRect();
    const viewport = window.innerHeight - NAV_OFFSET_PX;
    const scrollStep = Math.max(viewport * 0.92, 1);
    const scrolled = Math.max(0, -rect.top);
    const nextIndex = clamp(
      Math.floor(scrolled / scrollStep),
      0,
      items.length - 1,
    );

    setActiveIndex((prev) => (prev === nextIndex ? prev : nextIndex));
  }, [items.length]);

  useEffect(() => {
    updateActiveIndex();
    window.addEventListener("scroll", updateActiveIndex, { passive: true });
    window.addEventListener("resize", updateActiveIndex);

    return () => {
      window.removeEventListener("scroll", updateActiveIndex);
      window.removeEventListener("resize", updateActiveIndex);
    };
  }, [updateActiveIndex]);

  if (items.length === 0) {
    return (
      <div className="relative bg-navy px-6 py-20 text-offwhite">
        <p className="mx-auto max-w-lg rounded-2xl border border-white/10 bg-white/5 px-6 py-10 text-center text-offwhite/70">
          Gallery photos coming soon.
        </p>
      </div>
    );
  }

  const activeItem = items[activeIndex] ?? items[0];
  const scrollHeight = `${items.length * 100}dvh`;

  return (
    <div
      ref={containerRef}
      className="relative overflow-x-clip bg-navy text-offwhite"
      style={{ height: scrollHeight }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_top,rgba(227,28,28,0.18),transparent_55%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-32 h-72 w-72 -translate-x-1/3 rounded-full bg-sky-500/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-48 h-72 w-72 translate-x-1/3 rounded-full bg-violet-500/10 blur-3xl"
      />

      <div className="sticky top-16 z-10 h-[calc(100dvh-4rem)] overflow-hidden">
        {items.map((item, index) => {
          const isActive = index === activeIndex;

          return (
            <div
              key={item.id}
              aria-hidden={!isActive}
              className={`absolute inset-0 ${
                reducedMotion ? "" : "transition-opacity duration-700 ease-in-out"
              } ${isActive ? "opacity-100" : "opacity-0"}`}
            >
              <Image
                src={item.image}
                alt={item.imageAlt}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[#0a1628]/35" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05071e]/95 via-[#0a1628]/35 to-[#0a1628]/20" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#05071e]/55 via-transparent to-[#05071e]/55" />
            </div>
          );
        })}

        <div className="relative z-10 flex h-full min-w-0 flex-col justify-between px-5 py-6 sm:px-6 sm:py-8 md:px-10 md:py-10">
          <div>
            <PageBadge label="Gallery" />
            <h1 className="mt-4 max-w-3xl text-2xl leading-[1.05] drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)] sm:mt-5 sm:text-3xl md:text-5xl">
              Moments from the
              <span className="block text-offwhite/85">build and the field.</span>
            </h1>
          </div>

          <div className="flex min-w-0 items-end justify-between gap-4 sm:gap-6">
            <div
              key={activeItem.id}
              className={`min-w-0 max-w-2xl ${reducedMotion ? "" : "gallery-caption-in"}`}
            >
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
                {formatIndex(activeIndex, items.length)}
              </p>
              {activeItem.category ? (
                <p className="mt-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-offwhite/55 sm:mt-3">
                  {activeItem.category}
                </p>
              ) : null}
              <h2 className="mt-2 text-xl leading-[1.05] text-offwhite sm:text-2xl md:text-3xl">
                {activeItem.title}
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-offwhite/80 sm:mt-3 sm:leading-7 md:text-base">
                {activeItem.description}
              </p>
            </div>

            <div
              aria-hidden="true"
              className="hidden shrink-0 flex-col items-center gap-3 md:flex"
            >
              {items.map((item, index) => (
                <span
                  key={item.id}
                  className={`block h-2 w-2 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? "scale-125 bg-accent"
                      : "bg-offwhite/25"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Mobile progress dots */}
          <div
            aria-hidden="true"
            className="mt-4 flex justify-center gap-2 md:hidden"
          >
            {items.map((item, index) => (
              <span
                key={item.id}
                className={`block h-1.5 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? "w-5 bg-accent"
                    : "w-1.5 bg-offwhite/30"
                }`}
              />
            ))}
          </div>

          {activeIndex < items.length - 1 ? (
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-offwhite/45 sm:bottom-6 sm:text-xs animate-chevron">
              Scroll
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
