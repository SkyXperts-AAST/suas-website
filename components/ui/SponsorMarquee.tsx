import Image from "next/image";
import type { Sponsor } from "@/lib/content/types";

/**
 * Endless horizontal logo band. Pure CSS: the logo set is repeated until one
 * track is wider than any screen, and two identical tracks slide left by their
 * own width so the loop is seamless. Pauses on hover; static under reduced
 * motion. Logos sit in white, full colour on hover.
 */
export default function SponsorMarquee({
  sponsors,
  secondsPerLogo = 5,
}: {
  sponsors: Sponsor[];
  secondsPerLogo?: number;
}) {
  if (sponsors.length === 0) return null;
  const repeats = Math.max(2, Math.ceil(8 / sponsors.length));
  const set = Array.from({ length: repeats }, () => sponsors).flat();
  const duration = `${set.length * secondsPerLogo}s`;

  const track = (hidden: boolean) => (
    <ul
      className="marquee-track flex shrink-0 items-center"
      aria-hidden={hidden || undefined}
      style={{ ["--marquee-duration" as string]: duration }}
    >
      {set.map((sponsor, i) => (
        <li key={`${sponsor.id}-${i}`} className="px-8 md:px-12">
          <a
            href={sponsor.url ?? "#"}
            target="_blank"
            rel="noreferrer"
            tabIndex={hidden || i >= sponsors.length ? -1 : undefined}
            className="group flex h-16 w-40 items-center justify-center md:w-48"
            title={sponsor.name}
          >
            {sponsor.logo ? (
              <Image
                src={sponsor.logo}
                alt={hidden || i >= sponsors.length ? "" : sponsor.name}
                width={192}
                height={64}
                className="max-h-12 w-auto object-contain opacity-60 brightness-0 invert transition duration-300 group-hover:opacity-100 group-hover:brightness-100 group-hover:invert-0"
              />
            ) : (
              <span className="font-display text-xl text-offwhite/60">{sponsor.name}</span>
            )}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="marquee flex overflow-hidden" aria-label="Our sponsors">
      {track(false)}
      {track(true)}
    </div>
  );
}
