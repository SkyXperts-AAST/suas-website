"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import TeamIcon from "@/components/build-log/TeamIcon";
import { SUB_TEAMS } from "@/lib/build-log/teams";
import { getTeamTheme } from "@/lib/build-log/themes";
import type { SubTeamSlug } from "@/lib/build-log/types";

function teamHref(slug: string) {
  return `/build-log/${slug}`;
}

function isTeamActive(pathname: string, slug: string) {
  return pathname === teamHref(slug);
}

export default function SubTeamNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Sub-team build logs"
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
    >
      {SUB_TEAMS.map((team) => {
        const active = isTeamActive(pathname, team.slug);
        const theme = getTeamTheme(team.slug as SubTeamSlug);

        return (
          <Link
            key={team.slug}
            href={teamHref(team.slug)}
            aria-current={active ? "page" : undefined}
            className={`group relative overflow-hidden rounded-2xl border p-4 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-navy md:p-5 ${
              active
                ? `border-white/20 bg-white/10 ring-2 ${theme.ring} ${theme.glow} scale-[1.02]`
                : "border-white/10 bg-white/[0.03] hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.06]"
            }`}
          >
            <div
              className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 ${theme.gradient} ${
                active ? "opacity-100" : "group-hover:opacity-70"
              }`}
            />

            <div className="relative flex items-start gap-4">
              <span
                className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 transition-transform duration-300 ${theme.iconBg} ${theme.iconText} ${
                  active ? "scale-110" : "group-hover:scale-105"
                }`}
              >
                <TeamIcon slug={team.slug} className="h-6 w-6" />
              </span>

              <div className="min-w-0 flex-1">
                <p
                  className={`text-[0.6875rem] font-bold uppercase tracking-[0.18em] ${theme.iconText}`}
                >
                  {theme.label}
                </p>
                <p className="mt-1 text-base font-semibold text-offwhite md:text-lg">
                  {team.name}
                </p>
                <p className="mt-1 line-clamp-2 text-sm leading-5 text-offwhite/55">
                  {team.description}
                </p>
              </div>
            </div>

            {active && (
              <span
                aria-hidden="true"
                className={`absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-gradient-to-r ${theme.timelineLine}`}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
