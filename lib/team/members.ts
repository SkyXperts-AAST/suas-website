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
  /** Group photo path under /public. */
  groupPhoto?: string;
};

function membersFromNames(names: string[]): TeamMember[] {
  return names.map((name) => ({
    name,
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
    "The Software team gives Storm its mind. They start from raw pixels and sensor noise and build the perception and decision-making that let the machine work out what matters and act on it in real time. When it's working, the flying looks deliberate instead of lucky.",
  computerVision: {
    blurb:
      "Computer Vision is how Storm sees, and how it makes sense of what it's looking at. The team stitches scattered aerial footage into clean, high-resolution maps, and it trains detection models that can find a single target in a messy landscape while the drone is still moving.",
    groupPhoto: "/team/vision.JPG",
    members: membersFromNames([
      "Abdulla Mahar",
      "Hossam Koshok",
      "Gomana Hossam",
      "Salma Khaled",
      "Farida Khaled",
      "Leena Gouda",
    ]),
  } satisfies SubTeamGroup,
  controlAndNavigation: {
    blurb:
      "Control & Navigation handles the reflexes. They keep Storm steady, hold it on course, and make the split-second calls during takeoff, landing, and whatever goes wrong in between. That last part is the difference between a drone that flies and one you can actually trust.",
    groupPhoto: "/team/control.JPG",
    members: membersFromNames([
      "Sameh Walid",
      "Andrew Ramez",
      "Youssef Ahmed",
      "Jana El Wazzan",
      "Habiba Ghoneim",
      "Nour Allam",
      "Darine Elkilany",
    ]),
  } satisfies SubTeamGroup,
};

export const subteams: Record<"Mechanical" | "Electrical", SubTeamGroup> = {
  Mechanical: {
    blurb:
      "Mechanical builds the body Storm lives in. They shape the airframe and structure, which has to stay light enough to fly and tough enough to survive landing after landing. It folds down to travel too, and they care about how it looks while it does all of that.",
    groupPhoto: "/team/mechanical.JPG",
    members: membersFromNames([
      "Yahia Alaa",
      "Salma",
      "Omar El-Sharkawy",
      "Omar Tawfik",
    ]),
  },
  Electrical: {
    blurb:
      "Electrical keeps Storm powered. They design the architecture behind every subsystem: batteries sized correctly, wiring kept clean, and current arriving where it's needed the moment it's needed, from the first spin of the props to the last.",
    groupPhoto: "/team/electrical.JPG",
    members: membersFromNames([
      "Aleyeldin",
      "Hassan El Shenawy",
      "Rodaina Ramy",
    ]),
  },
};

export type SubTeamTab = "Software" | "Mechanical" | "Electrical";

export const SUB_TEAM_TABS: SubTeamTab[] = [
  "Software",
  "Mechanical",
  "Electrical",
];
