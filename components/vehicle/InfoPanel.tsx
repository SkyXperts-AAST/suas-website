"use client";

import { useState } from "react";
import { subsystemLabel } from "@/lib/vehicle/subsystemLookup";
import { subsystemContent } from "@/lib/vehicle/subsystemContent";
import { groupIdsEqual, type GroupId } from "@/lib/vehicle/groupId";

export interface TourState {
  /** Zero-based index of the current stop. */
  index: number;
  total: number;
  onNext: () => void;
  onEnd: () => void;
}

interface InfoPanelProps {
  selectedGroup: GroupId | null;
  onClose: () => void;
  /** Non-null while the guided tour is running; adds the tour footer. */
  tour?: TourState | null;
}

const HAIRLINE = "rgba(255, 255, 255, 0.08)";

export default function InfoPanel({
  selectedGroup,
  onClose,
  tour = null,
}: InfoPanelProps) {
  // Hold the last selection so the panel still has something to render while
  // it animates *out*. Without this the copy vanishes on the first frame of
  // the close transition and the panel slides away as an empty card.
  const [shown, setShown] = useState<GroupId | null>(selectedGroup);
  if (selectedGroup && !groupIdsEqual(selectedGroup, shown)) setShown(selectedGroup);

  const open = selectedGroup !== null;
  const content = shown ? subsystemContent(shown.subsystem) : null;

  return (
    <aside
      role="dialog"
      aria-hidden={!open}
      // Keeps the close button out of the tab order while the panel is parked
      // off-screen — aria-hidden alone would leave a focusable hidden control.
      inert={!open}
      aria-label={shown ? subsystemLabel(shown.subsystem) : undefined}
      className={[
        // Mobile: bottom sheet, inset from the edges, height-capped and
        // scrollable so a long rationale can't swallow the viewer. The cap is
        // mirrored by PANEL_SHEET_FRAC in VehicleCanvas, which pans the
        // selected component into the band above the sheet — raising it here
        // without raising it there parks components behind the panel.
        "absolute inset-x-3 bottom-3 z-20 max-h-[45%] overflow-y-auto rounded-2xl",
        // md+: floating right-hand rail. Inset on all sides (rather than flush
        // to the viewport) so the drop shadow has somewhere to fall and the
        // card reads as hovering over the scene.
        "md:inset-x-auto md:top-4 md:right-4 md:bottom-4 md:max-h-none md:w-[26rem] md:max-w-[calc(100%-2rem)]",
        "text-[#F5F5F7] transition-[transform,opacity] duration-300 ease-out",
        open
          ? "translate-y-0 opacity-100 md:translate-x-0"
          : // Slides down on mobile / right on desktop, and fades — the fade is
            // what keeps it from reading as an abrupt snap.
            "pointer-events-none translate-y-[calc(100%+1.5rem)] opacity-0 md:translate-x-[calc(100%+2rem)] md:translate-y-0",
      ].join(" ")}
      style={{
        background: "rgba(10, 14, 63, 0.55)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        border: `1px solid ${HAIRLINE}`,
        // Accent stripe: solid red, full height of the left edge, at every
        // breakpoint — it's the panel's identity mark, not a rail-only detail.
        borderLeft: "3px solid #E31C1C",
        // Thrown toward the canvas (left / up) so the card lifts off the scene
        // rather than looking pinned to the viewport edge.
        boxShadow: "-18px 22px 60px rgba(0, 0, 0, 0.5)",
      }}
    >
      {content && shown && (
        <div className="flex flex-col p-6">
          {/* Header row: title + close, on one line. */}
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="text-2xl leading-[1.1] tracking-tight text-[#FFFFFF]">
                {subsystemLabel(shown.subsystem)}
              </h2>
              {shown.armIndex !== undefined && (
                <p className="mt-1 font-display text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[#E31C1C]">
                  Arm {shown.armIndex + 1}
                </p>
              )}
              {content.summary && (
                <p className="mt-2 text-sm leading-relaxed text-[#F5F5F7]/65">
                  {content.summary}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              aria-label="Close panel"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 text-base leading-none text-[#F5F5F7]/70 transition-colors hover:border-[#E31C1C] hover:bg-[#E31C1C]/20 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E31C1C]"
            >
              <span aria-hidden="true">✕</span>
            </button>
          </div>

          <div className="my-5 h-px w-full" style={{ background: HAIRLINE }} />

          {/* Spec block. Fixed row rhythm, so swapping placeholder values for
              real ones never changes the panel's height budget. */}
          <dl className="flex flex-col gap-3">
            {content.specs.map((spec) => (
              <div
                key={spec.label}
                className="flex items-baseline justify-between gap-4"
              >
                <dt className="text-xs uppercase tracking-[0.12em] text-[#4A4E6E]">
                  {spec.label}
                </dt>
                <dd className="text-right font-mono text-sm tabular-nums text-[#F5F5F7]">
                  {spec.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="my-5 h-px w-full" style={{ background: HAIRLINE }} />

          {/* Rationale — lighter and smaller than the headers, generous leading. */}
          <p className="text-sm font-light leading-[1.6] text-[#F5F5F7]/80">
            {content.rationale}
          </p>

          {/* Tour footer. Only present while the guided tour is running, so the
              panel's normal reading layout is unaffected. */}
          {tour && (
            <>
              <div className="my-5 h-px w-full" style={{ background: HAIRLINE }} />
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-xs tracking-wider text-[#4A4E6E]">
                  {tour.index + 1} / {tour.total}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={tour.onEnd}
                    className="rounded-full border border-white/15 px-4 py-1.5 text-xs font-semibold text-[#F5F5F7]/80 transition hover:border-white/40 hover:bg-white/5 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5F5F7]/60"
                  >
                    End Tour
                  </button>
                  <button
                    onClick={tour.onNext}
                    className="rounded-full bg-[#E31C1C] px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-[#c81616] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E31C1C]"
                  >
                    {tour.index + 1 === tour.total ? "Finish" : "Next →"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </aside>
  );
}
