import type { SubTeamSlug } from "@/lib/build-log/types";

export type TeamHeadContact = {
  slug: SubTeamSlug;
  name: string;
  role: string;
  phone: string;
  email: string;
};

export type ContactReason =
  | "general"
  | "sponsorship"
  | "partnership"
  | "media"
  | "join-team"
  | "other";

export const TEAM_EMAIL = "contact@skyxperts.org";

export const TEAM_HEADS: TeamHeadContact[] = [
  {
    slug: "computer-vision",
    name: "Team Head Name",
    role: "Computer Vision Lead",
    phone: "+20 100 000 0001",
    email: "cv@skyxperts.org",
  },
  {
    slug: "control",
    name: "Team Head Name",
    role: "Control Lead",
    phone: "+20 100 000 0002",
    email: "control@skyxperts.org",
  },
  {
    slug: "electrical",
    name: "Team Head Name",
    role: "Electrical Lead",
    phone: "+20 100 000 0003",
    email: "electrical@skyxperts.org",
  },
  {
    slug: "mechanical",
    name: "Team Head Name",
    role: "Mechanical Lead",
    phone: "+20 100 000 0004",
    email: "mechanical@skyxperts.org",
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
