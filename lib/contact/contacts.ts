export type ContactReason =
  | "general"
  | "sponsorship"
  | "partnership"
  | "media"
  | "join-team"
  | "other";

/** Shared team inbox shown on the contact page and after successful submissions. */
export const TEAM_EMAIL = "SkyXperts@aast.edu";

export type TeamLead = {
  name: string;
  role: string;
  email: string;
};

export const TEAM_LEADS: TeamLead[] = [
  {
    name: "Yehia Alaa",
    role: "Team Leader",
    email: "ffathy2004@gmail.com",
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
