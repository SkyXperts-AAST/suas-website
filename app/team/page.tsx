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
      {/* Hero — full-bleed team photo with light overlay for text */}
      <section className="relative flex min-h-[360px] flex-col items-center justify-end overflow-hidden border-b border-white/10 px-6 text-center md:min-h-[480px]">
        <Image
          src="/gallery/team.jpg"
          alt=""
          fill
          priority
          className="absolute inset-0 z-0 object-cover object-[center_70%]"
          sizes="100vw"
          aria-hidden="true"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 z-10 bg-[#0a1628]/25"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 z-10 bg-gradient-to-t from-navy/90 via-navy/35 to-transparent"
        />

        <div className="relative z-20 mx-auto w-full max-w-3xl pb-8 pt-16 md:pb-12 md:pt-20">

          <h1 className="text-5xl leading-[1.02] text-offwhite drop-shadow-[0_2px_16px_rgba(0,0,0,0.55)] md:text-7xl">
            Our Team
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-offwhite drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)] md:text-xl md:leading-9">
            The people advancing horizons — engineers and operators behind every
            flight of Storm.
          </p>
        </div>
      </section>

      <PageSection>
        <div className="mb-8 md:mb-10">
          <p className="font-display text-base font-bold uppercase tracking-[0.16em] text-accent md:text-lg">
             Guiding the program
          </p>
          <h2 className="mt-3 text-4xl leading-[1.05] text-offwhite md:text-5xl">
            Leadership
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-offwhite/70 md:text-lg md:leading-8">
            Faculty supervision and student leadership across software,
            mechanical, and electrical.
          </p>
        </div>

        <ul className="grid grid-cols-1 justify-items-center gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {leadership.map((member) => (
            <li key={member.name} className="w-full max-w-[280px]">
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
            Explore Software, Mechanical, and Electrical — the crews building
            Storm for SUAS.
          </p>
        </div>

        <SubTeamTabs />
      </PageSection>
    </PageShell>
  );
}
