import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BuildLogTimeline from "@/components/build-log/BuildLogTimeline";
import TeamHeader from "@/components/build-log/TeamHeader";
import { getEntriesForTeam } from "@/lib/build-log/entries";
import { getSubTeam, isSubTeamSlug, SUB_TEAMS } from "@/lib/build-log/teams";

type BuildLogTeamPageProps = {
  params: Promise<{ team: string }>;
};

export function generateStaticParams() {
  return SUB_TEAMS.map((team) => ({ team: team.slug }));
}

export async function generateMetadata({
  params,
}: BuildLogTeamPageProps): Promise<Metadata> {
  const { team: teamSlug } = await params;
  const team = getSubTeam(teamSlug);

  if (!team) {
    return { title: "Build Log | SkyXperts" };
  }

  return {
    title: `${team.name} Build Log | SkyXperts`,
    description: team.description,
  };
}

export default async function BuildLogTeamPage({ params }: BuildLogTeamPageProps) {
  const { team: teamSlug } = await params;

  if (!isSubTeamSlug(teamSlug)) {
    notFound();
  }

  const team = getSubTeam(teamSlug);
  const entries = getEntriesForTeam(teamSlug);

  if (!team) {
    notFound();
  }

  return (
    <div className="relative isolate space-y-10 md:space-y-12">
      <TeamHeader team={team} entryCount={entries.length} />
      <BuildLogTimeline entries={entries} teamSlug={teamSlug} />
    </div>
  );
}
