import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageSection, PageShell } from "@/components/layout/PageShell";
import OrgChart from "@/components/team/OrgChart";
import SubTeamGrid from "@/components/team/SubTeamGrid";
import PersonCard from "@/components/ui/PersonCard";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { getCurrentSeason } from "@/lib/content";

export const metadata: Metadata = {
  title: "Team | SkyXperts",
  description:
    "How SkyXperts is organised: leadership, mentors, departments and sub-teams for the current season.",
};

export default function TeamPage() {
  const season = getCurrentSeason();
  const facultyAdvisor = season.mentors.find(
    (mentor) => mentor.role === "Faculty Advisor",
  );
  const mentors = season.mentors.filter(
    (mentor) => mentor.role !== "Faculty Advisor",
  );

  return (
    <PageShell>
      {/* Hero: full team photo, title on the bottom edge */}
      <section className="relative aspect-[4/3] w-full overflow-hidden border-b border-white/10 bg-navy sm:aspect-[16/9] md:max-h-[720px]">
        <Image
          src="/team/groupPhoto.jpg"
          alt="The SkyXperts team"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent"
        />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-6 pb-8 md:pb-12">
          <p className="eyebrow">{season.label} season</p>
          <h1 className="mt-3 text-5xl text-offwhite md:text-7xl">Our Team</h1>
          <p className="mt-3 max-w-xl text-base text-offwhite/80 md:text-lg">
            Students from across AAST designing, building and flying
            autonomous aircraft, with mentors who have done it before.
          </p>
        </div>
      </section>

      <PageSection className="pt-16 md:pt-24">
        <SectionHeading
          eyebrow="Structure"
          title="How we're"
          accent="organised"
          intro="A student board runs the team. Four departments own the engineering and the outreach, and each splits into sub-teams with a clear job. Mentors advise across all of them."
        />
        <Reveal className="mt-12">
          <OrgChart
            leadership={season.leadership}
            mentors={mentors}
            structure={season.structure}
          />
        </Reveal>
      </PageSection>

      <PageSection>
        <SectionHeading
          eyebrow="Departments"
          title="Who does"
          accent="what"
          intro="Every part of the aircraft, and every part of the team around it, has an owner."
        />
        <div className="mt-14">
          <SubTeamGrid structure={season.structure} />
        </div>
      </PageSection>

      {facultyAdvisor ? (
        <PageSection>
          <SectionHeading
            eyebrow="Advisory"
            title="Faculty Advisor"
            align="left"
          />
          <Reveal className="mx-auto mt-10 w-full max-w-[220px]">
            <PersonCard
              person={facultyAdvisor.person}
              role={facultyAdvisor.role}
            />
          </Reveal>
        </PageSection>
      ) : null}

      {season.leadership.length ? (
        <PageSection>
          <SectionHeading eyebrow="Board" title="Leadership" align="left" />
          <ul className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
            {season.leadership.map((r, i) => (
              <Reveal as="li" key={r.person.id} delay={i * 80}>
                <PersonCard person={r.person} role={r.role} />
              </Reveal>
            ))}
          </ul>
        </PageSection>
      ) : null}

      {mentors.length ? (
        <PageSection>
          <SectionHeading
            eyebrow="Advisory"
            title="Mentors"
            align="left"
            intro="The founder and former members who still give their time: reviewing designs, running training and helping each sub-team when it gets stuck."
          />
          <ul className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
            {mentors.map((m, i) => (
              <Reveal as="li" key={m.person.id} delay={(i % 5) * 70}>
                <PersonCard person={m.person} role={m.role} />
              </Reveal>
            ))}
          </ul>
        </PageSection>
      ) : null}

      <PageSection className="pb-24">
        <div className="panel bg-grid flex flex-col items-start gap-6 p-8 md:flex-row md:items-center md:justify-between md:p-12">
          <div>
            <p className="eyebrow">Legacy</p>
            <h2 className="mt-3 text-3xl text-offwhite md:text-4xl">Everyone who built SkyXperts</h2>
            <p className="mt-3 max-w-xl text-offwhite/65">
              Past rosters, alumni and mentors from every season, with what each
              team built and where it competed.
            </p>
          </div>
          <Link
            href="/legacy"
            className="inline-flex shrink-0 items-center gap-2 rounded-sm border border-white/20 px-5 py-3 text-sm font-semibold text-offwhite transition hover:border-accent hover:text-accent"
          >
            See past seasons <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </PageSection>
    </PageShell>
  );
}
