import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import PersonCard, { Avatar } from "@/components/ui/PersonCard";
import PostCard from "@/components/ui/PostCard";
import SectionHeading from "@/components/ui/SectionHeading";
import SponsorMarquee from "@/components/ui/SponsorMarquee";
import VehicleCard from "@/components/ui/VehicleCard";
import { getPosts, getSeason, getSeasons, getVehicle, toSummary } from "@/lib/content";
import type { Vehicle } from "@/lib/content/types";

type Props = { params: Promise<{ season: string }> };

export function generateStaticParams() {
  return getSeasons().map((s) => ({ season: s.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const season = getSeason((await params).season);
  return season
    ? { title: `${season.label} season | SkyXperts`, description: season.summary }
    : { title: "Legacy | SkyXperts" };
}

export default async function SeasonPage({ params }: Props) {
  const season = getSeason((await params).season);
  if (!season) notFound();

  const all = getSeasons();
  const idx = all.findIndex((s) => s.id === season.id);
  const newer = all[idx - 1];
  const older = all[idx + 1];
  const vehicles = season.vehicles.map(getVehicle).filter((v): v is Vehicle => Boolean(v));
  const posts = getPosts()
    .filter((p) => p.season === season.id)
    .slice(0, 6)
    .map(toSummary);
  const totalPosts = getPosts().filter((p) => p.season === season.id).length;
  const roster = season.structure.flatMap((d) =>
    d.teams.filter((t) => t.members.length || t.lead).map((t) => ({ dept: d.name, team: t })),
  );

  return (
    <PageShell>
      <header className="border-b border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
          <Link
            href="/legacy"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-offwhite/55 transition hover:text-accent"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> All seasons
          </Link>
          <p className="mt-8">
            <span className="eyebrow">{season.current ? "Current season" : "Season"}</span>
          </p>
          <h1 className="mt-4 font-display text-6xl text-offwhite md:text-8xl">{season.label}</h1>
          <p className="mt-3 text-xl text-offwhite/80 md:text-2xl">{season.title}</p>
          <p className="mt-5 max-w-2xl leading-relaxed text-offwhite/65">{season.summary}</p>
        </div>
      </header>

      {season.competitions.length ? (
        <section className="mx-auto max-w-6xl px-6 py-16">
          <SectionHeading eyebrow="Results" title="Competitions" align="left" />
          <ul className="mt-8 grid gap-px overflow-hidden rounded-md border border-white/10 bg-white/10 md:grid-cols-2">
            {season.competitions.map((c) => (
              <li key={`${c.name}-${c.edition}`} className="bg-navy p-6 md:p-8">
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent">{c.edition}</p>
                <p className="mt-2 font-display text-3xl text-offwhite">{c.name}</p>
                <ul className="mt-4 space-y-1 text-offwhite/75">
                  {c.results.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
                {c.vehicle && getVehicle(c.vehicle) ? (
                  <Link href={`/fleet/${c.vehicle}`} className="mt-4 inline-block font-mono text-xs uppercase tracking-[0.14em] text-offwhite/50 hover:text-accent">
                    Flown with {getVehicle(c.vehicle)!.name} →
                  </Link>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {vehicles.length ? (
        <section className="mx-auto max-w-6xl px-6 py-16">
          <SectionHeading eyebrow="Fleet" title="What we flew" align="left" />
          <ul className="mt-8 grid gap-6 md:grid-cols-2">
            {vehicles.map((v) => (
              <li key={v.slug}>
                <VehicleCard vehicle={v} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {season.leadership.length || season.mentors.length ? (
        <section className="mx-auto max-w-6xl px-6 py-16">
          <SectionHeading eyebrow="People" title="Leadership and mentors" align="left" />
          <ul className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
            {season.leadership.map((r) => (
              <li key={`l-${r.person.id}`}>
                <PersonCard person={r.person} role={r.role} />
              </li>
            ))}
            {season.mentors.map((p) => (
              <li key={`m-${p.id}`}>
                <PersonCard person={p} role="Mentor" />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {roster.length ? (
        <section className="mx-auto max-w-6xl px-6 py-16">
          <SectionHeading eyebrow="Roster" title="The team" align="left" />
          <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
            {roster.map(({ dept, team }) => (
              <div key={team.id} className="grid gap-3 py-5 md:grid-cols-[16rem_1fr]">
                <div>
                  <p className="font-display text-xl text-offwhite">{team.name}</p>
                  {dept !== team.name ? (
                    <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-offwhite/45">{dept}</p>
                  ) : null}
                </div>
                <ul className="flex flex-wrap gap-3">
                  {[...(team.lead ? [team.lead] : []), ...team.members].map((p) => (
                    <li key={p.id} className="flex items-center gap-2 text-sm text-offwhite/85">
                      <Avatar person={p} size={28} />
                      {p.name}
                      {team.lead?.id === p.id ? (
                        <span className="font-mono text-[0.625rem] uppercase text-accent">Lead</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {posts.length ? (
        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="flex items-end justify-between gap-4">
            <SectionHeading eyebrow="Journal" title="Written that season" align="left" />
            {totalPosts > posts.length ? (
              <Link href={`/journal?season=${season.id}`} className="shrink-0 font-mono text-xs uppercase tracking-[0.16em] text-accent hover:underline">
                All {totalPosts} entries →
              </Link>
            ) : null}
          </div>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <li key={post.slug}>
                <PostCard post={post} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {season.sponsors.length ? (
        <section className="border-t border-white/10 py-16">
          <p className="text-center font-mono text-xs uppercase tracking-[0.18em] text-offwhite/50">
            Backed that season by
          </p>
          <div className="mt-8">
            <SponsorMarquee sponsors={season.sponsors} />
          </div>
        </section>
      ) : null}

      <nav aria-label="Other seasons" className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl justify-between px-6 py-10 font-display text-xl">
          {older ? (
            <Link href={`/legacy/${older.id}`} className="text-offwhite/70 hover:text-accent">
              ← {older.label}
            </Link>
          ) : (
            <span />
          )}
          {newer ? (
            <Link href={`/legacy/${newer.id}`} className="text-offwhite/70 hover:text-accent">
              {newer.label} →
            </Link>
          ) : null}
        </div>
      </nav>
    </PageShell>
  );
}
