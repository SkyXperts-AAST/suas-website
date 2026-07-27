export type ContactReason =
  | "general"
  | "sponsorship"
  | "partnership"
  | "media"
  | "join-team"
  | "other";

export const TEAM_EMAIL = "contact@skyxperts.org";

export const CONTACT_REASONS: { value: ContactReason; label: string }[] = [
  { value: "general", label: "General inquiry" },
  { value: "sponsorship", label: "Sponsorship" },
  { value: "partnership", label: "Partnership" },
  { value: "media", label: "Media & press" },
  { value: "join-team", label: "Join the team" },
  { value: "other", label: "Other" },
];
