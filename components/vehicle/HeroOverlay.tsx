"use client";

/**
 * Presentational hero overlay layered on top of the 3D canvas. Purely visual —
 * it never intercepts pointer events over the model (the wrapper is
 * pointer-events-none; only the buttons opt back in), so hover/click on the
 * drone keeps working. `dimmed` fades the hero back while a component is being
 * inspected.
 */
interface HeroOverlayProps {
  dimmed?: boolean;
  /** True while the guided tour runs — swaps the primary CTA's label. */
  tourActive?: boolean;
  /**
   * True once the mount-time landing sequence has reached the resting pose.
   * The name/subtitle/description/CTA block stays invisible and inert until
   * then, so it fades in only once the drone has actually landed.
   */
  hasLanded: boolean;
  onExplore: () => void;
  onMoreInfo: () => void;
}

export default function HeroOverlay({
  dimmed = false,
  tourActive = false,
  hasLanded,
  onExplore,
  onMoreInfo,
}: HeroOverlayProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-10 transition-opacity duration-500 ${
        dimmed ? "opacity-30" : "opacity-100"
      }`}
    >
      {/* Bottom-left hero content. Raised well clear of the scroll hint on
          mobile, where the subtitle wraps to more lines and eats into the
          14 (56px) gap that's fine once the CTA row fits on one line at
          sm+. safe-area-inset-bottom keeps the clearance on notched
          phones with a home-indicator bar. */}
      <div
        className={`absolute bottom-[calc(6.5rem+env(safe-area-inset-bottom))] left-6 max-w-md transition-opacity duration-500 sm:bottom-14 sm:left-12 ${
          hasLanded ? "opacity-100" : "opacity-0"
        }`}
      >
        <p className="font-display text-[13px] font-bold uppercase tracking-[0.16em] text-[#E31C1C]">
          SUAS · USA
        </p>
        <h1 className="mt-3 text-6xl leading-[0.92] tracking-tight text-[#F5F5F7] sm:text-7xl">
          Storm
        </h1>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#F5F5F7]/70">
          Autonomous heavy-lift quadcopter. Built in-house, subsystem by
          subsystem.
        </p>
        <div
          className={`mt-7 flex flex-wrap gap-3 ${
            hasLanded ? "pointer-events-auto" : "pointer-events-none"
          }`}
        >
          <button
            onClick={onExplore}
            disabled={tourActive || !hasLanded}
            className="rounded-full bg-[#E31C1C] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#E31C1C]/20 transition hover:bg-[#c81616] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E31C1C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0E3F] disabled:cursor-default disabled:bg-[#E31C1C]/50"
          >
            {tourActive ? "Tour Running…" : "Explore Components"}
          </button>
          <button
            onClick={onMoreInfo}
            className="rounded-full border border-[#F5F5F7]/40 px-6 py-2.5 text-sm font-semibold text-[#F5F5F7] backdrop-blur-sm transition hover:border-[#F5F5F7] hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5F5F7]/60"
          >
            More Info
          </button>
        </div>
      </div>

      {/* Bottom-center scroll hint. Unconstrained, this span's flex-column
          parent lets it wrap to 3-4 ragged lines on a narrow phone, which
          was eating into the hero copy's clearance above it — the shorter
          mobile-only copy keeps it to one line; sm+ has the room for the
          full hint. */}
      <div className="absolute bottom-[calc(1.25rem+env(safe-area-inset-bottom))] left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 sm:bottom-6">
        <span className="text-center text-[0.7rem] uppercase tracking-[0.25em] text-[#F5F5F7]/50">
          Scroll down
          <span className="hidden sm:inline"> or click on components to explore</span>
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
