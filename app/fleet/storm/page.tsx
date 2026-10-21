import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import DroneAssemblyScroll from "@/components/DroneAssemblyScroll";
import VehicleCanvas from "@/components/vehicle/VehicleCanvas";
import VehicleSpecs from "@/components/vehicle/VehicleSpecs";
import LoopVideo from "@/components/media/LoopVideo";
import PhotoGrid from "@/components/media/PhotoGrid";
import PostCard from "@/components/ui/PostCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { getPosts, getVehicle, toSummary } from "@/lib/content";

export const metadata: Metadata = {
  title: "Storm | Fleet | SkyXperts",
  description:
    "Storm, SkyXperts' autonomous heavy-lift quadcopter: 3rd place overall and the Best Mission Performance Award at ICMTC 2026.",
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
          <ul className="mx-auto grid max-w-4xl gap-px overflow-hidden rounded-md border border-white/10 bg-white/10 sm:grid-cols-2">
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
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.4fr_1fr] md:items-start">
          <div>
            <SectionHeading eyebrow="Footage" title="Storm in the" accent="air" align="left" />
            {storm?.video ? (
              <LoopVideo className="mt-8" src={storm.video.src} poster={storm.video.poster} caption={storm.video.caption} />
            ) : null}
          </div>
          <div className="md:pt-24">
            <LoopVideo
              src="/media/icmtc26-recap.mp4"
              poster="/media/icmtc26-recap.jpg"
              caption="ICMTC 2026. Tap for sound."
              controls
              aspect="aspect-square"
            />
          </div>
        </div>
      </section>

      {storm?.gallery.length ? (
        <section className="border-t border-white/5 px-6 py-24 sm:px-12">
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow="Gallery" title="Photos" align="left" />
            <div className="mt-8">
              <PhotoGrid photos={storm.gallery} />
            </div>
          </div>
        </section>
      ) : null}

      {storm?.companion ? (
        <section className="border-t border-white/5 px-6 py-24 sm:px-12">
          <div className="panel bg-grid mx-auto max-w-6xl p-8 md:p-12">
            <p className="eyebrow">Side project</p>
            <h2 className="mt-4 text-3xl text-offwhite md:text-4xl">{storm.companion.name}</h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-offwhite/70">{storm.companion.summary}</p>
          </div>
        </section>
      ) : null}

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
