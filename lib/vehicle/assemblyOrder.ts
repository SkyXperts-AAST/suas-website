/**
 * Assembly sequencing for the home page's "scroll to assemble" chapter.
 *
 * Deliberately free of any `three` import: the build checklist and the scroll
 * bookkeeping in DroneAssemblyScroll need these, but that component must stay
 * loadable without pulling the 3D stack into the bundle — mobile renders a
 * static image and never mounts the canvas at all.
 */

export const ASSEMBLY_ORDER = [
  "avionicsHousing",
  "battery",
  "esc",
  "companionComputer",
  "camera",
  "payload",
  "motor:0",
  "motor:1",
  "motor:2",
  "motor:3",
] as const;

export interface AssemblyScrollApi {
  progress: number;
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function clamp01(t: number) {
  return Math.min(1, Math.max(0, t));
}

export function assemblyProgressForGroup(
  scrollProgress: number,
  groupKey: string
): number {
  const index = ASSEMBLY_ORDER.indexOf(
    groupKey as (typeof ASSEMBLY_ORDER)[number]
  );
  if (index < 0) return scrollProgress;

  const count = ASSEMBLY_ORDER.length;
  // Sequential windows so fewer parts move through the core at once.
  const delay = (index / count) * 0.34;
  const duration = 0.36;
  return easeOutCubic(clamp01((scrollProgress - delay) / duration));
}
