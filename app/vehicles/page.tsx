import type { Metadata } from "next";
import VehicleCanvas from "@/components/vehicle/VehicleCanvas";

export const metadata: Metadata = {
  title: "Vehicles | SkyXperts",
  description:
    "Explore Strom — SkyXperts' autonomous heavy-lift quadcopter built for SUAS competition.",
};

export default function VehiclesPage() {
  return (
    <div className="bg-navy">
      <VehicleCanvas />
    </div>
  );
}
