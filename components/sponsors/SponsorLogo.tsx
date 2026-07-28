import Image from "next/image";
import type { Sponsor } from "@/lib/sponsors/sponsors";

type SponsorLogoProps = {
  sponsor: Sponsor;
  /** Compact = homepage strip; default = sponsorships page cards. */
  compact?: boolean;
};

export default function SponsorLogo({
  sponsor,
  compact = false,
}: SponsorLogoProps) {
  const isExternal = sponsor.href.startsWith("http");

  // No card, no white fill — logos sit directly on the dark background, just
  // bigger and given breathing room instead of being boxed in.
  const frameClass = compact
    ? "group flex h-16 w-40 items-center justify-center transition sm:h-20 sm:w-48"
    : "group flex h-32 w-full items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-6 transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.05] sm:h-40";

  // Rendered as a soft white silhouette so every logo reads cleanly against
  // navy regardless of its own colors (some, like dark wordmarks, would
  // otherwise vanish) — full color reveals on hover/focus as a small reward.
  const logoTreatment =
    "opacity-70 brightness-0 invert transition duration-300 group-hover:opacity-100 group-hover:brightness-100 group-hover:invert-0 group-focus-visible:opacity-100 group-focus-visible:brightness-100 group-focus-visible:invert-0";

  const content = sponsor.logoSrc ? (
    <Image
      src={sponsor.logoSrc}
      alt={sponsor.name}
      width={compact ? 200 : 260}
      height={compact ? 80 : 104}
      className={`${
        compact
          ? "h-14 w-auto max-w-full object-contain sm:h-16"
          : "h-20 w-auto max-w-full object-contain sm:h-24"
      } ${logoTreatment}`}
    />
  ) : (
    // TODO: replace with real logo file
    <span
      className={`font-semibold tracking-wide text-offwhite/70 transition group-hover:text-offwhite ${
        compact ? "text-base" : "text-lg"
      }`}
    >
      {sponsor.name}
    </span>
  );

  return (
    <a
      href={sponsor.href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      aria-label={sponsor.name}
      className={frameClass}
    >
      {content}
    </a>
  );
}
