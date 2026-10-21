import Image from "next/image";
import Hero from "@/components/home/Hero";
import DroneAssemblyScroll from "@/components/DroneAssemblyScroll";
import VerticalJourney from "@/components/VerticalJourney";
import JourneyRail, { type JourneyChapter } from "@/components/home/JourneyRail";
import AwardHighlight from "@/components/home/AwardHighlight";
import SpecialThanks from "@/components/home/SpecialThanks";
import {
  HomeSectionBridge,
  HomeStoryChapter,
} from "@/components/home/HomeStoryChapter";

const CHAPTERS: JourneyChapter[] = [
  { id: "origin", label: "Origin" },
  { id: "timeline", label: "Timeline" },
  { id: "award", label: "Recognition" },
  { id: "build", label: "Build" },
  { id: "thanks", label: "Thanks" },
];

export default function Home() {
  return (
    <main className="bg-navy">
      <JourneyRail chapters={CHAPTERS} />

      {/* HERO — the opening frame of the story */}
      <Hero />

      <HomeSectionBridge />

      {/* CHAPTER 01 — ORIGIN */}
      <section id="origin" className="scroll-mt-24 px-6 py-20 md:py-28">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 md:flex-row">
          <HomeStoryChapter
            chapter="01"
            label="Origin"
            title="We build. We don't just study."
            description="SkyXperts started at AAST with a handful of students who wanted to build real autonomous aircraft instead of just reading about them. That hasn't changed. We're a full team now — avionics, structures, vision, control — designing and flying vehicles from scratch. Competitions like SUAS and ICMTC aren't the reason we exist. They're where we prove the work."
            className="flex-1"
          />
          <div className="flex-1">
            <Image
              src="/drone-nobackground.png"
              alt="SkyXperts drone, Storm, front view"
              width={400}
              height={400}
              className="mx-auto h-auto w-full max-w-sm"
            />
          </div>
        </div>
      </section>

      <HomeSectionBridge />

      {/* CHAPTER 02 — TIMELINE (the narrative centerpiece, given extra scale
          and its own spotlighted panel so it reads as the story's high point) */}
      <section id="timeline" className="scroll-mt-24 px-6 py-20 md:py-28">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-md border border-white/10 bg-white/[0.015] px-6 py-14 sm:px-12 sm:py-20">
          <div className="relative">
            <h2 className="heading-rule heading-rule-center mx-auto max-w-3xl text-balance text-center text-4xl text-offwhite sm:text-5xl lg:text-6xl">
              Timeline
            </h2>
            <p className="kicker mt-4 text-center">
              From first flight to Storm
            </p>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-center text-base leading-8 text-offwhite/70 md:text-lg">
              Two and a half years of building, testing, and iterating — from
              a founding idea to an award-winning flight at ICMTC.
            </p>
            <VerticalJourney />
          </div>
        </div>
      </section>

      <HomeSectionBridge />

      {/* CHAPTER 03 — RECOGNITION */}
      <AwardHighlight />

      {/* CHAPTER 04 — BUILD */}
      <div id="build" className="scroll-mt-16">
        <DroneAssemblyScroll />
      </div>

      {/* CHAPTER 05 — SPECIAL THANKS */}
      <div id="thanks" className="scroll-mt-24">
        <SpecialThanks />
      </div>
    </main>
  );
}
