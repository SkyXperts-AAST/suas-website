import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BuildLogTeamView from "@/components/build-log/BuildLogTeamView";
import { getEntriesForTeam } from "@/lib/build-log/loadEntries";
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
  const entries = await getEntriesForTeam(teamSlug);

  if (!team) {
    notFound();
  }

  return <BuildLogTeamView team={team} entries={entries} teamSlug={teamSlug} />;
}
