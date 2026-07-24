"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * Lite YouTube embed: renders the poster frame and a play control, and only
 * mounts the real iframe once the viewer asks for it. A live YouTube iframe
 * pulls in several hundred KB of player script and sets cookies on page load,
 * none of which is worth paying for a video most visitors won't press play on.
 *
 * Hand-rolled rather than pulling in react-lite-youtube-embed — the whole
 * behaviour is one piece of state, and the project has no other use for the
 * dependency.
 */
const VIDEO_ID = "8Sq_AR9CUw8";
const EMBED_URL = `https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1`;
// maxres doesn't exist for every upload; i.ytimg.com 404s when it's missing,
// which fires onError and drops us to hqdefault (always present).
const MAXRES_THUMB = `https://i.ytimg.com/vi/${VIDEO_ID}/maxresdefault.jpg`;
const HQ_THUMB = `https://i.ytimg.com/vi/${VIDEO_ID}/hqdefault.jpg`;

export default function FrrVideo() {
  const [playing, setPlaying] = useState(false);
  const [thumb, setThumb] = useState(MAXRES_THUMB);

  return (
    <div
      className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/8 bg-[#0A0E3F]"
      style={{ boxShadow: "0 20px 60px rgba(0, 0, 0, 0.45)" }}
    >
      {playing ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={EMBED_URL}
          title="SkyXperts Flight Readiness Review"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label="Play the SkyXperts Flight Readiness Review video"
          className="group absolute inset-0 h-full w-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E31C1C] focus-visible:ring-inset"
        >
          <Image
            src={thumb}
            onError={() => setThumb(HQ_THUMB)}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 896px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          />
          {/* Scrim: keeps the play control readable over an arbitrary frame and
              settles the thumbnail into the page's dark palette. */}
          <span className="absolute inset-0 bg-[#0A0E3F]/35 transition-colors duration-300 group-hover:bg-[#0A0E3F]/20" />
          <span className="absolute inset-0 flex items-center justify-center">
            {/* Same red fill as the hero's "Explore Components" CTA. */}
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E31C1C] shadow-lg shadow-[#E31C1C]/30 transition duration-300 ease-out group-hover:scale-110 group-hover:bg-[#c81616] sm:h-20 sm:w-20">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className="ml-1 h-7 w-7 text-white sm:h-8 sm:w-8"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
