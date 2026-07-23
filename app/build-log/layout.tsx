import SubTeamNav from "@/components/build-log/SubTeamNav";

export default function BuildLogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative overflow-x-clip bg-navy text-offwhite">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_top,rgba(227,28,28,0.18),transparent_55%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-32 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-48 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl"
      />

      <section className="relative z-20 border-b border-white/10 bg-navy">
        <div className="mx-auto w-full max-w-6xl px-6 py-14 md:py-20">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-accent">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
              Build Log
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-tight md:text-6xl">
              Engineering progress,
              <span className="block text-offwhite/80">one milestone at a time.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-offwhite/65 md:text-lg">
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
