export type ContactReason =
  | "general"
  | "sponsorship"
  | "partnership"
  | "media"
  | "join-team"
  | "other";

/** Shared team inbox: listed directly and used by the contact form's mailto. */
export const TEAM_EMAIL = "SkyXperts@aast.edu";

export type TeamLead = {
  name: string;
  role: string;
  email: string;
};

export const TEAM_LEADS: TeamLead[] = [
  {
    name: "Eng. Mohamed Ragab",
    role: "Co-Founder & President",
    email: "momahrous@edu.aau.at",
  },
  {
    name: "Eng. Omar Osama",
    role: "Team Leader",
    email: "O.Sharaf0255@student.aast.edu",
  },
];

export const CONTACT_REASONS: { value: ContactReason; label: string }[] = [
  { value: "general", label: "General inquiry" },
  { value: "sponsorship", label: "Sponsorship" },
  { value: "partnership", label: "Partnership" },
  { value: "media", label: "Media & press" },
  { value: "join-team", label: "Join the team" },
  { value: "other", label: "Other" },
];
