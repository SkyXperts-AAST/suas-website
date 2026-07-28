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
      <div className="flex items-start gap-5 md:gap-6">
        <TeamIcon slug={team.slug} className={`h-16 w-16 shrink-0 md:h-20 md:w-20 ${theme.iconText}`} />

        <div>
          <p
            className={`text-xs font-black uppercase tracking-[0.2em] md:text-sm ${theme.iconText}`}
          >
            {theme.label}
          </p>
          <h2 className="mt-2 text-3xl font-black leading-[1.05] tracking-tight text-offwhite md:mt-3 md:text-5xl lg:text-6xl">
            {team.name}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-offwhite/70 md:mt-4 md:text-base md:leading-7">
            {team.description}
          </p>
        </div>
      </div>
    </header>
  );
}
