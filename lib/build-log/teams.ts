import type { SubTeam, SubTeamSlug } from "./types";

export const SUB_TEAMS: SubTeam[] = [
  {
    slug: "computer-vision",
    name: "Computer Vision",
    description:
      "Updates on perception pipelines, camera integration, and onboard detection.",
  },
  {
    slug: "control",
    name: "Control",
    description:
      "Flight software, autonomy logic, and mission behavior development.",
  },
  {
    slug: "electrical",
    name: "Electrical",
    description:
      "Power systems, avionics wiring, PCB bring-up, and sensor integration.",
  },
  {
    slug: "mechanical",
    name: "Mechanical",
    description:
      "Airframe design, manufacturing, assembly, and structural testing.",
  },
];

export function getSubTeam(slug: string): SubTeam | undefined {
  return SUB_TEAMS.find((team) => team.slug === slug);
}

export function isSubTeamSlug(slug: string): slug is SubTeamSlug {
  return SUB_TEAMS.some((team) => team.slug === slug);
}
