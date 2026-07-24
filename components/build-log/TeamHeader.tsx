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
    <header className="relative z-30 overflow-hidden border border-white/15 bg-[#0a1628]/90">
      <div
        className={`pointer-events-none absolute inset-0 z-0 bg-gradient-to-br opacity-70 ${theme.gradient}`}
      />

      <div className="relative z-10 flex flex-col gap-5 px-5 py-6 md:flex-row md:items-stretch md:justify-between md:px-8 md:py-7">
        <div className="flex items-start gap-4">
          <span
            className={`inline-flex h-14 w-14 shrink-0 items-center justify-center border border-white/15 ${theme.iconBg} ${theme.iconText}`}
          >
            <TeamIcon slug={team.slug} className="h-7 w-7" />
          </span>

          <div>
            <p
              className={`text-[0.625rem] font-black uppercase tracking-[0.18em] ${theme.iconText}`}
            >
              {theme.label}
            </p>
            <h2 className="mt-1.5 text-2xl font-bold leading-tight text-white md:text-3xl">
              {team.name}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70 md:text-base md:leading-7">
              {team.description}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-4 border border-white/10 bg-[#07101f]/80 px-5 py-4 md:flex-col md:justify-center md:px-6 md:text-center">
          <p className={`text-3xl font-black tabular-nums ${theme.date}`}>
            {entryCount}
          </p>
          <p className="text-[0.625rem] font-black uppercase tracking-[0.16em] text-white/50">
            Timeline entries
          </p>
        </div>
      </div>
    </header>
  );
}
