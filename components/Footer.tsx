import type { ReactNode } from "react";
import Link from "next/link";
import { FaInstagram, FaLinkedin, FaTiktok } from "react-icons/fa6";
import Logo from "@/components/Logo";
import SponsorLogoGrid from "@/components/sponsors/SponsorLogoGrid";

const NAV_LINKS = [
  { href: "/team", label: "Team" },
  { href: "/vehicles", label: "Vehicles" },
  { href: "/gallery", label: "Gallery" },
  { href: "/build-log", label: "Build Log" },
  { href: "/sponsorships", label: "Sponsorships" },
  { href: "/contact", label: "Contact" },
] as const;

const SOCIAL = [
  {
    href: "https://www.instagram.com/skyxperts.co",
    label: "Instagram",
    icon: FaInstagram,
    hoverClass: "hover:border-[#E4405F]/40 hover:text-[#E4405F]",
  },
  {
    href: "https://tiktok.com/@skyxperts",
    label: "TikTok",
    icon: FaTiktok,
    hoverClass: "hover:border-white/35 hover:text-white",
  },
  {
    href: "https://www.linkedin.com/company/skyxperts-co/",
    label: "LinkedIn",
    icon: FaLinkedin,
    hoverClass: "hover:border-[#0A66C2]/40 hover:text-[#0A66C2]",
  },
] as const;

function FooterHeading({ children }: { children: ReactNode }) {
  return (
    <p className="font-display text-[11px] font-bold uppercase tracking-[0.18em] text-offwhite/45">
      {children}
    </p>
  );
}

export default function Footer() {
  return (
    <footer className="relative mt-auto border-t border-white/10 bg-[#070d18]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/25 to-transparent"
      />

      {/* Sponsors */}
      <div className="border-b border-white/[0.06] bg-white/[0.02]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:px-10 lg:py-9">
          <div className="shrink-0 lg:max-w-[11rem]">
            <FooterHeading>Partners</FooterHeading>
            <p className="mt-2 text-sm leading-relaxed text-offwhite/55">
              Supported by organizations that invest in student engineering.
            </p>
            <Link
              href="/sponsorships"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-offwhite/75 transition hover:text-accent"
            >
              Sponsorship opportunities
              <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="min-w-0 flex-1 lg:flex lg:justify-end">
            <SponsorLogoGrid compact />
          </div>
        </div>
      </div>

      {/* Main columns */}
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 sm:px-8 md:grid-cols-2 lg:grid-cols-12 lg:gap-8 lg:px-10 lg:py-14">
        <div className="lg:col-span-5">
          <Link
            href="/"
            className="inline-flex h-10 w-[5.5rem] items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070d18]"
            aria-label="SkyXperts home"
          >
            <Logo
              variant="small"
              className="size-full object-contain object-left opacity-95"
            />
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-offwhite/60">
            AAST&apos;s Student Unmanned Aerial Systems team — designing,
            building, and flying Storm for disaster response missions.
          </p>
          <p className="mt-3 font-display text-xs font-semibold tracking-wide text-offwhite/40">
            AAST · SUAS 2026
          </p>
        </div>

        <div className="lg:col-span-3 lg:col-start-7">
          <FooterHeading>Explore</FooterHeading>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 sm:grid-cols-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-offwhite/65 transition hover:text-offwhite"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <FooterHeading>Connect</FooterHeading>
          <p className="mt-4 text-sm text-offwhite/55">
            Follow the build and reach out before competition season.
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {SOCIAL.map(({ href, label, icon: Icon, hoverClass }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-offwhite/60 transition ${hoverClass}`}
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
          <Link
            href="/contact"
            className="mt-5 inline-block text-sm font-medium text-accent transition hover:text-accent/85"
          >
            Contact the team →
          </Link>
        </div>
      </div>

      {/* Legal bar */}
      <div className="border-t border-white/[0.06] bg-black/20">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-4 text-center sm:flex-row sm:px-8 sm:text-left lg:px-10">
          <p className="text-xs text-offwhite/40">
            © {new Date().getFullYear()} SkyXperts. All rights reserved.
          </p>
          <p className="text-xs text-offwhite/35">
            Arab Academy for Science, Technology &amp; Maritime Transport
          </p>
        </div>
      </div>
    </footer>
  );
}
