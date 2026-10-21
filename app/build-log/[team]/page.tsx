import Redirect from "@/components/layout/Redirect";

export const metadata = { title: "Journal | SkyXperts", robots: { index: false } };

// The old per-team build log URLs, kept so existing links still land somewhere.
const OLD_TEAMS = ["computer-vision", "control", "electrical", "mechanical"];

export function generateStaticParams() {
  return OLD_TEAMS.map((team) => ({ team }));
}

export default async function BuildLogTeamMoved({ params }: { params: Promise<{ team: string }> }) {
  const { team } = await params;
  return <Redirect to={`/journal?team=${team}`} />;
}
