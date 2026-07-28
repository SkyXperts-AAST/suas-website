import TeamIcon from "@/components/build-log/TeamIcon";
import { getTeamTheme } from "@/lib/build-log/themes";
import type { SubTeam } from "@/lib/build-log/types";

type TeamHeaderProps = {
  team: SubTeam;
};

export default function TeamHeader({ team }: TeamHeaderProps) {
  const theme = getTeamTheme(team.slug);

  return (
    <header className="build-log-team-header relative z-30">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5 md:gap-6">
        <TeamIcon
          slug={team.slug}
          className={`h-12 w-12 shrink-0 sm:h-16 sm:w-16 md:h-20 md:w-20 ${theme.iconText}`}
        />

        <div className="min-w-0 flex-1">
          <p
            className={`text-[0.6875rem] font-black uppercase tracking-[0.16em] sm:text-xs md:text-sm ${theme.iconText}`}
          >
            {theme.label}
          </p>
          <h2 className="mt-1.5 break-words text-2xl font-black leading-[1.08] tracking-tight text-offwhite sm:mt-2 sm:text-3xl md:mt-3 md:text-5xl lg:text-6xl">
            {team.name}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-offwhite/70 sm:mt-3 md:mt-4 md:text-base md:leading-7">
            {team.description}
          </p>
        </div>
      </div>
    </header>
  );
}
