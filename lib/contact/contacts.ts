export type ContactReason =
  | "general"
  | "sponsorship"
  | "partnership"
  | "media"
  | "join-team"
  | "other";

/** Recipient for the contact form's prefilled mailto. */
export const TEAM_EMAIL = "contact@skyxperts.org";

/** Shared team inbox listed in the direct-contact section. */
export const TEAM_INBOX = "SkyXperts@aast.edu";

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
    name: "Eng. Omar Ossama",
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
