import type { Department, SeasonRole } from "@/lib/content/types";

/**
 * How the team is organised this season, drawn as a live wiring diagram:
 * board on top, mentors advising from the side, departments on a bus line,
 * sub-teams hanging off each department. A light pulse runs along every wire.
 * Entirely CSS, so it renders without JS and stops under reduced motion.
 * Sub-team nodes link to their card further down the page.
 */
export default function OrgChart({
  leadership,
  mentors,
  structure,
}: {
  leadership: SeasonRole[];
  mentors: SeasonRole[];
  structure: Department[];
}) {
  const cols = structure.length;
  const edge = `${50 / cols}%`;

  return (
    <div className="panel bg-grid overflow-hidden px-5 py-10 md:px-10 md:py-14">
      {/* Top: board, with mentors advising alongside (offset right on desktop
          so the board stays centred over the department bus) */}
      <div className="relative flex flex-col items-center gap-6 md:block">
        <div className="flex justify-center">
          <Node title="Board" kicker="Leadership" live>
            {leadership.length ? (
              <ul className="mt-3 space-y-1 text-left">
                {leadership.map((r) => (
                  <li key={r.person.id} className="text-sm text-offwhite/80">
                    {r.person.name}
                    <span className="ml-2 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-offwhite/45">
                      {r.role}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </Node>
        </div>

        {mentors.length ? (
          <div className="flex w-full justify-center md:absolute md:left-[calc(50%+7.5rem)] md:top-1/2 md:w-auto md:-translate-y-1/2 md:items-center">
            <span
              aria-hidden="true"
              className="hidden h-px w-12 border-t border-dashed border-accent/50 md:block"
            />
            <Node title="Mentors" kicker="Advisory" dashed>
              <p className="mt-2 text-sm text-offwhite/70">
                Founder and {mentors.length - 1} mentors across every sub-team
              </p>
            </Node>
          </div>
        ) : null}
      </div>

      {/* Desktop tree */}
      <div className="hidden md:block">
        <div className="mx-auto h-10 w-px wire-y" aria-hidden="true" />
        <div className="relative">
          <div
            aria-hidden="true"
            className="wire-x absolute top-0 h-px"
            style={{ left: edge, right: edge }}
          />
          <ol
            className="grid gap-5"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
          >
            {structure.map((dept, i) => (
              <li key={dept.id} className="flex flex-col items-center">
                <div
                  className="h-8 w-px wire-y"
                  style={{ animationDelay: `${i * 0.35}s` }}
                  aria-hidden="true"
                />
                <Node title={dept.name} kicker="Department" href={`#dept-${dept.id}`}>
                  <p className="mt-1 text-xs text-offwhite/55">
                    {dept.lead ? `Head: ${dept.lead.name}` : dept.leadTBA ? "Head: to be announced" : null}
                  </p>
                </Node>
                {dept.teams.length ? (
                  <ul className="relative mt-0 flex w-full flex-col items-center">
                    {dept.teams.map((team, j) => (
                      <li key={team.id} className="flex w-full flex-col items-center">
                        <div
                          className="h-5 w-px wire-y"
                          style={{ animationDelay: `${i * 0.35 + (j + 1) * 0.3}s` }}
                          aria-hidden="true"
                        />
                        <a
                          href={`#team-${dept.id}-${team.id}`}
                          className="w-full max-w-[13rem] rounded-sm border border-white/10 bg-navy/80 px-3 py-2 text-center text-[0.8125rem] text-offwhite/80 transition hover:border-accent/60 hover:text-offwhite"
                        >
                          {team.name}
                          {team.sharedWith ? (
                            <span className="mt-0.5 block font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-accent/80">
                              Shared with {team.sharedWith}
                            </span>
                          ) : null}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Mobile tree: one vertical spine */}
      <ol className="relative mt-8 space-y-6 pl-6 md:hidden">
        <span aria-hidden="true" className="wire-y absolute bottom-3 left-0 top-0 w-px" />
        {structure.map((dept) => (
          <li key={dept.id} className="relative">
            <span aria-hidden="true" className="absolute -left-6 top-5 h-px w-6 bg-accent/40" />
            <Node title={dept.name} kicker="Department" href={`#dept-${dept.id}`} full>
              <p className="mt-1 text-xs text-offwhite/55">
                {dept.lead ? `Head: ${dept.lead.name}` : dept.leadTBA ? "Head: to be announced" : null}
              </p>
            </Node>
            {dept.teams.length ? (
              <ul className="mt-2 space-y-2 border-l border-white/10 pl-4">
                {dept.teams.map((team) => (
                  <li key={team.id}>
                    <a
                      href={`#team-${dept.id}-${team.id}`}
                      className="block rounded-sm border border-white/10 bg-navy/80 px-3 py-2 text-sm text-offwhite/80"
                    >
                      {team.name}
                      {team.sharedWith ? (
                        <span className="ml-2 font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-accent/80">
                          Shared with {team.sharedWith}
                        </span>
                      ) : null}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}

function Node({
  title,
  kicker,
  children,
  href,
  live = false,
  dashed = false,
  full = false,
}: {
  title: string;
  kicker: string;
  children?: React.ReactNode;
  href?: string;
  live?: boolean;
  dashed?: boolean;
  full?: boolean;
}) {
  const body = (
    <>
      <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-accent">{kicker}</p>
      <p className="mt-1 font-display text-xl font-semibold text-offwhite">{title}</p>
      {children}
    </>
  );
  const cls = `relative block rounded-sm border bg-navy px-5 py-4 text-center ${
    dashed ? "border-dashed border-white/20" : "border-white/15"
  } ${live ? "node-live border-accent/50" : ""} ${full ? "w-full text-left" : "w-60 max-w-full"} ${
    href ? "transition hover:border-accent/60" : ""
  }`;
  return href ? (
    <a href={href} className={cls}>
      {body}
    </a>
  ) : (
    <div className={cls}>{body}</div>
  );
}
