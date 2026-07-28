"use client";

import type { ReactNode } from "react";
import SubTeamNav from "@/components/build-log/SubTeamNav";
import {
  BuildLogReadingProvider,
  BuildLogReadingSwitch,
} from "@/components/build-log/BuildLogReadingMode";
import { PageHero, PageSection, PageShell } from "@/components/layout/PageShell";

export default function BuildLogLayoutClient({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <BuildLogReadingProvider>
      <BuildLogReadingSwitch />
      <PageShell className="build-log-page-shell overflow-x-clip">
        <PageHero
          className="build-log-hero max-md:[&>div]:px-4 max-md:[&>div]:py-10"
          label="Build Log"
          title={
            <>
              Engineering progress,
              <span className="block text-offwhite/85">
                one milestone at a time.
              </span>
            </>
          }
          titleClassName="text-3xl leading-[1.08] md:text-6xl md:leading-[1.02]"
          description="Track each sub-team's build journey through a living timeline of design decisions, integration wins, and field tests."
        >
          <div className="mt-8 md:mt-10">
            <SubTeamNav />
          </div>
        </PageHero>

        <PageSection className="build-log-section !max-w-7xl !px-4 !py-8 md:!px-4 md:!py-16">
          {children}
        </PageSection>
      </PageShell>
    </BuildLogReadingProvider>
  );
}
