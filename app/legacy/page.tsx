import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SeasonTimeline from "@/components/legacy/SeasonTimeline";
import { PageHero, PageShell } from "@/components/layout/PageShell";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { Avatar } from "@/components/ui/PersonCard";
import { getCurrentSeason, getPeople, getSeasons, peopleInSeason } from "@/lib/content";
import type { Person } from "@/lib/content/types";

export const metadata: Metadata = {
  title: "Legacy | SkyXperts",
  description:
    "Every SkyXperts season: who was on the team, what we built, and where we competed.",
};

export default function LegacyPage() {
  const seasons = getSeasons();
  const current = getCurrentSeason();
  const currentIds = peopleInSeason(current);
  const people = getPeople();

  // Alumni: anyone in a past season who isn't part of the current one,
  // grouped under the last season they were on the team. Until the current
  // season's roster is filled in we can't tell who has left, so the section
  // shows past rosters instead of labelling everyone an alumnus.
  const currentHasRoster = current.structure.some((d) => d.teams.some((t) => t.members.length));
  const lastSeason = new Map<string, string>();
  for (const season of [...seasons].reverse()) {
    if (season.current) continue;
    peopleInSeason(season).forEach((id) => lastSeason.set(id, season.id));
  }
  const alumniBySeason = seasons
    .filter((s) => !s.current)
    .map((s) => ({
      season: s,
      people: (currentHasRoster
        ? [...lastSeason.entries()].filter(([id, sid]) => sid === s.id && !currentIds.has(id)).map(([id]) => id)
        : [...peopleInSeason(s)]
      )
        .map((id) => people.get(id))
        .filter((p): p is Person => Boolean(p))
        .sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .filter((g) => g.people.length);

  return (
    <PageShell>
      <PageHero
        label="Legacy"
        title={
          <>
            Every season,
            <br />
            <span className="text-accent">on the record.</span>
          </>
        }
        description="Who was on the team, what they built and how it flew. Each season keeps its own page, so the work outlasts the people who did it."
      />

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <SectionHeading eyebrow="Seasons" title="Pick a" accent="season" />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {seasons.map((s, i) => {
            const results = s.competitions.flatMap((c) => c.results).length;
            return (
              <Reveal as="li" key={s.id} delay={i * 80}>
                <Link href={`/legacy/${s.id}`} className="panel panel-hover group flex h-full flex-col p-6">
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent">
                    {s.current ? "Current season" : "Season"}
                  </p>
                  <p className="mt-2 font-display text-4xl text-offwhite">{s.label}</p>
                  <p className="mt-1 text-sm text-offwhite/70">{s.title}</p>
                  <dl className="mt-6 grid grid-cols-2 gap-3 border-t border-white/10 pt-4 font-mono text-xs">
                    <div>
                      <dt className="uppercase tracking-[0.12em] text-offwhite/45">People</dt>
                      <dd className="mt-1 text-base text-offwhite">{peopleInSeason(s).size || "—"}</dd>
                    </div>
                    <div>
                      <dt className="uppercase tracking-[0.12em] text-offwhite/45">Results</dt>
                      <dd className="mt-1 text-base text-offwhite">{results || "—"}</dd>
                    </div>
                  </dl>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm text-offwhite/70 group-hover:text-accent">
                    Open season <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </section>

      <section className="border-t border-white/10 px-6 py-16 md:py-24">
        <SectionHeading eyebrow="Timeline" title="How we got" accent="here" />
        <div className="mt-14">
          <SeasonTimeline seasons={seasons} />
        </div>
      </section>

      {alumniBySeason.length ? (
        <section className="border-t border-white/10 px-6 py-16 md:py-24">
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              eyebrow={currentHasRoster ? "Alumni" : "Past rosters"}
              title="The people who"
              accent={currentHasRoster ? "came before" : "built it"}
              intro={
                currentHasRoster
                  ? "Grouped by the last season they were on the team."
                  : "Everyone listed on each past season's team."
              }
            />
            <div className="mt-12 space-y-10">
              {alumniBySeason.map((g) => (
                <div key={g.season.id} className="grid gap-4 md:grid-cols-[10rem_1fr]">
                  <Link href={`/legacy/${g.season.id}`} className="font-display text-2xl text-offwhite hover:text-accent">
                    {g.season.label}
                  </Link>
                  <ul className="flex flex-wrap gap-3">
                    {g.people.map((p) => (
                      <li key={p.id} className="panel flex items-center gap-3 py-2 pl-2 pr-4 text-sm text-offwhite/85">
                        <Avatar person={p} size={32} />
                        {p.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </PageShell>
  );
}
