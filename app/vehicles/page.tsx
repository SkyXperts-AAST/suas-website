import type { Metadata } from "next";
import VehicleCanvas from "@/components/vehicle/VehicleCanvas";
import VehicleSpecs from "@/components/vehicle/VehicleSpecs";
import FrrVideo from "@/components/vehicle/FrrVideo";

export const metadata: Metadata = {
  title: "Vehicles | SkyXperts",
  description:
    "Explore Storm — SkyXperts' autonomous heavy-lift quadcopter built for SUAS competition.",
};

export default function VehiclesPage() {
  return (
    <div className="bg-navy">
      <VehicleCanvas />

      {/*
        Scroll target for the hero's "More Info" button and the scroll hint.
        The `vehicle-details` id lives on the section inside VehicleSpecs —
        VehicleCanvas looks it up by id, so it has to stay there.
      */}
      <VehicleSpecs />

      <section className="border-t border-white/5 px-6 py-24 sm:px-12">
        <div className="mx-auto max-w-4xl">
          <p className="font-display text-[13px] font-bold uppercase tracking-[0.16em] text-[#E31C1C]">
            Flight Readiness
          </p>
          <h2 className="mt-3 text-4xl leading-[1.05] tracking-tight text-[#F5F5F7] sm:text-5xl">
            Watch our Flight Readiness Review (FRR)
          </h2>
          <div className="mt-10">
            <FrrVideo />
          </div>
        </div>
      </section>
    </div>
  );
}
