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
            title="Built by students, flown for the mission"
            description="SkyXperts is AAST's team competing in the Student Unmanned Aerial Systems (SUAS) Competition, founded in 2023. Our team of 25 students designs, builds, and flies Storm — our entry for SUAS 2026 — tackling this year's Storm Response mission: rapid damage assessment, search and recovery, and environmental monitoring in the aftermath of a disaster."
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
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.02] px-6 py-14 sm:px-12 sm:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_60%_at_50%_0%,rgba(227,28,28,0.14),transparent_65%)]"
          />
          <div className="relative">
            <p className="text-center font-display text-xs font-bold uppercase tracking-[0.24em] text-accent">
              Chapter 02 · Timeline
            </p>
            <h2 className="mx-auto mt-4 max-w-3xl text-balance text-center font-display text-5xl leading-[1.02] tracking-tight text-offwhite sm:text-6xl lg:text-7xl">
              From first flight to Storm
            </h2>
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
      <div id="build" className="scroll-mt-24">
        <DroneAssemblyScroll />
      </div>

      {/* CHAPTER 05 — SPECIAL THANKS */}
      <div id="thanks" className="scroll-mt-24">
        <SpecialThanks />
      </div>
    </main>
  );
}
