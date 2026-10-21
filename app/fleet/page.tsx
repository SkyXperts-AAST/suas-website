import type { Metadata } from "next";
import { PageHero, PageShell } from "@/components/layout/PageShell";
import Reveal from "@/components/ui/Reveal";
import VehicleCard from "@/components/ui/VehicleCard";
import { getFleet } from "@/lib/content";
import { FLEET_STATUS_LABEL, type FleetStatus } from "@/lib/content/types";

export const metadata: Metadata = {
  title: "Fleet | SkyXperts",
  description:
    "Every aircraft, ground vehicle and side project SkyXperts has built, from our first multirotor to Storm.",
};

const ORDER: FleetStatus[] = ["active", "development", "retired"];

export default function FleetPage() {
  const fleet = getFleet();
  const groups = ORDER.map((status) => ({
    status,
    vehicles: fleet.filter((v) => v.status === status),
  })).filter((g) => g.vehicles.length);

  return (
    <PageShell>
      <PageHero
        label="Fleet"
        title={
          <>
            Everything we&apos;ve
            <br />
            <span className="text-accent">built and flown.</span>
          </>
        }
        description="Competition aircraft, prototypes, ground vehicles and side projects. Each one taught us something the next one needed."
      />

      <div className="mx-auto max-w-6xl space-y-16 px-6 py-14 md:py-20">
        {groups.map((group) => (
          <section key={group.status}>
            <div className="flex items-baseline justify-between border-b border-white/10 pb-4">
              <h2 className="text-3xl text-offwhite">{FLEET_STATUS_LABEL[group.status]}</h2>
              <span className="font-mono text-xs tracking-[0.16em] text-offwhite/45">
                {String(group.vehicles.length).padStart(2, "0")}
              </span>
            </div>
            <ul className="mt-6 grid gap-6 md:grid-cols-2">
              {group.vehicles.map((v, i) => (
                <Reveal as="li" key={v.slug} delay={i * 90}>
                  <VehicleCard vehicle={v} />
                </Reveal>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
