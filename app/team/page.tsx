import type { Metadata } from "next";
import Image from "next/image";
import MemberCard from "@/components/team/MemberCard";
import SubTeamTabs from "@/components/team/SubTeamTabs";
import { PageSection, PageShell } from "@/components/layout/PageShell";
import { leadership } from "@/lib/team/members";

export const metadata: Metadata = {
  title: "Team | SkyXperts",
  description: "Meet the SkyXperts SUAS sub-teams and leadership.",
};

export default function TeamPage() {
  return (
    <PageShell>
      {/* Hero — full team photo (uncropped), text at the bottom edge */}
      <section className="relative aspect-[16/9] w-full overflow-hidden border-b border-white/10 bg-navy md:max-h-[720px]">
        <Image
          src="/team/groupPhoto.jpg"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
          aria-hidden="true"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-navy/90 via-navy/25 to-transparent"
        />

        <div className="absolute inset-x-0 bottom-0 z-20 px-6 pb-4 text-center md:pb-6">
          <div className="mx-auto w-full max-w-3xl">
            <h1 className="text-5xl leading-[1.02] text-offwhite drop-shadow-[0_2px_16px_rgba(0,0,0,0.55)] md:text-7xl">
              Our Team
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-lg leading-8 text-offwhite drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)] md:text-xl md:leading-9">
              The people advancing horizons — engineers and operators behind
              every flight of Storm.
            </p>
          </div>
        </div>
      </section>

      {/* Institutional affiliation — ownership context, kept separate from sponsors */}
      <PageSection className="border-b border-white/10">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center sm:flex-row sm:gap-7 sm:text-left">
          <Image
            src="/ric-logo-white.webp"
            alt="Regional Informatics Center (RIC), Arab Academy for Science, Technology & Maritime Transport"
            width={520}
            height={478}
            className="h-auto w-[200px] shrink-0 md:w-[240px]"
          />
          <p className="text-sm leading-7 text-offwhite/75 md:text-base md:leading-8">
            SkyXperts is the student UAS team of the Regional Informatics Center
            (RIC), AAST.
          </p>
        </div>
      </PageSection>

      <PageSection>
        <div className="mb-8 md:mb-10">
          <p className="font-display text-base font-bold uppercase tracking-[0.16em] text-accent md:text-lg">
            Guiding the program
          </p>
          <h2 className="mt-3 text-4xl leading-[1.05] text-offwhite md:text-5xl">
            Leadership
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-offwhite/70 md:text-lg md:leading-8">
            Student leadership across software, mechanical, and electrical.
          </p>
        </div>

        <ul className="grid grid-cols-2 justify-items-center gap-4 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {leadership.map((member) => (
            <li key={member.name} className="w-full max-w-[220px]">
              <MemberCard member={member} />
            </li>
          ))}
        </ul>
      </PageSection>

      <PageSection className="border-t border-white/10">
        <div className="mb-8 md:mb-10">
          <p className="font-display text-base font-bold uppercase tracking-[0.16em] text-accent md:text-lg">
            Where the work happens
          </p>
          <h2 className="mt-3 text-4xl leading-[1.05] text-offwhite md:text-5xl">
            Sub-teams
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-offwhite/70 md:text-lg md:leading-8">
            Explore Software, Mechanical, and Electrical — the crews turning
            ideas into a flying, thinking machine.
          </p>
        </div>

        <SubTeamTabs />
      </PageSection>
    </PageShell>
  );
}
