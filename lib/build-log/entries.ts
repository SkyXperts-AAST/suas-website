import type { BuildLogEntry, SubTeamSlug } from "./types";

export const BUILD_LOG_ENTRIES: Record<SubTeamSlug, BuildLogEntry[]> = {
  "computer-vision": [
    {
      id: "cv-1",
      date: "2026-01-12",
      title: "Camera mount and baseline feed",
      summary:
        "Mounted the downward-facing camera, validated the raw video stream, and captured first calibration frames for the competition field.",
      image:
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1600&q=80",
      imageAlt: "Camera lens used for onboard computer vision",
      tags: ["hardware", "calibration"],
    },
    {
      id: "cv-2",
      date: "2026-02-03",
      title: "Detection pipeline prototype",
      summary:
        "Stood up an initial inference loop on recorded flight footage. Baseline model detects primary targets with acceptable latency on dev hardware.",
      image:
        "https://images.unsplash.com/photo-1555949963-aa79d882f981?auto=format&fit=crop&w=1600&q=80",
      imageAlt: "Developer workstation running a vision detection pipeline",
      tags: ["pipeline", "testing"],
    },
    {
      id: "cv-3",
      date: "2026-03-18",
      title: "Field dataset collection",
      summary:
        "Collected labeled samples from mock mission runs to improve robustness under changing lighting and motion blur.",
      image:
        "https://images.unsplash.com/photo-1508617889649-bda25532d250?auto=format&fit=crop&w=1600&q=80",
      imageAlt: "Drone flying outdoors during a field data collection session",
      tags: ["dataset", "field-test"],
    },
  ],
  control: [
    {
      id: "ctrl-1",
      date: "2026-01-08",
      title: "Autopilot integration baseline",
      summary:
        "Connected the flight stack to the airframe and verified manual flight modes, telemetry, and failsafe behavior.",
      image:
        "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1600&q=80",
      imageAlt: "Quadcopter in flight during autopilot integration testing",
      tags: ["autopilot", "safety"],
    },
    {
      id: "ctrl-2",
      date: "2026-02-14",
      title: "Waypoint mission framework",
      summary:
        "Implemented the first autonomous waypoint sequence and logging hooks for post-flight review.",
      image:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80",
      imageAlt: "Circuit board representing flight control hardware",
      tags: ["autonomy", "missions"],
    },
    {
      id: "ctrl-3",
      date: "2026-03-22",
      title: "Cross-subsystem interface tests",
      summary:
        "Ran end-to-end checks with electrical and computer vision to confirm command timing and sensor handoff.",
      image:
        "https://images.unsplash.com/photo-1581092160562-40a7363a8901?auto=format&fit=crop&w=1600&q=80",
      imageAlt: "Engineering workspace during subsystem integration testing",
      tags: ["integration", "testing"],
    },
  ],
  electrical: [
    {
      id: "elec-1",
      date: "2026-01-05",
      title: "Power distribution layout",
      summary:
        "Finalized the battery, ESC, and avionics power rails. Completed initial wiring diagram for the competition build.",
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=1600&q=80",
      imageAlt: "Electrical wiring and power distribution components",
      tags: ["power", "design"],
    },
    {
      id: "elec-2",
      date: "2026-02-09",
      title: "Sensor harness bring-up",
      summary:
        "Terminated and tested sensor connectors, verified signal integrity, and documented pinout changes for the team.",
      image:
        "https://images.unsplash.com/photo-1581092918056-9a055d0dace5?auto=format&fit=crop&w=1600&q=80",
      imageAlt: "Close-up of sensor connectors and avionics harness work",
      tags: ["wiring", "sensors"],
    },
    {
      id: "elec-3",
      date: "2026-03-10",
      title: "EMI and vibration checks",
      summary:
        "Inspected grounding paths and secured loose harness sections ahead of high-vibration flight testing.",
      image:
        "https://images.unsplash.com/photo-1621905251918-4940eaa20f41?auto=format&fit=crop&w=1600&q=80",
      imageAlt: "Technician inspecting electrical connections on hardware",
      tags: ["reliability", "testing"],
    },
  ],
  mechanical: [
    {
      id: "mech-1",
      date: "2026-01-15",
      title: "Airframe assembly v1",
      summary:
        "Completed the first full mechanical assembly, including landing gear, payload bay, and propulsion mounting.",
      image:
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80",
      imageAlt: "Mechanical assembly work on an engineering project",
      tags: ["assembly", "airframe"],
    },
    {
      id: "mech-2",
      date: "2026-02-20",
      title: "Structural load review",
      summary:
        "Reviewed arm stiffness and joint tolerances after initial hover tests. Identified reinforcements for high-G maneuvers.",
      image:
        "https://images.unsplash.com/photo-1565538810643-b5bdba259a72?auto=format&fit=crop&w=1600&q=80",
      imageAlt: "Drone airframe inspected for structural performance",
      tags: ["structures", "iteration"],
    },
    {
      id: "mech-3",
      date: "2026-03-25",
      title: "Quick-release payload mount",
      summary:
        "Prototyped a faster payload swap mechanism to reduce turnaround time between mission rehearsals.",
      image:
        "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1600&q=80",
      imageAlt: "Prototype mechanical component being refined in the lab",
      tags: ["payload", "prototype"],
    },
  ],
};

export function getEntriesForTeam(slug: SubTeamSlug): BuildLogEntry[] {
  return [...BUILD_LOG_ENTRIES[slug]].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}
