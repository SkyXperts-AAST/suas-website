"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { PageBadge } from "@/components/layout/PageShell";
import type { GalleryItem } from "@/lib/gallery/types";

type ScrollGalleryProps = {
  items: GalleryItem[];
};

function formatIndex(index: number, total: number) {
  return `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
}

export default function ScrollGallery({ items }: ScrollGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);

  const scrollToIndex = useCallback((index: number) => {
    const root = scrollerRef.current;
    const slide = slideRefs.current[index];
    if (!root || !slide) return;
    root.scrollTo({ top: slide.offsetTop, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const root = scrollerRef.current;
    if (!root || items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const index = Number(
          (visible.target as HTMLElement).dataset.index ?? "0",
        );
        setActiveIndex((prev) => (prev === index ? prev : index));
      },
      {
        root,
        threshold: [0.35, 0.55, 0.75],
      },
    );

    slideRefs.current.forEach((slide) => {
      if (slide) observer.observe(slide);
    });

    return () => observer.disconnect();
  }, [items.length]);

  const onDotKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      scrollToIndex(index);
    }
  };

  if (items.length === 0) {
    return (
      <div className="relative bg-navy px-6 py-20 text-offwhite">
        <p className="mx-auto max-w-lg rounded-2xl border border-white/10 bg-white/5 px-6 py-10 text-center text-offwhite/70">
          Gallery photos coming soon.
        </p>
      </div>
    );
  }

  const slideCount = items.length + 1;

  return (
    <div className="relative bg-navy text-offwhite">
      <div
        ref={scrollerRef}
        className="relative h-[calc(100dvh-4rem)] overflow-x-hidden overflow-y-auto overscroll-y-contain"
        style={{ scrollSnapType: "y mandatory" }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[28rem] bg-[radial-gradient(circle_at_top,rgba(227,28,28,0.18),transparent_55%)]"
        />

        <section
          ref={(node) => {
            slideRefs.current[0] = node;
          }}
          data-index={0}
          className="relative z-10 flex h-[calc(100dvh-4rem)] shrink-0 flex-col justify-end overflow-hidden px-5 pb-16 pt-10 sm:px-6 sm:pb-20 md:justify-center md:px-10 md:pb-24"
          style={{ scrollSnapAlign: "start", scrollSnapStop: "always" }}
        >
          <div className="max-w-3xl">
            <PageBadge label="Gallery" />
            <h1 className="mt-4 text-3xl leading-[1.05] sm:mt-5 sm:text-4xl md:text-6xl">
              Moments from the
              <span className="block text-offwhite/85">build and the field.</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-offwhite/65 sm:mt-5 sm:text-base sm:leading-7">
              Scroll through flight tests, team moments, and field operations —
              one frame at a time.
            </p>
            <p className="mt-8 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-offwhite/40 animate-chevron">
              Scroll
            </p>
          </div>
        </section>

        {items.map((item, index) => {
          const slideIndex = index + 1;
          const isActive = activeIndex === slideIndex;

          return (
            <section
              key={item.id}
              ref={(node) => {
                slideRefs.current[slideIndex] = node;
              }}
              data-index={slideIndex}
              aria-label={`${item.title} (${formatIndex(index, items.length)})`}
              className="relative z-10 flex h-[calc(100dvh-4rem)] shrink-0 flex-col overflow-hidden md:block"
              style={{ scrollSnapAlign: "start", scrollSnapStop: "always" }}
            >
              <div className="relative min-h-0 flex-1 overflow-hidden bg-[#05071e] md:absolute md:inset-0 md:flex-none">
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  fill
                  priority={index < 2}
                  sizes="100vw"
                  className={`object-contain object-center transition-transform duration-700 ease-out md:object-cover md:duration-[900ms] ${
                    isActive ? "scale-100" : "scale-100 md:scale-105"
                  }`}
                />
                <div className="pointer-events-none absolute inset-0 hidden bg-[#0a1628]/35 md:block" />
                <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-t from-[#05071e]/95 via-[#0a1628]/30 to-[#0a1628]/20 md:block" />
                <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-[#05071e]/55 via-transparent to-[#05071e]/40 md:block" />
              </div>

              {/* Mobile caption under image */}
              <div className="shrink-0 border-t border-white/5 bg-[#05071e] px-5 py-4 sm:px-6 sm:py-5 md:hidden">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
                  {formatIndex(index, items.length)}
                </p>
                {item.category ? (
                  <p className="mt-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-offwhite/55">
                    {item.category}
                  </p>
                ) : null}
                <h2 className="mt-1.5 text-lg leading-[1.1] text-offwhite sm:text-xl">
                  {item.title}
                </h2>
                <p className="mt-1.5 line-clamp-3 text-sm leading-5 text-offwhite/75 sm:leading-6">
                  {item.description}
                </p>
              </div>

              {/* Desktop overlay caption */}
              <div
                className={`absolute inset-0 hidden flex-col justify-end px-10 py-12 transition-opacity duration-500 md:flex ${
                  isActive ? "opacity-100" : "opacity-70"
                }`}
              >
                <div className="max-w-2xl">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
                    {formatIndex(index, items.length)}
                  </p>
                  {item.category ? (
                    <p className="mt-3 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-offwhite/55">
                      {item.category}
                    </p>
                  ) : null}
                  <h2 className="mt-2 text-4xl leading-[1.05] text-offwhite lg:text-5xl">
                    {item.title}
                  </h2>
                  <p className="mt-3 max-w-xl text-base leading-7 text-offwhite/80">
                    {item.description}
                  </p>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <div className="pointer-events-none absolute inset-y-0 right-0 z-20 hidden items-center pr-5 md:flex lg:pr-8">
        <div
          className="pointer-events-auto flex flex-col items-center gap-3"
          role="tablist"
          aria-label="Gallery slides"
        >
          {Array.from({ length: slideCount }, (_, index) => (
            <button
              key={index}
              type="button"
              role="tab"
              aria-selected={activeIndex === index}
              aria-label={
                index === 0 ? "Gallery intro" : `Go to photo ${index}`
              }
              onClick={() => scrollToIndex(index)}
              onKeyDown={(event) => onDotKeyDown(event, index)}
              className={`block rounded-full transition-all duration-300 ${
                activeIndex === index
                  ? "h-6 w-1.5 bg-accent"
                  : "h-1.5 w-1.5 bg-offwhite/30 hover:bg-offwhite/55"
              }`}
            />
          ))}
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-0.5 bg-white/10 md:hidden"
      >
        <div
          className="h-full bg-accent transition-[width] duration-300 ease-out"
          style={{
            width: `${((activeIndex + 1) / slideCount) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}
