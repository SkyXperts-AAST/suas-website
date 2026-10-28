import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Hero from "@/components/home/Hero";
import LoopVideo from "@/components/media/LoopVideo";
import PostCard from "@/components/ui/PostCard";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import SponsorMarquee from "@/components/ui/SponsorMarquee";
import {
  getCurrentSeason,
  getFleet,
  getPosts,
  getSeasons,
  getSponsors,
  getVehicle,
  toSummary,
} from "@/lib/content";

const PROCESS = [
  { title: "Design", text: "Requirements from the mission rules, then CAD, simulation and FEA before anything is cut." },
  { title: "Build", text: "Airframe, power, avionics and software made in-house, each owned by a sub-team." },
  { title: "Test", text: "Bench tests, tethered runs, then flight after flight until the data agrees with the model." },
  { title: "Compete", text: "Competitions like ICMTC, where the work is judged against other university teams." },
];

export default function Home() {
  const seasons = getSeasons();
  const current = getCurrentSeason();
  const storm = getVehicle("storm");
  const posts = getPosts().slice(0, 3).map(toSummary);
  const competitions = seasons.flatMap((s) => s.competitions.map((c) => ({ ...c, season: s })));
  const awards = competitions.flatMap((c) =>
    c.results.filter((r) => /place|award/i.test(r)).map((r) => ({ result: r, comp: c })),
  );
  const sponsors = [...getSponsors().values()];

  const stats = [
    { value: String(seasons.length), label: "Seasons" },
    { value: String(getFleet().length), label: "Vehicles built" },
    { value: String(awards.length), label: "Competition awards" },
    { value: String(getPosts().length), label: "Journal entries" },
  ];

  return (
    <main className="bg-navy">
      <Hero />

      <section
        aria-label="Arab Academy for Science, Technology and Maritime Transport"
        className="px-6 py-14 md:py-20"
      >
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center md:flex-row md:gap-12 md:text-left">
          {/* The logo file has a caption baked in under the emblem; crop to the
              emblem and set the name in the site's own type instead. */}
          <div className="relative aspect-[520/330] w-64 shrink-0 sm:w-72 md:w-80">
            <Image
              src="/aast-logo-white.webp"
              alt=""
              fill
              sizes="(max-width: 640px) 256px, (max-width: 768px) 288px, 320px"
              className="object-cover object-top"
            />
          </div>
          <div className="hidden h-32 w-px shrink-0 bg-white/15 md:block" />
          <div>
            <p className="eyebrow">Home institution</p>
            <p className="mt-4 font-display text-3xl leading-tight text-offwhite sm:text-4xl">
              Arab Academy for Science, Technology &amp; Maritime Transport
            </p>
          </div>
        </div>
      </section>

      {/* At a glance */}
      <section className="border-y border-white/10">
        <dl className="mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`px-6 py-8 md:py-10 ${i % 2 ? "border-l" : ""} ${i > 1 ? "border-t md:border-t-0" : ""} ${
                i === 2 ? "md:border-l" : ""
              } border-white/10`}
            >
              <dd className="font-display text-5xl text-offwhite md:text-6xl">{s.value}</dd>
              <dt className="mt-2 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-offwhite/50">{s.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* Who we are */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <div>
            <p className="eyebrow">Who we are</p>
            <h2 className="mt-4 text-4xl text-offwhite md:text-5xl">
              We build. <span className="text-accent">We don&apos;t just study.</span>
            </h2>
            <p className="mt-6 leading-relaxed text-offwhite/70 md:text-lg">
              SkyXperts started in 2023 at AAST Abo Qir, Alexandria, with a handful
              of students who wanted to build real autonomous aircraft instead of
              reading about them. We&apos;re a full team now, working out of Abo Qir
              and AAST El Alamein, covering structures, electronics, vision and
              control, and designing and flying vehicles from scratch. Competitions
              are where we prove the work.
            </p>
            <Link href="/team" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-offwhite hover:text-accent">
              Meet the team <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <ol className="grid gap-px overflow-hidden rounded-md border border-white/10 bg-white/10 sm:grid-cols-2">
            {PROCESS.map((step, i) => (
              <Reveal as="li" key={step.title} delay={i * 90} className="bg-navy p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-accent/50 font-mono text-sm text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 text-2xl text-offwhite">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-offwhite/60">{step.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Flagship vehicle */}
      {storm ? (
        <section className="border-y border-white/10 bg-[#081322] px-6 py-20 md:py-28">
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow="Flagship" title="Meet" accent={storm.name} intro={storm.summary} />
            <Reveal className="mt-12">
              <div className="panel bg-grid grid overflow-hidden md:grid-cols-[1.4fr_1fr]">
                <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[26rem]">
                  <Image
                    src={storm.image!}
                    alt={`${storm.name}, front view`}
                    fill
                    sizes="(max-width: 768px) 100vw, 60vw"
                    className="object-contain p-8 md:p-12"
                  />
                </div>
                <div className="flex flex-col border-t border-white/10 bg-navy/60 p-6 md:border-l md:border-t-0 md:p-10">
                  <dl className="divide-y divide-white/10">
                    {storm.specs.slice(1, 5).map((spec) => (
                      <div key={spec.label} className="flex items-baseline justify-between gap-4 py-3">
                        <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-offwhite/50">{spec.label}</dt>
                        <dd className="font-mono text-offwhite">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                  <ul className="mt-6 space-y-2">
                    {storm.achievements.slice(0, 2).map((a) => (
                      <li key={a} className="flex items-start gap-3 text-sm text-offwhite/80">
                        <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 bg-accent" />
                        {a}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex flex-wrap gap-3 pt-8">
                    <Link href="/fleet/storm" className="rounded-sm bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c81616]">
                      Explore Storm in 3D
                    </Link>
                    <Link href="/fleet" className="rounded-sm border border-white/25 px-5 py-2.5 text-sm font-semibold text-offwhite transition hover:border-white">
                      Full fleet
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* In the field */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow="In the field" title="Where the work" accent="gets tested" />
          <div className="mt-12 grid gap-4 md:grid-cols-3 md:grid-rows-2">
            <Reveal className="md:col-span-2 md:row-span-2">
              <LoopVideo
                src="/media/storm-flight.mp4"
                poster="/media/storm-flight.jpg"
                aspect="aspect-video md:aspect-auto md:h-full"
                className="h-full [&>div]:h-full"
              />
            </Reveal>
            <Reveal delay={90} className="relative aspect-video overflow-hidden rounded-md border border-white/10 md:aspect-auto">
              <Image src="/media/storm-mission.webp" alt="Storm flying low over a desert runway at ICMTC 2026" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
            </Reveal>
            <Reveal delay={180} className="relative aspect-video overflow-hidden rounded-md border border-white/10 md:aspect-auto">
              <Image src="/media/icmtc25-flag.webp" alt="The team with the AAST flag at ICMTC 2025" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
            </Reveal>
          </div>
          <p className="mt-6 text-center">
            <Link href="/gallery" className="font-mono text-xs uppercase tracking-[0.16em] text-accent hover:underline">
              Open the gallery →
            </Link>
          </p>
        </div>
      </section>

      {/* Track record */}
      {competitions.length ? (
        <section className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow="Track record" title="Where we've" accent="competed" />
            <ol className="mt-12 divide-y divide-white/10 border-y border-white/10">
              {[...competitions].reverse().map((c, i) => (
                <Reveal as="li" key={`${c.name}-${c.edition}`} delay={i * 60}>
                  <Link
                    href={`/legacy/${c.season.id}`}
                    className="group grid items-baseline gap-2 py-6 md:grid-cols-[8rem_1fr_auto] md:gap-8"
                  >
                    <span className="font-mono text-sm text-accent">{c.edition}</span>
                    <span className="font-display text-2xl text-offwhite md:text-3xl">{c.name}</span>
                    <span className="text-offwhite/70 transition group-hover:text-offwhite">
                      {c.results.join(" · ")}
                    </span>
                  </Link>
                </Reveal>
              ))}
            </ol>
            <p className="mt-8 text-center">
              <Link href="/legacy" className="font-mono text-xs uppercase tracking-[0.16em] text-accent hover:underline">
                Every season, on the record →
              </Link>
            </p>
          </div>
        </section>
      ) : null}

      {/* Journal */}
      {posts.length ? (
        <section className="border-t border-white/10 px-6 py-20 md:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
              <SectionHeading
                eyebrow="Journal"
                title="Latest from the"
                accent="build log"
                align="left"
              />
              <Link href="/journal" className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-offwhite hover:text-accent">
                All entries <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <ul className="mt-10 grid gap-5 md:grid-cols-3">
              {posts.map((post, i) => (
                <Reveal as="li" key={post.slug} delay={i * 90}>
                  <PostCard post={post} />
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* Sponsors */}
      {sponsors.length ? (
        <section className="border-t border-white/10 py-16 md:py-20">
          <p className="text-center">
            <span className="eyebrow-center">Backed by</span>
          </p>
          <div className="mt-10">
            <SponsorMarquee sponsors={sponsors} />
          </div>
          <p className="mt-10 text-center">
            <Link href="/sponsorships" className="inline-flex items-center gap-2 text-sm font-semibold text-offwhite/80 hover:text-accent">
              Partner with us <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </p>
        </section>
      ) : null}

      {/* Closing CTA */}
      <section className="px-6 pb-24">
        <div className="panel bg-grid mx-auto max-w-6xl overflow-hidden p-8 text-center md:p-16">
          <p className="eyebrow-center">{current.label} season</p>
          <h2 className="mx-auto mt-4 max-w-2xl text-4xl text-offwhite md:text-5xl">
            Want to fly with us?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-offwhite/65">
            {current.recruitment?.note ??
              "We recruit AAST students at the start of every season. Sponsors and partners can reach us any time."}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {current.recruitment?.open && current.recruitment.url ? (
              <a href={current.recruitment.url} className="rounded-sm bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-[#c81616]">
                Apply now
              </a>
            ) : null}
            <Link href="/contact" className="rounded-sm border border-white/25 px-6 py-3 text-sm font-semibold text-offwhite transition hover:border-white">
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
