import Image from "next/image";
import { FaInstagram, FaLinkedin, FaTiktok } from "react-icons/fa6";
import HeroDroneExperience from "@/components/HeroDroneExperience";
import Link from "next/link";
import VerticalJourney from "@/components/VerticalJourney";
import EventCountdown from "@/components/EventCountdown";
import SponsorLogoGrid from "@/components/sponsors/SponsorLogoGrid";

export default function Home() {
  return (
    <main>
      {/* HERO SECTION */}
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

      {/* ABOUT */}
      <section className="border-b border-white/10 bg-navy px-6 py-16">
  <div className="mx-auto flex max-w-4xl flex-col items-center gap-10 md:flex-row">
    <div className="flex-1 text-center md:text-left">
      <p className="font-display text-xs font-bold uppercase tracking-[0.16em] text-[#E31C1C]">
        Who we are
      </p>
      <h2 className="mt-3 font-display text-4xl leading-[1.05] tracking-tight text-[#F5F5F7] sm:text-5xl">
        Built by students, flown for the mission
      </h2>
      <p className="mt-6 max-w-2xl text-base leading-[1.7] text-[#F5F5F7]/70">
        SkyXperts is AAST&apos;s team competing in the Student Unmanned
        Aerial Systems (SUAS) Competition, founded in 2023. Our team of
        25 students designs, builds, and flies Storm — our entry for
        SUAS 2026 — tackling this year&apos;s Storm Response mission:
        rapid damage assessment, search and recovery, and environmental
        monitoring in the aftermath of a disaster.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4 md:justify-start">
        <Link href="/team" className="rounded-full bg-white px-5 py-2 text-sm font-medium text-navy transition hover:bg-white/90">
          Meet the team
        </Link>
        <Link href="/vehicles" className="rounded-full border-2 border-white px-5 py-2 text-sm font-medium text-white transition hover:bg-white hover:text-navy">
          See how Storm is built
        </Link>
      </div>
    </div>
    <div className="flex-1">
      <Image src="/drone-nobackground.png" alt="SkyXperts drone, Storm, front view" width={400} height={400} className="mx-auto h-auto w-full max-w-sm" />
    </div>
  </div>
</section>

      <VerticalJourney />
      <EventCountdown />

      {/* SPONSORS */}
      <section className="border-b border-white/10 bg-[#0a1628] px-6 py-8 text-center">
        <p className="mb-4 text-xs font-medium uppercase tracking-wide text-white/60">
          Backed by
        </p>
        <SponsorLogoGrid compact />
        <Link href="/sponsorships" className="mt-5 inline-block text-sm font-medium text-white underline-offset-2 transition hover:underline">
          See our sponsors
        </Link>
      </section>

      {/* SOCIAL LINKS */}
      <section className="flex items-center justify-center gap-6 bg-[#0a1628] px-6 py-6">
        <a href="https://www.instagram.com/skyxperts.co" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <FaInstagram className="h-6 w-6 text-[#E4405F]" />
        </a>
        <a href="https://tiktok.com/@skyxperts" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
          <FaTiktok className="h-6 w-6 text-white" />
        </a>
        <a href="https://www.linkedin.com/company/skyxperts-co/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <FaLinkedin className="h-6 w-6 text-[#0A66C2]" />
        </a>
      </section>
    </main>
  );
}