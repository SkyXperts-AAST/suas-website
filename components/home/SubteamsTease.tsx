import Image from "next/image";
import Link from "next/link";
import { softwareGroups, subteams } from "@/lib/team/members";

const CARDS = [
  {
    key: "Software",
    photo: softwareGroups.computerVision.groupPhoto,
    blurb: softwareGroups.blurb,
  },
  {
    key: "Mechanical",
    photo: subteams.Mechanical.groupPhoto,
    blurb: subteams.Mechanical.blurb,
  },
  {
    key: "Electrical",
    photo: subteams.Electrical.groupPhoto,
    blurb: subteams.Electrical.blurb,
  },
] as const;

export default function SubteamsTease() {
  return (
    <div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {CARDS.map((card) => (
          <div
            key={card.key}
            className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:border-white/20"
          >
            <div className="relative aspect-[4/3] w-full bg-navy">
              {card.photo ? (
                <Image
                  src={card.photo}
                  alt={`${card.key} sub-team`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              ) : null}
            </div>
            <div className="p-5">
              <h3 className="font-display text-sm font-bold uppercase tracking-[0.14em] text-accent">
                {card.key}
              </h3>
              <p className="mt-2 text-sm leading-6 text-offwhite/65">
                {card.blurb}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Link
        href="/team"
        className="mt-8 inline-flex items-center gap-1 text-sm font-medium text-accent transition hover:text-accent/85"
      >
        See every sub-team
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
