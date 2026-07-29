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
          ? "flex flex-wrap items-center justify-center gap-x-10 gap-y-6"
          : "grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
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
