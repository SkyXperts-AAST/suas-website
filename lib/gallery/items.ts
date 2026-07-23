import type { GalleryItem } from "./types";

// Only list photos that exist in public/gallery/.
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
    id: "field-capture",
    title: "Field operations",
    description:
      "Live capture from a recent field session — checking systems behavior between mission runs.",
    image: "/gallery/vlcsnap-2026-06-28-17h30m02s086.png",
    imageAlt: "Field operations capture from a recent SkyXperts test session",
    category: "Operations",
  },
];
