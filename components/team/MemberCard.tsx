import Image from "next/image";
import type { TeamMember } from "@/lib/team/members";

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

type MemberCardProps = {
  member: TeamMember;
};

export default function MemberCard({ member }: MemberCardProps) {
  const initials = getInitials(member.name);
  const supervisor = Boolean(member.isSupervisor);

  return (
    <article
      className={`relative mx-auto flex w-full max-w-[220px] flex-col overflow-hidden rounded-2xl border transition hover:-translate-y-0.5 ${
        supervisor
          ? "border-accent/35 bg-accent/[0.06] hover:border-accent/50"
          : "border-white/10 bg-white/[0.03] hover:border-white/20"
      }`}
    >
      {supervisor ? (
        <span className="absolute left-2 top-2 z-10 rounded-full border border-accent/30 bg-[#0a1628]/80 px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-[0.14em] text-accent backdrop-blur-sm">
          Faculty
        </span>
      ) : null}

      <div
        className={`relative aspect-square w-full ${
          member.photo
            ? "bg-navy"
            : supervisor
              ? "bg-accent/10"
              : "bg-white/[0.06]"
        }`}
      >
        {member.photo ? (
          <Image
            src={member.photo}
            alt={member.name}
            fill
            className="object-cover object-top"
            sizes="220px"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span
              aria-hidden="true"
              className={`font-display text-3xl font-bold tracking-wide ${
                supervisor ? "text-accent" : "text-offwhite/70"
              }`}
            >
              {initials || "?"}
            </span>
          </div>
        )}
      </div>

      <div className="px-2.5 py-2.5 text-center">
        <h3 className="text-sm font-semibold leading-snug text-offwhite">
          {member.name}
        </h3>
        <p className="mt-1 text-xs leading-5 text-offwhite/60">{member.role}</p>
      </div>
    </article>
  );
}
