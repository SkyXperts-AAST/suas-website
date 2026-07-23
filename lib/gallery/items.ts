import type { GalleryItem } from "./types";

// Drop image files in public/gallery/ — use .jpg or .png (match the path for each entry).
export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "flight-test",
    title: "First autonomous flight",
    description:
      "Validating waypoint navigation and return-to-home behavior on our competition airframe.",
    image: "/gallery/flight-test.jpg",
    imageAlt: "Quadcopter hovering during an outdoor flight test",
    category: "Field test",
  },
  {
    id: "workshop",
    title: "Late-night integration",
    description:
      "Mechanical and electrical sub-teams aligning payload mounts before the next test window.",
    image: "/gallery/workshop.jpg",
    imageAlt: "Engineers working on drone hardware in a workshop",
    category: "Build",
  },
  {
    id: "payload",
    title: "Payload checkout",
    description:
      "Running sensor calibration and verifying data links before mission simulation runs.",
    image: "/gallery/payload.jpg",
    imageAlt: "Camera and sensor payload mounted on a drone frame",
    category: "Systems",
  },
  {
    id: "ground-station",
    title: "Ground control setup",
    description:
      "Telemetry, video feed, and mission planning tools staged for live operator oversight.",
    image: "/gallery/ground-station.jpg",
    imageAlt: "Operator workstation with monitors displaying flight data",
    category: "Operations",
  },
  {
    id: "field-day",
    title: "Mock mission day",
    description:
      "Full competition-style runs through search patterns, target acquisition, and recovery.",
    image: "/gallery/field-day.png",
    imageAlt: "Drone flying over an open field during a mock mission",
    category: "Field test",
  },
  {
    id: "team",
    title: "Team on the line",
    description:
      "Cross-sub-team review before a major integration milestone and flight readiness check.",
    image: "/gallery/team.jpg",
    imageAlt: "Engineering team collaborating around a table",
    category: "Team",
  },
  {
    id: "detail",
    title: "Precision assembly",
    description:
      "Fine-tuning motor mounts and prop balance to keep vibration out of the vision pipeline.",
    image: "/gallery/detail.jpg",
    imageAlt: "Close-up of drone motor and propeller assembly",
    category: "Mechanical",
  },
  {
    id: "competition",
    title: "Competition ready",
    description:
      "Final systems check and packed airframes before heading to the SUAS competition field.",
    image: "/gallery/competition.jpg",
    imageAlt: "Technology and aviation themed competition preparation scene",
    category: "Competition",
  },
];
