import type { Metadata } from "next";
import {
  ComingSoonPanel,
  PageHero,
  PageSection,
  PageShell,
} from "@/components/layout/PageShell";

export const metadata: Metadata = {
  title: "Team | SkyXperts",
  description: "Meet the SkyXperts SUAS sub-teams and leadership.",
};

export default function TeamPage() {
  return (
    <PageShell>
      <PageHero
        label="Team"
        title={
          <>
            Meet the people behind
            <span className="block text-offwhite/85">the SkyXperts program.</span>
          </>
        }
        description="Sub-team leads, engineers, and operators working across mechanical, electrical, control, and computer vision."
      />
      <PageSection>
        <ComingSoonPanel message="Team profiles and leadership directory are on the way." />
      </PageSection>
    </PageShell>
  );
}
