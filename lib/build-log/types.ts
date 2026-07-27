export type SubTeamSlug =
  | "computer-vision"
  | "control"
  | "electrical"
  | "mechanical";

export type BuildLogContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "list"; heading?: string; items: string[] };

export type BuildLogEntry = {
  id: string;
  date: string;
  title: string;
  /** Short preview shown on collapsed cards and when `body` is omitted. */
  summary: string;
  image: string;
  imageAlt: string;
  tags?: string[];
  /** Full entry content. Use `image` blocks to place photos between paragraphs. */
  body?: BuildLogContentBlock[];
};

export type SubTeam = {
  slug: SubTeamSlug;
  name: string;
  description: string;
};

export type BuildLogEntriesFile = Record<SubTeamSlug, BuildLogEntry[]>;
