import BuildLogHeroBackground from "@/components/build-log/BuildLogHeroBackground";
import SubTeamNav from "@/components/build-log/SubTeamNav";

export default function BuildLogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative overflow-x-clip bg-navy text-offwhite">
      <section className="relative z-20 min-h-[34rem] overflow-hidden border-b border-white/10 md:min-h-[38rem]">
        <BuildLogHeroBackground />

        <div className="pointer-events-none absolute inset-0 bg-[#0a1628]/55" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(227,28,28,0.14),transparent_52%)]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#05071e]/95 via-[#0a1628]/72 to-[#05071e]/95" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a1628]/92 via-[#0a1628]/55 to-[#0a1628]/25" />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-14 md:py-20">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-[#0a1628]/70 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-accent backdrop-blur-sm">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
              Build Log
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-tight drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)] md:text-6xl">
              Engineering progress,
              <span className="block text-offwhite/85">
                one milestone at a time.
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-offwhite/75 md:text-lg">
              Track each sub-team&apos;s build journey through a living timeline of
              design decisions, integration wins, and field tests.
            </p>
          </div>

          <div className="mt-10">
            <SubTeamNav />
          </div>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-6xl px-6 py-10 md:py-16">
        {children}
      </section>
    </div>
  );
}
