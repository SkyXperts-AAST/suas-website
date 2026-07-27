import Image from "next/image";
import HeroDroneExperience from "@/components/HeroDroneExperience";
import DroneAssemblyScroll from "@/components/DroneAssemblyScroll";
import VerticalJourney from "@/components/VerticalJourney";
import EventCountdown from "@/components/EventCountdown";
import JourneyRail, { type JourneyChapter } from "@/components/home/JourneyRail";
import LeadershipTease from "@/components/home/LeadershipTease";
import SubteamsTease from "@/components/home/SubteamsTease";
import {
  HomeSectionBridge,
  HomeStoryChapter,
} from "@/components/home/HomeStoryChapter";

const CHAPTERS: JourneyChapter[] = [
  { id: "origin", label: "Origin" },
  { id: "timeline", label: "Timeline" },
  { id: "leadership", label: "Leadership" },
  { id: "subteams", label: "Sub-teams" },
  { id: "build", label: "Build" },
  { id: "countdown", label: "Mission" },
];

export default function Home() {
  return (
    <main className="bg-navy">
      <JourneyRail chapters={CHAPTERS} />

      {/* HERO — the opening frame of the story */}
      <section className="relative flex min-h-[480px] flex-col items-center justify-center overflow-hidden bg-[#0a1628] px-6 text-center">
        <Image
          src="/drone.png"
          alt="SkyXperts drone in flight"
          fill
          className="z-0 object-cover opacity-40"
          priority
        />
        <HeroDroneExperience />
        <div className="absolute inset-0 z-20 bg-black/20" />
        <div className="absolute left-4 top-4 z-30">
          <Image
            src="/logo.png"
            alt="SkyXperts logo"
            width={180}
            height={90}
            className="h-auto w-28 drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]"
            priority
          />
        </div>
        <div className="relative z-30 flex flex-col items-center">
          <h1 className="font-display text-4xl leading-[1.05] tracking-tight text-[#F5F5F7] sm:text-5xl">
            Meet Storm. Engineered to respond.
          </h1>
          <p className="mt-2 text-sm text-[#F5F5F7]/70">AAST · SUAS 2026</p>
        </div>
        <div
          className="absolute inset-x-0 bottom-0 z-30 px-6 py-4"
          style={{ backgroundColor: "rgba(10,22,40,0.35)" }}
        >
          <div className="mx-auto flex w-full max-w-4xl items-center gap-4">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/20">
              <span className="text-lg">🏆</span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                Best mission award · 3rd place overall
              </p>
              <p className="text-xs text-white/70">ICMTC 2026</p>
            </div>
          </div>
        </div>
      </section>

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
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.02] px-6 py-14 sm:px-12 sm:py-20">
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

      {/* CHAPTER 03 — LEADERSHIP */}
      <section id="leadership" className="scroll-mt-24 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          <HomeStoryChapter
            chapter="03"
            label="Leadership"
            title="Guiding the program"
            description="Faculty supervision and student leadership across software, mechanical, and electrical steer every decision Storm makes in the air."
          />
          <div className="mt-10">
            <LeadershipTease />
          </div>
        </div>
      </section>

      <HomeSectionBridge />

      {/* CHAPTER 04 — SUB-TEAMS */}
      <section id="subteams" className="scroll-mt-24 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          <HomeStoryChapter
            chapter="04"
            label="Sub-teams"
            title="Three crews, one mission"
            description="Software, Mechanical, and Electrical each own a piece of Storm — and come together every time it takes off."
          />
          <div className="mt-10">
            <SubteamsTease />
          </div>
        </div>
      </section>

      {/* CHAPTER 05 — BUILD */}
      <div id="build" className="scroll-mt-24">
        <DroneAssemblyScroll />
      </div>

      {/* CHAPTER 06 — MISSION */}
      <div id="countdown" className="scroll-mt-24">
        <EventCountdown />
      </div>
    </main>
  );
}
