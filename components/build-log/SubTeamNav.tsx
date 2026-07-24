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
      className="grid grid-cols-1 divide-y divide-white/10 border border-white/10 sm:grid-cols-2 sm:divide-x sm:divide-y-0 xl:grid-cols-4"
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
            className={`group relative overflow-hidden p-4 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent md:p-5 ${
              active
                ? `bg-white/[0.08] ${theme.glow}`
                : "bg-white/[0.02] hover:bg-white/[0.05]"
            }`}
          >
            {active && (
              <span
                aria-hidden="true"
                className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${theme.timelineLine}`}
              />
            )}

            <div
              className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-200 ${theme.gradient} ${
                active ? "opacity-100" : "group-hover:opacity-60"
              }`}
            />

            <div className="relative flex items-start gap-3">
              <span
                className={`inline-flex h-10 w-10 shrink-0 items-center justify-center border border-white/10 ${theme.iconBg} ${theme.iconText}`}
              >
                <TeamIcon slug={team.slug} className="h-5 w-5" />
              </span>

              <div className="min-w-0 flex-1">
                <p
                  className={`text-[0.625rem] font-black uppercase tracking-[0.16em] ${theme.iconText}`}
                >
                  {theme.label}
                </p>
                <p className="mt-1 text-sm font-bold text-offwhite md:text-base">
                  {team.name}
                </p>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-offwhite/50">
                  {team.description}
                </p>
              </div>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
