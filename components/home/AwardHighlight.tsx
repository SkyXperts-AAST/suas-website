type Award = {
  icon: string;
  title: string;
  detail: string;
};

const AWARDS: Award[] = [
  {
    icon: "🏆",
    title: "Best Mission Award",
    detail:
      "Recognized for the most complete and effective mission execution at ICMTC 2026.",
  },
  {
    icon: "🥉",
    title: "3rd Place Overall",
    detail: "Storm placed 3rd overall against every competing team at ICMTC 2026.",
  },
];

/** Concentric accent rings behind the emoji — the badge treatment carried over
 * from the scroll-driven version, minus the perpetual ping/spin animations
 * that ran on every card at once. */
function RadarBadge({ icon }: { icon: string }) {
  return (
    <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full border-2 border-accent/25"
      />
      <span
        aria-hidden="true"
        className="absolute inset-2 rounded-full border border-dashed border-accent/25"
      />
      <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-accent/15 text-4xl shadow-[0_0_45px_rgba(227,28,28,0.45)]">
        {icon}
      </span>
    </div>
  );
}

/**
 * Recognition chapter: every award on screen at once.
 *
 * This used to pin the section for `AWARDS.length * 110vh` and hand off between
 * awards on scroll, which cost 220vh of page height and a scroll listener to
 * show two cards. A grid needs neither, so there is no client JS here at all —
 * adding a third or fourth award is a matter of appending to AWARDS.
 */
export default function AwardHighlight() {
  return (
    <section
      id="award"
      className="relative scroll-mt-24 bg-navy px-6 py-20 md:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_18%,rgba(227,28,28,0.14),transparent_65%)]"
      />

      <div className="relative mx-auto max-w-5xl">
        <div className="text-center">
          <h2 className="font-display text-2xl leading-[1.05] tracking-tight text-accent sm:text-3xl">
            Recognition
          </h2>
          <p className="mt-2 text-sm font-bold uppercase tracking-[0.16em] text-offwhite/50 sm:text-base">
            ICMTC 2026
          </p>
        </div>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2">
          {AWARDS.map((award, index) => (
            <li
              key={award.title}
              className="flex flex-col items-center gap-6 rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center sm:items-start sm:text-left"
            >
              <RadarBadge icon={award.icon} />
              <div>
                <p className="font-mono text-sm font-bold tracking-[0.25em] text-accent">
                  {String(index + 1).padStart(2, "0")} /{" "}
                  {String(AWARDS.length).padStart(2, "0")}
                </p>
                <h3 className="mt-3 font-display text-3xl leading-[1.05] tracking-tight text-offwhite sm:text-4xl">
                  {award.title}
                </h3>
                <p className="mt-3 text-pretty text-base leading-relaxed text-offwhite/70">
                  {award.detail}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
