import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import PostCard from "@/components/ui/PostCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { getFleet, getPosts, getSeasons, getVehicle, toSummary } from "@/lib/content";
import { FLEET_KIND_LABEL, FLEET_STATUS_LABEL } from "@/lib/content/types";

type Props = { params: Promise<{ slug: string }> };

// Storm has its own hand-built page at app/fleet/storm.
export function generateStaticParams() {
  return getFleet()
    .filter((v) => v.slug !== "storm")
    .map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const vehicle = getVehicle((await params).slug);
  return vehicle
    ? { title: `${vehicle.name} | Fleet | SkyXperts`, description: vehicle.summary }
    : { title: "Fleet | SkyXperts" };
}

export default async function VehiclePage({ params }: Props) {
  const vehicle = getVehicle((await params).slug);
  if (!vehicle) notFound();

  const competitions = getSeasons()
    .flatMap((s) => s.competitions.map((c) => ({ ...c, season: s.label })))
    .filter((c) => c.vehicle === vehicle.slug);
  const posts = getPosts()
    .filter((p) => vehicle.seasons.includes(p.season))
    .slice(0, 3)
    .map(toSummary);

  return (
    <div className="bg-navy">
      <section className="border-b border-white/10">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-2 md:items-center md:py-20">
          <div>
            <Link
              href="/fleet"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-offwhite/55 transition hover:text-accent"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> All vehicles
            </Link>
            <p className="mt-8">
              <span className="eyebrow">
                {FLEET_KIND_LABEL[vehicle.kind]} · {FLEET_STATUS_LABEL[vehicle.status]}
              </span>
            </p>
            <h1 className="mt-4 text-6xl text-offwhite md:text-7xl">{vehicle.name}</h1>
            <p className="mt-2 text-lg text-offwhite/60">{vehicle.tagline}</p>
            <p className="mt-6 max-w-xl leading-relaxed text-offwhite/75">{vehicle.summary}</p>
            <p className="mt-6 font-mono text-xs uppercase tracking-[0.14em] text-offwhite/45">
              Season{vehicle.seasons.length > 1 ? "s" : ""}:{" "}
              {vehicle.seasons.map((s, i) => (
                <span key={s}>
                  {i ? ", " : ""}
                  <Link href={`/legacy/${s}`} className="text-offwhite/80 hover:text-accent">
                    {s}
                  </Link>
                </span>
              ))}
            </p>
          </div>
          <div className="panel bg-grid relative flex aspect-[4/3] items-center justify-center overflow-hidden">
            {vehicle.photo || vehicle.image ? (
              <Image
                src={(vehicle.photo ?? vehicle.image)!}
                alt={vehicle.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className={vehicle.photo ? "object-cover" : "object-contain p-10"}
              />
            ) : (
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-offwhite/35">
                Photo to be added
              </p>
            )}
          </div>
        </div>
      </section>

      {vehicle.specs.length ? (
        <section className="mx-auto max-w-6xl px-6 py-16">
          <SectionHeading eyebrow="Specification" title="By the numbers" align="left" />
          <dl className="mt-8 grid gap-px overflow-hidden rounded-md border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {vehicle.specs.map((spec) => (
              <div key={spec.label} className="bg-navy p-6">
                <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-offwhite/50">{spec.label}</dt>
                <dd className="mt-2 font-mono text-xl text-offwhite">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {competitions.length || vehicle.achievements.length ? (
        <section className="mx-auto max-w-6xl px-6 py-16">
          <SectionHeading eyebrow="Record" title="Competition history" align="left" />
          <ul className="mt-8 divide-y divide-white/10 border-y border-white/10">
            {competitions.length
              ? competitions.map((c) => (
                  <li key={`${c.name}-${c.edition}`} className="flex flex-col gap-1 py-5 md:flex-row md:items-baseline md:justify-between">
                    <span className="font-display text-2xl text-offwhite">
                      {c.name} {c.edition}
                    </span>
                    <span className="text-offwhite/70">{c.results.join(" · ")}</span>
                  </li>
                ))
              : vehicle.achievements.map((a) => (
                  <li key={a} className="py-5 text-offwhite/80">{a}</li>
                ))}
          </ul>
        </section>
      ) : null}

      {posts.length ? (
        <section className="mx-auto max-w-6xl px-6 py-16 pb-24">
          <SectionHeading eyebrow="Journal" title="From the build log" align="left" />
          <ul className="mt-8 grid gap-5 md:grid-cols-3">
            {posts.map((post) => (
              <li key={post.slug}>
                <PostCard post={post} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
