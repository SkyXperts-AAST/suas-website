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
      className="build-log-subteam-nav grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-0 sm:border-b sm:border-white/10 md:grid-cols-4"
    >
      {SUB_TEAMS.map((team) => {
        const active = isTeamActive(pathname, team.slug);
        const theme = getTeamTheme(team.slug as SubTeamSlug);

        return (
          <Link
            key={team.slug}
            href={teamHref(team.slug)}
            data-build-log-team={team.slug}
            aria-current={active ? "page" : undefined}
            className={`group relative flex flex-col items-center gap-2 rounded-xl border border-white/10 px-3 py-3.5 text-center transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent sm:flex-row sm:justify-center sm:gap-2.5 sm:rounded-none sm:border-0 sm:px-3 sm:py-1 sm:pb-4 md:gap-3 md:px-4 ${
              active
                ? "border-accent/30 bg-accent/10 text-offwhite sm:border-0 sm:bg-transparent"
                : "text-offwhite/55 hover:border-white/20 hover:text-offwhite/85 sm:hover:border-0"
            }`}
          >
            <TeamIcon
              slug={team.slug}
              className={`h-7 w-7 shrink-0 sm:h-10 sm:w-10 md:h-12 md:w-12 ${
                active ? theme.iconText : "text-offwhite/40 group-hover:text-offwhite/65"
              }`}
            />

            <div className="min-w-0 w-full sm:w-auto">
              <p
                className={`text-[0.5625rem] font-black uppercase leading-tight tracking-[0.1em] sm:text-[0.625rem] sm:tracking-[0.16em] md:text-xs ${
                  active ? theme.iconText : "text-offwhite/40 group-hover:text-offwhite/60"
                }`}
              >
                {theme.label}
              </p>
              <p className="mt-1 line-clamp-2 text-[0.6875rem] font-bold leading-snug sm:line-clamp-none sm:mt-0.5 sm:text-xs md:text-base">
                {team.name}
              </p>
            </div>

            <span
              aria-hidden="true"
              className={`absolute inset-x-0 bottom-0 hidden h-0.5 origin-left transition-transform duration-200 sm:block ${
                active ? "scale-x-100 bg-accent" : "scale-x-0 bg-accent/60 group-hover:scale-x-100"
              }`}
            />
          </Link>
        );
      })}
    </nav>
  );
}
