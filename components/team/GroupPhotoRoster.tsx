import Image from "next/image";
import type { TeamMember } from "@/lib/team/members";

type GroupPhotoRosterProps = {
  members: TeamMember[];
  groupPhoto?: string;
  blurb: string;
  title?: string;
  photoAlt?: string;
};

export default function GroupPhotoRoster({
  members,
  groupPhoto,
  blurb,
  title,
  photoAlt = "Team group photo",
}: GroupPhotoRosterProps) {
  const caption = `Picture left to right: ${members.map((m) => m.name).join(", ")}.`;

  return (
    <div>
      {title ? (
        <h3 className="font-display text-base font-bold uppercase tracking-[0.16em] text-accent md:text-lg">
          {title}
        </h3>
      ) : null}

      <p
        className={`text-base leading-8 text-offwhite/70 md:text-lg md:leading-8 ${
          title ? "mt-3" : ""
        }`}
      >
        {caption}
      </p>

      <div className="mt-5 grid grid-cols-1 items-start gap-6 md:grid-cols-2 md:gap-8">
        <div className="relative min-h-[240px] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] md:min-h-[320px]">
          {groupPhoto ? (
            <Image
              src={groupPhoto}
              alt={photoAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full min-h-[240px] items-center justify-center md:min-h-[320px]">
              <p className="text-sm font-medium uppercase tracking-[0.14em] text-offwhite/40">
                Group photo coming soon
              </p>
            </div>
          )}
        </div>

        <p className="text-base leading-8 text-offwhite/70 md:text-lg md:leading-8">
          {blurb}
        </p>
      </div>
    </div>
  );
}
