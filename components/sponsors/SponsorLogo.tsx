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

  const frameClass = compact
    ? "flex h-14 w-36 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2 transition hover:border-gray-300"
    : "flex h-28 w-full items-center justify-center rounded-2xl border border-white/10 bg-white px-6 py-5 transition hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(0,0,0,0.28)]";

  const content = sponsor.logoSrc ? (
    <Image
      src={sponsor.logoSrc}
      alt={sponsor.name}
      width={compact ? 120 : 160}
      height={compact ? 48 : 64}
      className={
        compact
          ? "h-8 w-auto max-w-full object-contain"
          : "h-12 w-auto max-w-full object-contain sm:h-14"
      }
    />
  ) : (
    // TODO: replace with real logo file
    <span
      className={`font-semibold tracking-wide ${
        compact ? "text-sm text-gray-700" : "text-base text-navy"
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
