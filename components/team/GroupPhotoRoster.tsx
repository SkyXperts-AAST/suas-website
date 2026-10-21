import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";
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

      {members.length > 0 ? (
        <p
          className={`text-base leading-8 text-offwhite/70 md:text-lg md:leading-8 ${
            title ? "mt-3" : ""
          }`}
        >
          {caption}
        </p>
      ) : null}

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
            <div
              role="img"
              aria-label={`${title ?? photoAlt} coming soon`}
              className="relative flex h-full min-h-[240px] flex-col items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_center,rgba(227,28,28,0.14),transparent_55%),linear-gradient(135deg,#0a1628,#05071e)] px-6 text-center md:min-h-[320px]"
            >
              <div className="flex flex-col items-center">
                <span className="flex size-14 items-center justify-center rounded-2xl border border-accent/30 bg-accent/10 text-accent">
                  <ImageIcon aria-hidden="true" size={24} strokeWidth={1.5} />
                </span>
                <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-accent">
                  Team moments ahead
                </p>
                <p className="mt-2 text-lg font-semibold text-offwhite">
                  Group photo coming soon
                </p>
                <p className="mt-2 max-w-xs text-sm leading-6 text-offwhite/55">
                  We&apos;re getting the next team photo ready to share.
                </p>
              </div>
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
