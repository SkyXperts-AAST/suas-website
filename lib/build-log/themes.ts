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

export const TEAM_THEMES: Record<SubTeamSlug, TeamTheme> = {
  "computer-vision": {
    label: "Perception",
    iconBg: "bg-sky-500/15",
    iconText: "text-sky-300",
    ring: "ring-sky-400/40",
    glow: "shadow-[0_0_40px_rgba(56,189,248,0.25)]",
    gradient: "from-sky-500/20 via-sky-400/5 to-transparent",
    timelineLine: "from-sky-400/80 via-sky-400/30 to-transparent",
    timelineDot: "border-sky-300 bg-sky-400",
    timelineDotGlow: "shadow-[0_0_16px_rgba(56,189,248,0.8)]",
    cardHover: "hover:border-sky-400/40 hover:shadow-[0_12px_40px_rgba(56,189,248,0.12)]",
    tag: "border-sky-400/20 bg-sky-500/10 text-sky-200",
    date: "text-sky-300",
  },
  control: {
    label: "Autonomy",
    iconBg: "bg-violet-500/15",
    iconText: "text-violet-300",
    ring: "ring-violet-400/40",
    glow: "shadow-[0_0_40px_rgba(167,139,250,0.25)]",
    gradient: "from-violet-500/20 via-violet-400/5 to-transparent",
    timelineLine: "from-violet-400/80 via-violet-400/30 to-transparent",
    timelineDot: "border-violet-300 bg-violet-400",
    timelineDotGlow: "shadow-[0_0_16px_rgba(167,139,250,0.8)]",
    cardHover: "hover:border-violet-400/40 hover:shadow-[0_12px_40px_rgba(167,139,250,0.12)]",
    tag: "border-violet-400/20 bg-violet-500/10 text-violet-200",
    date: "text-violet-300",
  },
  electrical: {
    label: "Avionics",
    iconBg: "bg-amber-500/15",
    iconText: "text-amber-300",
    ring: "ring-amber-400/40",
    glow: "shadow-[0_0_40px_rgba(251,191,36,0.25)]",
    gradient: "from-amber-500/20 via-amber-400/5 to-transparent",
    timelineLine: "from-amber-400/80 via-amber-400/30 to-transparent",
    timelineDot: "border-amber-300 bg-amber-400",
    timelineDotGlow: "shadow-[0_0_16px_rgba(251,191,36,0.8)]",
    cardHover: "hover:border-amber-400/40 hover:shadow-[0_12px_40px_rgba(251,191,36,0.12)]",
    tag: "border-amber-400/20 bg-amber-500/10 text-amber-200",
    date: "text-amber-300",
  },
  mechanical: {
    label: "Structures",
    iconBg: "bg-rose-500/15",
    iconText: "text-rose-300",
    ring: "ring-rose-400/40",
    glow: "shadow-[0_0_40px_rgba(251,113,133,0.22)]",
    gradient: "from-rose-500/20 via-rose-400/5 to-transparent",
    timelineLine: "from-rose-400/80 via-rose-400/30 to-transparent",
    timelineDot: "border-rose-300 bg-rose-400",
    timelineDotGlow: "shadow-[0_0_16px_rgba(251,113,133,0.75)]",
    cardHover: "hover:border-rose-400/40 hover:shadow-[0_12px_40px_rgba(251,113,133,0.12)]",
    tag: "border-rose-400/20 bg-rose-500/10 text-rose-200",
    date: "text-rose-300",
  },
};

export function getTeamTheme(slug: SubTeamSlug): TeamTheme {
  return TEAM_THEMES[slug];
}
