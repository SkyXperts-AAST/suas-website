import Redirect from "@/components/layout/Redirect";

export const metadata = { title: "Storm | SkyXperts", robots: { index: false } };

export default function VehiclesMoved() {
  return <Redirect to="/fleet/storm" />;
}
