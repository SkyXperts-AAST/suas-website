export type SubTeamSlug =
  | "computer-vision"
  | "control"
  | "electrical"
  | "mechanical";

export type BuildLogEntry = {
  id: string;
  date: string;
  title: string;
  summary: string;
  image: string;
  imageAlt: string;
  tags?: string[];
};

export type SubTeam = {
  slug: SubTeamSlug;
  name: string;
  description: string;
};
