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
    <header className="relative z-20 overflow-hidden rounded-2xl border border-white/15 bg-[#0a1628] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] md:p-8">
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-80 ${theme.gradient}`}
      />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full blur-3xl ${theme.iconBg}`}
      />

      <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <span
            className={`inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/20 ${theme.iconBg} ${theme.iconText} ${theme.glow}`}
          >
            <TeamIcon slug={team.slug} className="h-8 w-8" />
          </span>

          <div>
            <p
              className={`text-xs font-bold uppercase tracking-[0.2em] ${theme.iconText}`}
            >
              {theme.label}
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-white md:text-4xl">
              {team.name}
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-white/80">
              {team.description}
            </p>
          </div>
        </div>

        <div className="shrink-0 rounded-xl border border-white/15 bg-[#07101f]/80 px-5 py-4 text-center">
          <p className={`text-3xl font-semibold ${theme.date}`}>{entryCount}</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/60">
            Timeline entries
          </p>
        </div>
      </div>
    </header>
  );
}
