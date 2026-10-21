import {
  Camera,
  CodeXml,
  Cog,
  Cpu,
  Eye,
  Megaphone,
  Navigation,
  Radio,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { Department, SubTeam } from "@/lib/content/types";
import { Avatar } from "@/components/ui/PersonCard";
import Reveal from "@/components/ui/Reveal";

const ICONS: [RegExp, LucideIcon][] = [
  [/vision/, Eye],
  [/control|nav/, Navigation],
  [/web/, CodeXml],
  [/power|electrical/, Zap],
  [/flight-systems|computing/, Cpu],
  [/rf|comms|telemetry/, Radio],
  [/mech/, Cog],
  [/media/, Camera],
  [/sponsor|marketing|outreach/, Megaphone],
];

function iconFor(id: string): LucideIcon {
  return ICONS.find(([re]) => re.test(id))?.[1] ?? Users;
}

/** Departments as sections, each sub-team as a card with its people. */
export default function SubTeamGrid({ structure }: { structure: Department[] }) {
  return (
    <div className="space-y-16">
      {structure.map((dept, d) => {
        const cards: SubTeam[] = dept.teams.length
          ? dept.teams
          : [{ id: dept.id, name: dept.name, summary: dept.summary, lead: dept.lead, leadTBA: dept.leadTBA, members: [] }];
        return (
          <section key={dept.id} id={`dept-${dept.id}`} className="scroll-mt-28">
            <div className="flex flex-col gap-2 border-b border-white/10 pb-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="font-mono text-xs tracking-[0.18em] text-accent">
                  {String(d + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 text-3xl text-offwhite">{dept.name}</h3>
                <p className="mt-1 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-offwhite/50">
                  {dept.lead ? `Head: ${dept.lead.name}` : dept.leadTBA ? "Head to be announced" : null}
                </p>
              </div>
              {dept.teams.length && dept.summary ? (
                <p className="max-w-md text-sm text-offwhite/60 md:text-right">{dept.summary}</p>
              ) : null}
            </div>
            <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map((team, t) => {
                const Icon = iconFor(team.id);
                return (
                  <Reveal as="li" key={team.id} delay={t * 90}>
                    <article id={`team-${dept.id}-${team.id}`} className="panel panel-hover group flex h-full scroll-mt-28 flex-col p-6">
                      <span className="flex h-11 w-11 items-center justify-center rounded-sm border border-accent/30 bg-accent/10 text-accent transition group-hover:bg-accent group-hover:text-white">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <h4 className="mt-5 text-xl text-offwhite">{team.name}</h4>
                      {team.sharedWith ? (
                        <p className="mt-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-accent">
                          Joint with {team.sharedWith}
                        </p>
                      ) : null}
                      {team.summary ? (
                        <p className="mt-2 text-sm leading-relaxed text-offwhite/65">{team.summary}</p>
                      ) : null}
                      {team.leadTBA ? (
                        <p className="mt-auto border-t border-white/10 pt-4 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-offwhite/45">
                          Head to be announced
                        </p>
                      ) : null}
                      {team.lead || team.members.length ? (
                        <div className="mt-auto border-t border-white/10 pt-4">
                          {team.lead ? (
                            <p className="mb-3 flex items-center gap-2 text-sm text-offwhite/80">
                              <Avatar person={team.lead} size={28} />
                              {team.lead.name}
                              <span className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-accent">Lead</span>
                            </p>
                          ) : null}
                          {team.members.length ? (
                            <ul className="flex flex-wrap gap-1.5">
                              {team.members.map((m) => (
                                <li key={m.id} className="chip normal-case tracking-normal">
                                  {m.name}
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      ) : null}
                    </article>
                  </Reveal>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
