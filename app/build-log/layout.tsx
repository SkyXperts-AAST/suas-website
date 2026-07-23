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
      <section className="relative z-20 min-h-[34rem] overflow-hidden border-b border-white/10 md:min-h-[38rem]">
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
      </section>

      <PageSection>{children}</PageSection>
    </PageShell>
  );
}
