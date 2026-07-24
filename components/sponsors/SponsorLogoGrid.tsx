import SponsorLogo from "@/components/sponsors/SponsorLogo";
import { SPONSORS } from "@/lib/sponsors/sponsors";

type SponsorLogoGridProps = {
  compact?: boolean;
};

export default function SponsorLogoGrid({
  compact = false,
}: SponsorLogoGridProps) {
  return (
    <ul
      className={
        compact
          ? "flex flex-wrap items-center justify-center gap-4"
          : "grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5"
      }
    >
      {SPONSORS.map((sponsor) => (
        <li key={sponsor.name} className={compact ? undefined : "w-full"}>
          <SponsorLogo sponsor={sponsor} compact={compact} />
        </li>
      ))}
    </ul>
  );
}
