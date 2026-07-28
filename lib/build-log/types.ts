import type { BuildLogImagePosition } from "./imagePosition";

export type SubTeamSlug =
  | "computer-vision"
  | "control"
  | "electrical"
  | "mechanical";

export type BuildLogContentBlock =
  | { type: "paragraph"; text: string }
  | {
      type: "image";
      src: string;
      /** CSS object-position, e.g. "center", "top", "50% 30%". Defaults to center. */
      position?: BuildLogImagePosition;
      alt: string;
      caption?: string;
    }
  | { type: "list"; heading?: string; items: string[] };

export type BuildLogEntry = {
  id: string;
  date: string;
  title: string;
  /** Short preview shown on collapsed cards and when `body` is omitted. */
  summary: string;
  image: string;
  /** CSS object-position for the hero / timeline thumbnail. */
  imagePosition?: BuildLogImagePosition;
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
