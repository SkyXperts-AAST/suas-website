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
          <h2 className="font-display text-3xl leading-[1.05] tracking-tight text-[#E31C1C] sm:text-4xl">
            Flight Readiness
          </h2>
          <p className="mt-3 text-sm font-bold uppercase tracking-[0.16em] text-[#F5F5F7] sm:text-base">
            Watch our Flight Readiness Review (FRR)
          </p>
          <div className="mt-10">
            <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#0A0E3F]/80 text-center text-sm font-medium uppercase tracking-[0.16em] text-[#D9DDE7] shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
              Video placeholder for future content
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
