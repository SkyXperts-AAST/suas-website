"use client";

import { useEffect, useRef, useState } from "react";
import type { SubsystemSpec } from "@/lib/vehicle/subsystemContent";
import SpecGrid, { SPEC_RULE } from "./SpecGrid";

/**
 * The written "More Info" section: the scroll target for the hero's More Info
 * button and the scroll hint. Keeps the `vehicle-details` id — VehicleCanvas
 * looks it up by that id, so it has to stay on whatever section lives here.
 */

const DIMENSIONS = { value: "85×85×35 cm", label: "Dimensions (L x W x H)" };

const STATS: ReadonlyArray<{ value: string; label: string }> = [
  { value: "6.75 kg", label: "All-up weight" },
  { value: "4.09:1", label: "Max T/W ratio" },
  { value: "~30 min", label: "Flight endurance" },
];

const SUPPORTING: SubsystemSpec[] = [
  { label: "Configuration", value: "Quadcopter, X-config" },
  {
    label: "Frame material",
    value: "Carbon fiber / fiberglass sandwich composite",
  },
];

/**
 * Column dividers for the 3-up stat row below Dimensions. Stacks to one
 * column on mobile (no dividers needed there) and becomes a 3-up row with
 * dividers between columns from `sm` up.
 *
 * They draw in the shared SPEC_RULE colour, so the strip, the spec rows below
 * it, and the InfoPanel all use one hairline. To drop the dividers entirely,
 * remove the `dividerFor` call in the JSX.
 */
function dividerFor(index: number): string {
  return index > 0 ? "sm:border-l" : "";
}

// Pre-reveal state, applied imperatively rather than rendered. Rendering it
// would mean the server HTML ships at opacity-0, leaving the copy invisible if
// hydration never happens; applying it from an effect guarantees the content is
// only ever hidden on a page that is definitely running JS and will reveal it.
const HIDDEN_CLASSES = ["opacity-0", "translate-y-3"];

export default function VehicleSpecs() {
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
    // Reduced motion (or no IntersectionObserver) skips the animation entirely
    // and leaves the section in its visible resting state.
    if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
      return;
    }

    content.classList.add(...HIDDEN_CLASSES);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          // Flipping this re-renders with the reveal classes appended, which
          // makes React rewrite className wholesale and drop the imperative
          // hidden classes above — that swap is what the transition animates.
          setRevealed(true);
          observer.disconnect();
        }
      },
      // Fires a little before the section's top edge reaches the viewport, so
      // the fade is finishing as it settles into view rather than starting then.
      { rootMargin: "0px 0px -12% 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="vehicle-details"
      // scroll-mt clears the fixed 72px nav so the smooth-scroll from the hero
      // lands on the section's top edge rather than tucking it under the bar.
      className="scroll-mt-[72px] border-t border-white/5 px-6 py-24 sm:px-12"
    >
      <div
        ref={contentRef}
        className={`mx-auto max-w-4xl transition-[opacity,transform] duration-700 ease-out ${
          revealed ? "translate-y-0 opacity-100" : ""
        }`}
      >
        <h2 className="font-display text-3xl leading-[1.05] tracking-tight text-[#E31C1C] sm:text-4xl">
          The Airframe
        </h2>
        <p className="mt-3 text-sm font-bold uppercase tracking-[0.16em] text-[#F5F5F7] sm:text-base">
          Built for the mission, not the spec sheet
        </p>
        <p className="mt-6 max-w-2xl text-lg leading-[1.7] text-[#F5F5F7]/75">
          Storm is a carbon-fiber quadcopter engineered for stability and
          endurance under real-world flight conditions, built in-house from the
          ground up, tested and validated at every stage.
        </p>

        {/* Stat strip. No cells or boxes — the numbers carry it, separated by
            whitespace and a hairline rule. */}
        <dl className="mt-14 flex flex-col gap-y-10">
          <div className="text-center">
            <dt className="sr-only">{DIMENSIONS.label}</dt>
            <dd className="font-mono text-4xl leading-none tracking-tight tabular-nums text-[#FFFFFF] sm:text-[2.75rem]">
              {DIMENSIONS.value}
            </dd>
            <p
              aria-hidden="true"
              className="mt-3 text-[0.65rem] font-semibold uppercase leading-tight tracking-[0.18em] text-[#4A4E6E]"
            >
              {DIMENSIONS.label}
            </p>
          </div>

          <div
            className="grid grid-cols-1 gap-y-10 border-t pt-10 sm:grid-cols-3"
            style={{ borderColor: SPEC_RULE }}
          >
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className={`px-4 text-center ${dividerFor(i)}`}
                style={{ borderLeftColor: SPEC_RULE }}
              >
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-mono text-4xl leading-none tracking-tight tabular-nums text-[#FFFFFF] sm:text-[2.75rem]">
                  {stat.value}
                </dd>
                <p
                  aria-hidden="true"
                  className="mt-3 text-[0.65rem] font-semibold uppercase leading-tight tracking-[0.18em] text-[#4A4E6E]"
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </dl>

        {/* Airframe configuration, in the same spec-row treatment the InfoPanel
            uses for subsystem specs — same component, not a restyled copy, so
            the two read as one system. Kept secondary to the strip above by
            size alone: these rows are ~13px against the stats' 44px, so no
            extra dimming is needed to establish the hierarchy. */}
        <div className="mt-14 max-w-xl">
          <SpecGrid specs={SUPPORTING} labelWidth="8.5rem" />
        </div>
      </div>
    </section>
  );
}
