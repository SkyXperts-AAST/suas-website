"use client";

import { useState } from "react";

export default function HeroDroneExperience() {
  const [ended, setEnded] = useState(false);

  return (
    <div
      className={`absolute inset-0 z-10 bg-navy transition-opacity duration-700 ${
        ended ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <video
        className="h-full w-full object-cover"
        src="/landing.mp4"
        autoPlay
        muted
        playsInline
        onEnded={() => setEnded(true)}
      />
    </div>
  );
}