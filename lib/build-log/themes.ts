import type { SubTeamSlug } from "./types";

export type TeamTheme = {
  label: string;
  iconBg: string;
  iconText: string;
  ring: string;
  glow: string;
  gradient: string;
  timelineLine: string;
  timelineDot: string;
  timelineDotGlow: string;
  cardHover: string;
  tag: string;
  date: string;
};

export type HeroSceneTheme = {
  radialGlow: string;
  ambientLight: string;
  keyLight: string;
  fillLight: string;
  rimLight: string;
  hemisphereTop: string;
  hemisphereBottom: string;
};

/** Shared SkyXperts brand styling — navy, offwhite, accent red. */
const SITE_TEAM_THEME: Omit<TeamTheme, "label"> = {
  iconBg: "bg-accent/15",
  iconText: "text-accent",
  ring: "ring-accent/40",
  glow: "shadow-[0_0_40px_rgba(227,28,28,0.22)]",
  gradient: "from-accent/20 via-accent/5 to-transparent",
  timelineLine: "from-accent/80 via-accent/30 to-transparent",
  timelineDot: "border-accent/80 bg-accent",
  timelineDotGlow: "shadow-[0_0_16px_rgba(227,28,28,0.75)]",
  cardHover:
    "hover:border-accent/40 hover:shadow-[0_12px_40px_rgba(227,28,28,0.12)]",
  tag: "border-accent/20 bg-accent/10 text-accent",
  date: "text-accent",
};

const SITE_HERO_SCENE: HeroSceneTheme = {
  radialGlow:
    "radial-gradient(circle at 50% 38%, rgba(227,28,28,0.16), transparent 54%)",
  ambientLight: "#e8eaed",
  keyLight: "#f5f5f7",
  fillLight: "#c8cdd4",
  rimLight: "#e31c1c",
  hemisphereTop: "#f5f5f7",
  hemisphereBottom: "#0a1628",
};

const TEAM_LABELS: Record<SubTeamSlug, string> = {
  "computer-vision": "Perception",
  control: "Autonomy",
  electrical: "Avionics",
  mechanical: "Structures",
};

export const HERO_SCENE_THEMES: Record<SubTeamSlug, HeroSceneTheme> = {
  "computer-vision": SITE_HERO_SCENE,
  control: SITE_HERO_SCENE,
  electrical: SITE_HERO_SCENE,
  mechanical: SITE_HERO_SCENE,
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

export function getHeroSceneTheme(_slug: SubTeamSlug): HeroSceneTheme {
  return SITE_HERO_SCENE;
}
