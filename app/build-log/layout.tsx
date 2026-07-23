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

        <div className="pointer-events-none absolute inset-0 bg-[#0a1628]/55" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(227,28,28,0.14),transparent_52%)]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#05071e]/95 via-[#0a1628]/72 to-[#05071e]/95" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a1628]/92 via-[#0a1628]/55 to-[#0a1628]/25" />

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
