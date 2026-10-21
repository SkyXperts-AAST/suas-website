import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import DroneAssemblyScroll from "@/components/DroneAssemblyScroll";
import VehicleCanvas from "@/components/vehicle/VehicleCanvas";
import VehicleSpecs from "@/components/vehicle/VehicleSpecs";
import PostCard from "@/components/ui/PostCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { getPosts, getVehicle, toSummary } from "@/lib/content";

export const metadata: Metadata = {
  title: "Storm | Fleet | SkyXperts",
  description:
    "Storm, SkyXperts' autonomous heavy-lift quadcopter: Best Mission and 3rd overall at ICMTC 2026, and our SUAS 2026 entry.",
};

export default function StormPage() {
  const storm = getVehicle("storm");
  const posts = getPosts()
    .filter((p) => storm?.seasons.includes(p.season))
    .slice(0, 3)
    .map(toSummary);

  return (
    <div id="vehicle-top" className="bg-navy">
      <VehicleCanvas />

      <div className="mx-auto max-w-4xl px-6 pt-10 sm:px-12">
        <Link
          href="/fleet"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-offwhite/55 transition hover:text-accent"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> All vehicles
        </Link>
      </div>

      {/*
        Scroll target for the hero's "More Info" button and the scroll hint.
        The `vehicle-details` id lives on the section inside VehicleSpecs —
        VehicleCanvas looks it up by id, so it has to stay there.
      */}
      <VehicleSpecs />

      {storm?.achievements.length ? (
        <section className="border-t border-white/5 px-6 py-16 sm:px-12">
          <ul className="mx-auto grid max-w-4xl gap-px overflow-hidden rounded-md border border-white/10 bg-white/10 sm:grid-cols-3">
            {storm.achievements.map((a, i) => (
              <li key={a} className="bg-navy p-6">
                <p className="font-mono text-xs tracking-[0.18em] text-accent">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="mt-3 font-display text-xl text-offwhite">{a}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <DroneAssemblyScroll />

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

      {posts.length ? (
        <section className="border-t border-white/5 px-6 py-24 sm:px-12">
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow="Journal" title="How Storm was" accent="built" />
            <ul className="mt-12 grid gap-5 md:grid-cols-3">
              {posts.map((post) => (
                <li key={post.slug}>
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
            <p className="mt-10 text-center">
              <Link href="/journal?season=2025-26" className="font-mono text-xs uppercase tracking-[0.16em] text-accent hover:underline">
                Every Storm build log entry →
              </Link>
            </p>
          </div>
        </section>
      ) : null}
    </div>
  );
}
