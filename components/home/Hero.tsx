"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Logo from "@/components/Logo";

/** Full-screen splash: landing clip with a bottom-centered watermark wordmark,
 * then hands off to the normal hero once the clip finishes. */
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

  useEffect(() => {
    if (reducedMotion) setIntroDone(true);
  }, [reducedMotion]);

  useEffect(() => {
    if (introDone || reducedMotion) return;

    const video = videoRef.current;
    if (!video) return;

    let timeoutId = 0;

    const scheduleFallback = () => {
      const durationMs =
        Number.isFinite(video.duration) && video.duration > 0
          ? video.duration * 1000 + 500
          : 60000;
      timeoutId = window.setTimeout(() => setIntroDone(true), durationMs);
    };

    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
      scheduleFallback();
    } else {
      video.addEventListener("loadedmetadata", scheduleFallback, { once: true });
    }

    return () => {
      window.clearTimeout(timeoutId);
      video.removeEventListener("loadedmetadata", scheduleFallback);
    };
  }, [introDone, reducedMotion]);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const logoState = !mounted
    ? "translate-y-4 opacity-0"
    : introDone
      ? "pointer-events-none translate-y-3 opacity-0"
      : "translate-y-0 opacity-100";

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

      {!reducedMotion && (
        <div
          className={`pointer-events-none absolute inset-x-0 bottom-[max(1.75rem,env(safe-area-inset-bottom))] z-30 flex justify-center px-6 transition-all duration-700 ease-out ${logoState}`}
        >
          <Logo
            variant="hero"
            decorative
            className="h-auto w-[min(72vw,22rem)] opacity-[0.34] brightness-0 invert sm:w-80 md:w-[28rem]"
            priority
          />
        </div>
      )}

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
