"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Logo from "@/components/Logo";

// Safety net in case the clip fails to fire `onEnded` (slow network, codec
// issue, etc.) — the reveal still happens instead of leaving the big logo
// stuck on screen forever.
const MAX_INTRO_MS = 8000;

/** Full-screen splash: the landing clip autoplays once behind a big centered
 * logo, then hands off to the normal hero (heading, badge) once it
 * finishes — a one-time "reveal" for the site, not something tied to
 * scrolling. */
export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  // Reduced motion: skip the animated intro entirely and land straight on
  // the revealed hero.
  useEffect(() => {
    if (reducedMotion) setIntroDone(true);
  }, [reducedMotion]);

  useEffect(() => {
    if (introDone) return;
    const timeout = window.setTimeout(() => setIntroDone(true), MAX_INTRO_MS);
    return () => window.clearTimeout(timeout);
  }, [introDone]);

  // Kicks the logo's entrance transition off a frame after mount, rather
  // than having it just appear — the zoom-out-and-settle is what reads as a
  // cinematic title card instead of a static watermark.
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const logoState = !mounted
    ? "scale-[1.35] opacity-0"
    : introDone
      ? "scale-110 opacity-0"
      : "scale-100 opacity-100";

  return (
    <section className="relative flex h-[calc(100dvh-4rem)] flex-col items-center justify-center overflow-hidden bg-[#0a1628] px-6 text-center">
      <Image
        src="/drone.png"
        alt="SkyXperts drone in flight"
        fill
        className="z-0 object-cover object-[center_58%] opacity-50 saturate-[0.55]"
        priority
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[1] bg-gradient-to-b from-navy/75 via-navy/35 to-navy/85"
      />

      {!reducedMotion && (
        <video
          ref={videoRef}
          className={`absolute inset-0 z-10 h-full w-full object-cover transition-opacity duration-1000 ${
            introDone ? "opacity-0" : "opacity-100"
          }`}
          src="/landing.mp4"
          autoPlay
          muted
          playsInline
          onEnded={() => setIntroDone(true)}
          onError={() => setIntroDone(true)}
        />
      )}

      <div
        className={`absolute inset-0 z-20 bg-black transition-opacity duration-1000 ${
          introDone ? "opacity-20" : "opacity-45"
        }`}
      />

      {/* Cinematic letterbox bars — bracket the intro like a title card, then
          retract as the site reveals itself. */}
      {!reducedMotion && (
        <>
          <div
            aria-hidden="true"
            className={`absolute inset-x-0 top-0 z-40 h-8 bg-black transition-transform duration-1000 ease-in-out sm:h-12 ${
              introDone ? "-translate-y-full" : "translate-y-0"
            }`}
          />
          <div
            aria-hidden="true"
            className={`absolute inset-x-0 bottom-0 z-40 h-8 bg-black transition-transform duration-1000 ease-in-out sm:h-12 ${
              introDone ? "translate-y-full" : "translate-y-0"
            }`}
          />
        </>
      )}

      {/* Big logo reveal — the intro's cinematic centerpiece. */}
      <div
        className={`pointer-events-none absolute inset-0 z-30 flex items-center justify-center transition-all duration-[1400ms] ease-out ${logoState}`}
      >
        <Logo
          variant="big"
          className="h-auto w-80 drop-shadow-[0_0_60px_rgba(255,255,255,0.45)] sm:w-[30rem] md:w-[38rem] lg:w-[46rem]"
          priority
        />
      </div>

      <div
        className={`relative z-30 flex flex-col items-center transition-all duration-700 ${
          introDone ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
      >
        <h1 className="font-display text-5xl leading-[1.02] tracking-tight text-[#F5F5F7] drop-shadow-[0_2px_24px_rgba(0,0,0,0.5)] sm:text-6xl md:text-7xl">
          Meet Storm. Engineered to respond.
        </h1>
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.35em] text-[#F5F5F7]/70">
          AAST · SUAS 2026
        </p>
      </div>
    </section>
  );
}
