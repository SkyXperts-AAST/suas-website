"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function VehicleScrollReveal() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<HTMLElement>(null);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const wrapper = wrapperRef.current;
      const model = modelRef.current;
      if (!wrapper || !model) return;

      const rect = wrapper.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), scrollable);
      const progress = scrollable > 0 ? scrolled / scrollable : 0;

      const theta = progress * 270;
      const phi = 65 + progress * 15;
      model.setAttribute("camera-orbit", `${theta}deg ${phi}deg auto`);
      setShowHint(progress > 0.85);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={wrapperRef} style={{ height: "250vh" }} className="relative bg-navy" >
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center px-6 text-center">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-white/60">
          Our vehicle
        </p>
        <h2 className="mb-8 text-2xl font-semibold text-white">
          Meet Storm — scroll to look around
        </h2>

        <div className="relative mx-auto w-full" style={{ maxWidth: "600px" }}>
  <model-viewer
    ref={modelRef}
    src="/drone.glb"
    alt="3D model of the SkyXperts drone, Storm"
    shadow-intensity="1"
    exposure="1"
    disable-zoom
    suppressHydrationWarning
    style={{ width: "100%", height: "420px" }}
  ></model-viewer>

  <Link
    href="/vehicles"
    aria-label="See full Storm specs on the Vehicles page"
    className="absolute inset-0 cursor-pointer"
  />
</div>

        <p
          className={`mt-4 text-sm text-white/70 transition-opacity duration-500 ${
            showHint ? "opacity-100" : "opacity-0"
          }`}
        >
          Tap Storm to see full specs →
        </p>
      </div>
    </div>
  );
}