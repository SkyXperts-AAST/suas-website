/** Plain data shapes for everything in /content. Safe to import anywhere. */

export type Person = {
  id: string;
  name: string;
  photo?: string;
  linkedin?: string;
};

export type Sponsor = {
  id: string;
  name: string;
  logo?: string;
  url?: string;
};

export type SeasonRole = { person: Person; role: string };

export type SubTeam = {
  id: string;
  name: string;
  summary?: string;
  lead?: Person;
  members: Person[];
};

export type Department = {
  id: string;
  name: string;
  summary?: string;
  lead?: Person;
  teams: SubTeam[];
};

export type Competition = {
  name: string;
  edition: string;
  vehicle?: string;
  results: string[];
};

export type Milestone = { date: string; title: string; detail?: string };

export type Season = {
  id: string;
  label: string;
  current: boolean;
  title: string;
  summary: string;
  milestones: Milestone[];
  competitions: Competition[];
  vehicles: string[];
  sponsors: Sponsor[];
  leadership: SeasonRole[];
  mentors: Person[];
  structure: Department[];
  recruitment?: { open: boolean; note: string; url?: string };
};

export type FleetKind = "multirotor" | "vtol" | "fixed-wing" | "ugv" | "project";
export type FleetStatus = "active" | "development" | "retired";

export const FLEET_KIND_LABEL: Record<FleetKind, string> = {
  multirotor: "Multirotor",
  vtol: "VTOL",
  "fixed-wing": "Fixed-wing",
  ugv: "Ground vehicle",
  project: "Side project",
};

export const FLEET_STATUS_LABEL: Record<FleetStatus, string> = {
  active: "Active",
  development: "In development",
  retired: "Retired",
};

export type Vehicle = {
  slug: string;
  name: string;
  kind: FleetKind;
  status: FleetStatus;
  seasons: string[];
  tagline: string;
  summary: string;
  /** Cut-out render or photo on transparent background, for cards. */
  image?: string;
  /** Full-bleed photo for the detail page hero. */
  photo?: string;
  specs: { label: string; value: string }[];
  achievements: string[];
};

export type PostType = "build-log" | "story" | "recap" | "tutorial" | "announcement";

export const POST_TYPE_LABEL: Record<PostType, string> = {
  "build-log": "Build log",
  story: "Story",
  recap: "Recap",
  tutorial: "Tutorial",
  announcement: "Announcement",
};

export type Post = {
  slug: string;
  title: string;
  date: string;
  type: PostType;
  season: string;
  team?: string;
  teamName?: string;
  authors: Person[];
  summary: string;
  cover?: string;
  coverAlt?: string;
  tags: string[];
  readingMinutes: number;
  /** Rendered from the Markdown body at build time. */
  html: string;
};

/** Post data without the rendered body, for lists passed to client components. */
export type PostSummary = Omit<Post, "html">;

export function formatDate(iso: string, style: "long" | "short" = "long"): string {
  const date = new Date(`${iso}T00:00:00Z`);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: style === "long" ? "long" : "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
