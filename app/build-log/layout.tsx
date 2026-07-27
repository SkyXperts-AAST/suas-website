import BuildLogHeroBackground from "@/components/build-log/BuildLogHeroBackground";
import SubTeamNav from "@/components/build-log/SubTeamNav";
import { PageHeroContent, PageSection, PageShell } from "@/components/layout/PageShell";

export default function BuildLogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PageShell className="overflow-x-clip">
      <section className="relative z-20 min-h-[34rem] overflow-hidden md:min-h-[38rem]">
        <BuildLogHeroBackground />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-14 md:py-20">
          <PageHeroContent
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
            titleClassName="drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
          />

          <div className="mt-10">
            <SubTeamNav />
          </div>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-40 bg-gradient-to-b from-transparent via-[#0a1628]/70 to-[#0a1628] md:h-52"
        />
      </section>

      <PageSection className="relative z-30 -mt-24 pt-0 md:-mt-28 !max-w-7xl">
        {children}
      </PageSection>
    </PageShell>
  );
}
