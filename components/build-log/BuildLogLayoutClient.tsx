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
          className="build-log-hero"
          label="Build Log"
          title={
            <>
              Engineering progress,
              <span className="block text-offwhite/85">
                one milestone at a time.
              </span>
            </>
          }
          description="Track each sub-team's build journey through a living timeline of design decisions, integration wins, and field tests."
        >
          <div className="mt-10">
            <SubTeamNav />
          </div>
        </PageHero>

        <PageSection className="build-log-section !max-w-7xl !px-3 md:!px-4">
          {children}
        </PageSection>
      </PageShell>
    </BuildLogReadingProvider>
  );
}
