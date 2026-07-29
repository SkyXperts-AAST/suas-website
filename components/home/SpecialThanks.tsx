"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SponsorLogoGrid from "@/components/sponsors/SponsorLogoGrid";

// Pre-reveal state, applied imperatively rather than rendered — see
// VehicleSpecs for why (avoids shipping invisible copy if hydration never
// happens).
const HIDDEN_CLASSES = ["opacity-0", "translate-y-3"];

/** Closes out the home page's story by crediting the sponsors that make it
 * possible — moved off the footer (seen on every page, easy to skim past)
 * and onto the journey itself, where it reads as a genuine "thank you"
 * rather than fine print. */
export default function SpecialThanks() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    const content = contentRef.current;
    if (!node || !content) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
      return;
    }

    content.classList.add(...HIDDEN_CLASSES);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setRevealed(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="border-t border-white/5 bg-navy px-6 py-20 text-center md:py-28"
    >
      <div
        ref={contentRef}
        className={`mx-auto max-w-3xl transition-[opacity,transform] duration-700 ease-out ${
          revealed ? "translate-y-0 opacity-100" : ""
        }`}
      >
        <p className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
          Chapter 05 · Special Thanks
        </p>
        <h2 className="mx-auto mt-3 max-w-2xl text-balance font-display text-3xl leading-[1.05] tracking-tight text-[#F5F5F7] sm:text-4xl">
          Student-built. Sponsor-backed.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#F5F5F7]/70 sm:text-base">
          Every vehicle we fly depends on the people backing us with funding,
          hardware, facilities, and know-how. That support shows up in the
          build, not just on a page.
        </p>

        <div className="mt-10 flex justify-center">
          <SponsorLogoGrid compact />
        </div>

        <p className="mt-8 text-sm text-[#F5F5F7]/75">
          Want in?{" "}
          <Link
            href="/sponsorships"
            className="inline-flex items-center gap-1 font-medium transition hover:text-accent"
          >
            Support the Mission
            <span aria-hidden="true">→</span>
          </Link>
        </p>
      </div>
    </section>
  );
}
