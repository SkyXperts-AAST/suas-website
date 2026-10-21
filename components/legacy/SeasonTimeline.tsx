import Link from "next/link";
import type { Season } from "@/lib/content/types";
import Reveal from "@/components/ui/Reveal";

/**
 * Every milestone from every season on one spine, oldest at the top. Built from
 * the season files, so a new season's milestones appear without code changes.
 */
export default function SeasonTimeline({
  seasons,
  linkSeasons = true,
}: {
  seasons: Season[];
  linkSeasons?: boolean;
}) {
  const ordered = [...seasons].sort((a, b) => a.id.localeCompare(b.id));
  return (
    <ol className="relative mx-auto max-w-3xl">
      <span aria-hidden="true" className="wire-y absolute bottom-0 left-[7px] top-2 w-px md:left-1/2" />
      {ordered.map((season) => (
        <li key={season.id} className="relative pb-12 last:pb-0">
          <div className="relative flex items-center gap-4 md:justify-center">
            <span
              aria-hidden="true"
              className={`relative z-10 h-[15px] w-[15px] shrink-0 rounded-full border-2 ${
                season.current ? "node-live border-accent bg-accent" : "border-accent bg-navy"
              }`}
            />
            {linkSeasons ? (
              <Link
                href={`/legacy/${season.id}`}
                className="font-display text-2xl text-offwhite transition hover:text-accent md:absolute md:left-1/2 md:ml-6"
              >
                {season.label}
                {season.current ? (
                  <span className="ml-3 align-middle font-mono text-[0.625rem] uppercase tracking-[0.16em] text-accent">
                    Now
                  </span>
                ) : null}
              </Link>
            ) : (
              <span className="font-display text-2xl text-offwhite md:absolute md:left-1/2 md:ml-6">{season.label}</span>
            )}
          </div>
          <ul className="mt-4 space-y-3 pl-8 md:pl-0">
            {season.milestones.map((m, i) => (
              <Reveal
                as="li"
                key={`${m.title}-${i}`}
                delay={i * 80}
                className={`md:w-[calc(50%-2rem)] ${i % 2 ? "md:ml-auto" : ""}`}
              >
                <div className="panel p-4">
                  <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-accent">{m.date}</p>
                  <p className="mt-1 font-display text-lg text-offwhite">{m.title}</p>
                  {m.detail ? <p className="mt-1 text-sm text-offwhite/60">{m.detail}</p> : null}
                </div>
              </Reveal>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
