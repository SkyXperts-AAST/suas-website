import type { Metadata } from "next";
import VehicleCanvas from "@/components/vehicle/VehicleCanvas";
import VehicleSpecs from "@/components/vehicle/VehicleSpecs";

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
          <h2 className="heading-rule text-4xl text-offwhite sm:text-5xl">
            Flight Readiness
          </h2>
          <p className="kicker mt-4">
            Watch our Flight Readiness Review (FRR)
          </p>
          <div className="mt-10">
            <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-md border border-white/10 bg-[#0A0E3F]/80 text-center font-mono text-xs font-medium uppercase tracking-[0.16em] text-[#D9DDE7]/70">
              Video placeholder for future content
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
