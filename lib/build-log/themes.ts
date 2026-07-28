import type { SubTeamSlug } from "./types";

export type TeamTheme = {
  label: string;
  iconBg: string;
  iconText: string;
  ring: string;
  cardHover: string;
  tag: string;
  date: string;
};

/** Shared SkyXperts brand styling — navy, offwhite, accent red. */
const SITE_TEAM_THEME: Omit<TeamTheme, "label"> = {
  iconBg: "bg-accent/15",
  iconText: "text-accent",
  ring: "ring-accent/40",
  cardHover:
    "hover:border-accent/40 hover:shadow-[0_12px_40px_rgba(227,28,28,0.12)]",
  tag: "border-accent/20 bg-accent/10 text-accent",
  date: "text-accent",
};

const TEAM_LABELS: Record<SubTeamSlug, string> = {
  "computer-vision": "Perception",
  control: "Autonomy",
  electrical: "Avionics",
  mechanical: "Structures",
};

export const TEAM_THEMES: Record<SubTeamSlug, TeamTheme> = {
  "computer-vision": { ...SITE_TEAM_THEME, label: TEAM_LABELS["computer-vision"] },
  control: { ...SITE_TEAM_THEME, label: TEAM_LABELS.control },
  electrical: { ...SITE_TEAM_THEME, label: TEAM_LABELS.electrical },
  mechanical: { ...SITE_TEAM_THEME, label: TEAM_LABELS.mechanical },
};

export function getTeamTheme(slug: SubTeamSlug): TeamTheme {
  return TEAM_THEMES[slug];
}
