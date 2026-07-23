import type { GalleryItem } from "./types";

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "flight-test",
    title: "First autonomous flight",
    description:
      "Validating waypoint navigation and return-to-home behavior on our competition airframe.",
    image:
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1800&q=80",
    imageAlt: "Quadcopter hovering during an outdoor flight test",
    category: "Field test",
  },
  {
    id: "workshop",
    title: "Late-night integration",
    description:
      "Mechanical and electrical sub-teams aligning payload mounts before the next test window.",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1800&q=80",
    imageAlt: "Engineers working on drone hardware in a workshop",
    category: "Build",
  },
  {
    id: "payload",
    title: "Payload checkout",
    description:
      "Running sensor calibration and verifying data links before mission simulation runs.",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1800&q=80",
    imageAlt: "Camera and sensor payload mounted on a drone frame",
    category: "Systems",
  },
  {
    id: "ground-station",
    title: "Ground control setup",
    description:
      "Telemetry, video feed, and mission planning tools staged for live operator oversight.",
    image:
      "https://images.unsplash.com/photo-1555949963-aa79d882f981?auto=format&fit=crop&w=1800&q=80",
    imageAlt: "Operator workstation with monitors displaying flight data",
    category: "Operations",
  },
  {
    id: "field-day",
    title: "Mock mission day",
    description:
      "Full competition-style runs through search patterns, target acquisition, and recovery.",
    image:
      "https://images.unsplash.com/photo-1508617889649-bda25532d250?auto=format&fit=crop&w=1800&q=80",
    imageAlt: "Drone flying over an open field during a mock mission",
    category: "Field test",
  },
  {
    id: "team",
    title: "Team on the line",
    description:
      "Cross-sub-team review before a major integration milestone and flight readiness check.",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1800&q=80",
    imageAlt: "Engineering team collaborating around a table",
    category: "Team",
  },
  {
    id: "detail",
    title: "Precision assembly",
    description:
      "Fine-tuning motor mounts and prop balance to keep vibration out of the vision pipeline.",
    image:
      "https://images.unsplash.com/photo-1535378917042-10a22c959105?auto=format&fit=crop&w=1800&q=80",
    imageAlt: "Close-up of drone motor and propeller assembly",
    category: "Mechanical",
  },
  {
    id: "competition",
    title: "Competition ready",
    description:
      "Final systems check and packed airframes before heading to the SUAS competition field.",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1800&q=80",
    imageAlt: "Technology and aviation themed competition preparation scene",
    category: "Competition",
  },
];
