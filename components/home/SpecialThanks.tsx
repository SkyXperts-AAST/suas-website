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
          Chapter 06 · Special Thanks
        </p>
        <h2 className="mx-auto mt-3 max-w-2xl text-balance font-display text-3xl leading-[1.05] tracking-tight text-[#F5F5F7] sm:text-4xl">
          None of this flies without our sponsors
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#F5F5F7]/70 sm:text-base">
          Storm is built on carbon fiber, code, and the generosity of the
          organizations below — partners who back student engineering long
          before it ever leaves the ground.
        </p>

        <div className="mt-10 flex justify-center">
          <SponsorLogoGrid compact />
        </div>

        <Link
          href="/sponsorships"
          className="mt-8 inline-flex items-center gap-1 text-sm font-medium text-[#F5F5F7]/75 transition hover:text-accent"
        >
          Become a sponsor
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
