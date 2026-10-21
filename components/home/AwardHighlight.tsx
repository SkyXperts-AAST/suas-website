type Award = {
  title: string;
  detail: string;
};

const AWARDS: Award[] = [
  {
    title: "Best Mission Award",
    detail:
      "Recognized for the most complete and effective mission execution at ICMTC 2026.",
  },
  {
    title: "3rd Place Overall",
    detail: "Storm placed 3rd overall against every competing team at ICMTC 2026.",
  },
];

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
    <section id="award" className="scroll-mt-24 bg-navy px-6 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h2 className="heading-rule heading-rule-center text-3xl text-offwhite sm:text-4xl lg:text-5xl">
            Recognition
          </h2>
          <p className="kicker mt-4">ICMTC 2026</p>
        </div>

        <ul className="mt-12 grid gap-px overflow-hidden rounded-md border border-white/10 bg-white/10 sm:grid-cols-2">
          {AWARDS.map((award, index) => (
            <li key={award.title} className="bg-navy p-8 sm:p-10">
              <p className="font-mono text-sm tracking-[0.2em] text-accent">
                {String(index + 1).padStart(2, "0")} /{" "}
                {String(AWARDS.length).padStart(2, "0")}
              </p>
              <h3 className="mt-6 text-3xl text-offwhite sm:text-4xl">
                {award.title}
              </h3>
              <p className="mt-3 text-pretty text-base leading-relaxed text-offwhite/70">
                {award.detail}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
