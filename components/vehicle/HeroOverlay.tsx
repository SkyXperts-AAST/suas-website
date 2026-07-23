"use client";

/**
 * Presentational hero overlay layered on top of the 3D canvas. Purely visual —
 * it never intercepts pointer events over the model (the wrapper is
 * pointer-events-none; only the buttons opt back in), so hover/click on the
 * drone keeps working. `dimmed` fades the hero back while a component is being
 * inspected.
 */
export default function HeroOverlay({ dimmed = false }: { dimmed?: boolean }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-10 transition-opacity duration-500 ${
        dimmed ? "opacity-30" : "opacity-100"
      }`}
    >
      {/* Bottom-left hero content */}
      <div className="absolute bottom-14 left-6 max-w-md sm:left-12">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#E31C1C]">
          SUAS · USA
        </p>
        <h1 className="mt-3 text-6xl font-bold leading-none tracking-tight text-[#F5F5F7] sm:text-7xl">
          Strom
        </h1>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#F5F5F7]/70">
          An autonomous heavy-lift quadcopter engineered for the SUAS
          competition — every subsystem built and tuned in-house.
        </p>
        <div className="pointer-events-auto mt-7 flex flex-wrap gap-3">
          <button className="rounded-full bg-[#E31C1C] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#E31C1C]/20 transition hover:bg-[#c81616] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E31C1C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0E3F]">
            Explore Components
          </button>
          <button className="rounded-full border border-[#F5F5F7]/40 px-6 py-2.5 text-sm font-semibold text-[#F5F5F7] backdrop-blur-sm transition hover:border-[#F5F5F7] hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5F5F7]/60">
            More Info
          </button>
        </div>
      </div>

      {/* Bottom-center scroll hint */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
        <span className="text-[0.7rem] uppercase tracking-[0.25em] text-[#F5F5F7]/50">
          Scroll down or click on components to explore
        </span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-chevron h-5 w-5 text-[#F5F5F7]/50"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}
