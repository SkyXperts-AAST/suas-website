import TeamIcon from "@/components/build-log/TeamIcon";
import { getTeamTheme } from "@/lib/build-log/themes";
import type { SubTeam } from "@/lib/build-log/types";

type TeamHeaderProps = {
  team: SubTeam;
  entryCount: number;
};

export default function TeamHeader({ team, entryCount }: TeamHeaderProps) {
  const theme = getTeamTheme(team.slug);

  return (
    <header className="relative z-30">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-5 md:gap-6">
          <TeamIcon slug={team.slug} className={`h-14 w-14 shrink-0 md:h-16 md:w-16 ${theme.iconText}`} />

          <div>
            <p
              className={`text-[0.625rem] font-black uppercase tracking-[0.18em] ${theme.iconText}`}
            >
              {theme.label}
            </p>
            <h2 className="mt-1.5 text-2xl font-bold leading-tight text-offwhite md:text-3xl">
              {team.name}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-offwhite/70 md:text-base md:leading-7">
              {team.description}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-baseline gap-2 md:flex-col md:items-end md:gap-0 md:text-right">
          <p className={`text-3xl font-black tabular-nums ${theme.date}`}>
            {entryCount}
          </p>
          <p className="text-[0.625rem] font-black uppercase tracking-[0.16em] text-offwhite/50">
            Timeline entries
          </p>
        </div>
      </div>
    </header>
  );
}
