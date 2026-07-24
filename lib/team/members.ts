export type TeamMember = {
  name: string;
  role: string;
  /** Optional photo path under /public — leave unset for placeholder avatar. */
  photo?: string;
  /** Faculty supervisor gets subtle distinct treatment in the Leadership grid. */
  isSupervisor?: boolean;
};

export type SubTeamGroup = {
  blurb: string;
  members: TeamMember[];
  /** Optional group photo for list layouts (e.g. Mechanical). */
  groupPhoto?: string;
};

function placeholderMembers(
  count: number,
  labelPrefix = "Member",
): TeamMember[] {
  return Array.from({ length: count }, (_, i) => ({
    name: `${labelPrefix} ${i + 1}`,
    role: "Team Member",
  }));
}

export const leadership: TeamMember[] = [
  {
    name: "Prof. Mohamed Abou El Azm",
    role: "Supervisor / Dean of Student Affairs",
    isSupervisor: true,
    photo: "/team/leadership/prof-mohamed-abou-el-azm.jpeg",
  },
  {
    name: "Mohamed Ragab",
    role: "Co-Founder",
    photo: "/team/leadership/mohamed-ragab.jpeg",
  },
  {
    name: "Omar Ossama",
    role: "Team Lead",
    photo: "/team/leadership/omar-ossama.jpg",
  },
  {
    name: "Habiba Amr",
    role: "Software Head",
    photo: "/team/leadership/habiba-amr.jpg",
  },
  {
    name: "Yehia Alaa",
    role: "Mechanical Head",
    photo: "/team/leadership/yehia-alaa.jpg",
  },
  {
    name: "Hassan Yasser",
    role: "Electrical Head",
    photo: "/team/leadership/hassan-yasser.jpg",
  },
];

export const softwareGroups = {
  blurb:
    "The Software team builds the intelligence that lets Storm fly, see, and decide on its own — turning raw sensor data into real-time flight and mission decisions.",
  computerVision: {
    blurb:
      "Computer Vision builds the detection and mapping pipeline for Storm's Risk Mapping and Search, Detect, and Deliver tasks — stitching aerial imagery into high-resolution maps and running object detection models to locate the mannequin and tent targets within the Search Boundary in real time.",
    members: placeholderMembers(5),
  } satisfies SubTeamGroup,
  controlAndNavigation: {
    blurb:
      "Control & Navigation develops the flight control and autopilot logic that keeps Storm within 100ft of every waypoint at up to 150ft turn radius, manages autonomous takeoff/landing, and handles failsafes like return-to-home and flight termination on comms loss.",
    members: placeholderMembers(5),
  } satisfies SubTeamGroup,
};

export const subteams: Record<"Mechanical" | "Electrical", SubTeamGroup> = {
  Mechanical: {
    blurb:
      "The Mechanical team designs Storm's airframe, delivery mechanism, and structural layout — engineering a sub-35lb airframe that survives repeated autonomous landings, packs down to a transportable size, and reliably releases the strobing beacon and water bottle payloads mid-flight.",
    // TODO: replace with real Mechanical group photo
    groupPhoto: "/drone.png",
    members: placeholderMembers(5),
  },
  Electrical: {
    blurb:
      "Electrical designs Storm's power distribution and avionics wiring — sizing battery packs under the 100Wh-per-cell limit, integrating the flight controller, ESCs, and Remote ID module, and ensuring clean, reliable power delivery from takeoff through a full mission cycle.",
    members: placeholderMembers(5),
  },
};

export type SubTeamTab = "Software" | "Mechanical" | "Electrical";

export const SUB_TEAM_TABS: SubTeamTab[] = [
  "Software",
  "Mechanical",
  "Electrical",
];
