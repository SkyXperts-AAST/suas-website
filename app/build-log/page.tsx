import Redirect from "@/components/layout/Redirect";

export const metadata = { title: "Journal | SkyXperts", robots: { index: false } };

export default function BuildLogMoved() {
  return <Redirect to="/journal?type=build-log" />;
}
