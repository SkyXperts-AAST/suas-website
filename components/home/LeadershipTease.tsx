import Image from "next/image";
import Link from "next/link";
import { leadership } from "@/lib/team/members";

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function LeadershipTease() {
  return (
    <div>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-6 md:gap-x-6">
        {leadership.map((member) => (
          <li key={member.name} className="flex flex-col items-center text-center">
            <div
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 sm:h-24 sm:w-24 ${
                member.isSupervisor
                  ? "border-accent/50"
                  : "border-white/15"
              }`}
            >
              {member.photo ? (
                <Image
                  src={member.photo}
                  alt={member.name}
                  fill
                  className="object-cover object-top"
                  sizes="96px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-white/[0.06]">
                  <span className="font-display text-lg font-bold text-offwhite/70">
                    {getInitials(member.name) || "?"}
                  </span>
                </div>
              )}
            </div>
            <p className="mt-3 text-sm font-semibold leading-snug text-offwhite">
              {member.name}
            </p>
            <p className="mt-0.5 text-xs leading-5 text-offwhite/55">
              {member.role}
            </p>
          </li>
        ))}
      </ul>

      <Link
        href="/team"
        className="mt-8 inline-flex items-center gap-1 text-sm font-medium text-accent transition hover:text-accent/85"
      >
        Meet the full team
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
