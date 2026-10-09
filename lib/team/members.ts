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

export const mentors: TeamMember[] = [
  {
    name: "Mohammed Ragab",
    role: "Mentor",
    photo: "/team/leadership/Mentors/Mohammed-Ragab.jpg",
  },
  {
    name: "Abdelrahman Hikal",
    role: "Mentor",
    photo: "/team/leadership/Mentors/Abdelrahman-Hikal.png",
  },
  {
    name: "Ahmed El Sayed",
    role: "Mentor",
    photo: "/team/leadership/Mentors/Ahmed-El-Sayed.jpg",
  },
  {
    name: "Aya Ragab",
    role: "Mentor",
    photo: "/team/leadership/Mentors/Aya-Ragab.jpg",
  },
  {
    name: "Belal Abo El Khier",
    role: "Mentor",
    photo: "/team/leadership/Mentors/Belal-Abo-El-Khier.jpg",
  },
  {
    name: "Fares Fathy",
    role: "Mentor",
    photo: "/team/leadership/Mentors/Fares-Fathy.jpg",
  },
  {
    name: "Moustafa Adly",
    role: "Mentor",
    photo: "/team/leadership/Mentors/Moustafa-Adly.jpg",
  },
  {
    name: "Omar Aman",
    role: "Mentor",
    photo: "/team/leadership/Mentors/Omar-Aman.jpg",
  },
  {
    name: "Osama Hesham",
    role: "Mentor",
    photo: "/team/leadership/Mentors/Osama-Hesham.jpg",
  },
  {
    name: "Yehia Sharawy",
    role: "Mentor",
    photo: "/team/leadership/Mentors/Yehia-Sharawy.jpeg",
  },
  {
    name: "Youssef Mehana",
    role: "Mentor",
    photo: "/team/leadership/Mentors/Youssef-Mehana.jpg",
  },
];

export const leadership: TeamMember[] = [
  {
    name: "Yehia Alaa",
    role: "Team Leader",
    photo: "/team/leadership/yehia-alaa.jpg",
  },
  {
    name: "Nour Allam",
    role: "Software Head",
  },
];

export const softwareGroups = {
  blurb:
    "The Software team gives Storm its mind. They start from raw pixels and sensor noise and build the perception and decision-making that let the machine work out what matters and act on it in real time. When it's working, the flying looks deliberate instead of lucky.",
  computerVision: {
    blurb:
      "Computer Vision is how Storm sees, and how it makes sense of what it's looking at. The team stitches scattered aerial footage into clean, high-resolution maps, and it trains detection models that can find a single target in a messy landscape while the drone is still moving.",
    groupPhoto: "/team/vision.JPG",
    members: membersFromNames(["Yasmin Ahmed"]),
  } satisfies SubTeamGroup,
  controlAndNavigation: {
    blurb:
      "Control & Navigation handles the reflexes. They keep Storm steady, hold it on course, and make the split-second calls during takeoff, landing, and whatever goes wrong in between. That last part is the difference between a drone that flies and one you can actually trust.",
    groupPhoto: "/team/control.JPG",
    members: membersFromNames([
      "Nour Allam",
      "Jana El Wazzan",
      "Darine Elkilany",
      "Omar Abdrabo",
    ]),
  } satisfies SubTeamGroup,
};

export const subteams: Record<"Mechanical" | "Electrical" | "Web Dev" | "Media", SubTeamGroup> = {
  Mechanical: {
    blurb:
      "Mechanical builds the body everything else bolts onto. They shape the airframe and structure, which has to stay light enough to fly and tough enough to survive landing after landing. It folds down to travel too, and they care about how it looks while it does all of that.",
    groupPhoto: "/team/mechanical.JPG",
    members: membersFromNames(["Salma"]),
  },
  Electrical: {
    blurb:
      "Electrical keeps Storm powered. They design the architecture behind every subsystem: batteries sized correctly, wiring kept clean, and current arriving where it's needed the moment it's needed, from the first spin of the props to the last.",
    groupPhoto: "/team/electrical.JPG",
    members: [],
  },
  "Web Dev": {
    blurb:
      "Web Dev keeps SkyXperts connected to the world. They build the website, refine the team's digital presence, and turn technical work into a clear and polished story for sponsors, judges, and the public.",
    members: membersFromNames(["Yasmin Ahmed"]),
  },
  Media: {
    blurb:
      "Media captures the story behind the project. They document flights, meetings, and milestones and turn the team's progress into visuals that communicate the hard work behind every build.",
    members: membersFromNames(["Salma"]),
  },
};

export type SubTeamTab = "Software" | "Mechanical" | "Electrical" | "Web Dev" | "Media";

export const SUB_TEAM_TABS: SubTeamTab[] = [
  "Software",
  "Mechanical",
  "Electrical",
  "Web Dev",
  "Media",
];
