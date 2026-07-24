import type { Metadata } from "next";
import VehicleCanvas from "@/components/vehicle/VehicleCanvas";
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
        Placeholder for now — the written specs/story copy isn't drafted yet.
        The `vehicle-details` id is what VehicleCanvas scrolls to, so keep it
        on whatever section ends up living here.
      */}
      <section
        id="vehicle-details"
        className="scroll-mt-[72px] border-t border-white/5 px-6 py-24 sm:px-12"
      >
        <div className="mx-auto max-w-4xl">
          <p className="font-display text-xs font-bold uppercase tracking-[0.16em] text-[#E31C1C]">
            The Airframe
          </p>
          <h2 className="mt-3 text-4xl leading-[1.05] tracking-tight text-[#F5F5F7] sm:text-5xl">
            Built for the mission, not the spec sheet
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-[1.7] text-[#F5F5F7]/70">
            The full written breakdown of Storm — airframe design, propulsion
            sizing, the autonomy stack, and the payload delivery mechanism — is
            being written up and will land here.
          </p>
        </div>
      </section>

      <section className="border-t border-white/5 px-6 py-24 sm:px-12">
        <div className="mx-auto max-w-4xl">
          <p className="font-display text-xs font-bold uppercase tracking-[0.16em] text-[#E31C1C]">
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
