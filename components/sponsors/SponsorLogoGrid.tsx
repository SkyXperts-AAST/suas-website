import SponsorLogo from "@/components/sponsors/SponsorLogo";
import type { Sponsor } from "@/lib/content/types";

export default function SponsorLogoGrid({ sponsors }: { sponsors: Sponsor[] }) {
  return (
    <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
      {sponsors.map((sponsor) => (
        <li key={sponsor.id} className="w-full">
          <SponsorLogo sponsor={sponsor} />
        </li>
      ))}
    </ul>
  );
}
