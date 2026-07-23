import type { Metadata } from "next";
import {
  ComingSoonPanel,
  PageHero,
  PageSection,
  PageShell,
} from "@/components/layout/PageShell";

export const metadata: Metadata = {
  title: "Sponsorships | SkyXperts",
  description: "Partner with SkyXperts SUAS and support our competition program.",
};

export default function SponsorshipsPage() {
  return (
    <PageShell>
      <PageHero
        label="Sponsorships"
        title={
          <>
            Partner with SkyXperts
            <span className="block text-offwhite/85">and fuel the mission.</span>
          </>
        }
        description="Help us design, build, and fly competitive autonomous systems through sponsorship and in-kind support."
      />
      <PageSection>
        <ComingSoonPanel message="Sponsorship tiers and partnership details are coming soon." />
      </PageSection>
    </PageShell>
  );
}
