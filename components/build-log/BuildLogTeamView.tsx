"use client";

import BuildLogTimeline from "@/components/build-log/BuildLogTimeline";
import TeamHeader from "@/components/build-log/TeamHeader";
import type { BuildLogEntry, SubTeam, SubTeamSlug } from "@/lib/build-log/types";

type BuildLogTeamViewProps = {
  team: SubTeam;
  entries: BuildLogEntry[];
  teamSlug: SubTeamSlug;
};

export default function BuildLogTeamView({
  team,
  entries,
  teamSlug,
}: BuildLogTeamViewProps) {
  return (
    <div className="space-y-8 md:space-y-12">
      <TeamHeader team={team} />
      <BuildLogTimeline entries={entries} teamSlug={teamSlug} />
    </div>
  );
}
