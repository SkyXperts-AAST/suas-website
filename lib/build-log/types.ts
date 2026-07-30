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
      /** Real pixel dimensions of the source file. Lets the figure render at the image's true aspect ratio instead of being cropped into a fixed box. */
      width?: number;
      height?: number;
    }
  | { type: "list"; heading?: string; items: string[] };

export type BuildLogEntry = {
  id: string;
  date: string;
  title: string;
  /** Short preview shown on collapsed cards and when `body` is omitted. */
  summary: string;
  /** Optional until a real photo is added. */
  image?: string;
  /** CSS object-position for the hero / timeline thumbnail. */
  imagePosition?: BuildLogImagePosition;
  imageAlt?: string;
  /** Real pixel dimensions of `image`. Lets the hero render at the image's true aspect ratio instead of being cropped into a fixed 16:9 box. */
  imageWidth?: number;
  imageHeight?: number;
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
