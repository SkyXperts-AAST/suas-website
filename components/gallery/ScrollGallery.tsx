"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GalleryItem } from "@/lib/gallery/types";

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
    const scrollStep = window.innerHeight * 0.92;
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
      <p className="rounded-2xl border border-white/10 bg-white/5 px-6 py-10 text-center text-offwhite/70">
        Gallery photos coming soon.
      </p>
    );
  }

  const activeItem = items[activeIndex] ?? items[0];
  const scrollHeight = `${items.length * 100}vh`;

  return (
    <div
      ref={containerRef}
      className="relative bg-navy"
      style={{ height: scrollHeight }}
    >
      <div className="sticky top-[72px] z-0 h-[calc(100vh-72px)] overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(227,28,28,0.16),transparent_60%)]"
        />

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

        <div className="relative z-10 flex h-full flex-col justify-between px-6 py-8 md:px-10 md:py-10">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-[#0a1628]/70 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-accent backdrop-blur-sm">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
              Gallery
            </p>
            <h1 className="mt-5 max-w-3xl text-3xl font-semibold leading-tight drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)] md:text-5xl">
              Moments from the
              <span className="block text-offwhite/85">build and the field.</span>
            </h1>
          </div>

          <div className="flex items-end justify-between gap-6">
            <div
              key={activeItem.id}
              className={`max-w-2xl ${reducedMotion ? "" : "gallery-caption-in"}`}
            >
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
                {formatIndex(activeIndex, items.length)}
              </p>
              {activeItem.category ? (
                <p className="mt-3 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-offwhite/55">
                  {activeItem.category}
                </p>
              ) : null}
              <h2 className="mt-2 text-2xl font-semibold leading-tight text-offwhite md:text-3xl">
                {activeItem.title}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-offwhite/80 md:text-base">
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

          {activeIndex < items.length - 1 ? (
            <p className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-xs font-semibold uppercase tracking-[0.18em] text-offwhite/45 md:block animate-chevron">
              Scroll
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
