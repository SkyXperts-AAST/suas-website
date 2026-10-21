import Image from "next/image";
import type { Person } from "@/lib/content/types";

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function Avatar({
  person,
  size = 40,
}: {
  person: Person;
  size?: number;
}) {
  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-sm border border-white/10 bg-white/[0.06]"
      style={{ width: size, height: size }}
    >
      {person.photo ? (
        <Image src={person.photo} alt="" fill sizes={`${size}px`} className="object-cover object-top" />
      ) : (
        <span aria-hidden="true" className="font-display text-sm font-semibold text-offwhite/70">
          {initials(person.name)}
        </span>
      )}
    </span>
  );
}

/** Portrait card for mentors and leadership. */
export default function PersonCard({
  person,
  role,
  muted = false,
}: {
  person: Person;
  role?: string;
  muted?: boolean;
}) {
  return (
    <article className="panel panel-hover group overflow-hidden">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-white/[0.04]">
        {person.photo ? (
          <Image
            src={person.photo}
            alt={person.name}
            fill
            sizes="(max-width: 640px) 50vw, 220px"
            className={`object-cover object-top transition duration-500 group-hover:scale-[1.03] ${
              muted ? "grayscale" : ""
            }`}
          />
        ) : (
          <div className="bg-grid flex h-full items-center justify-center">
            <span aria-hidden="true" className="font-display text-4xl font-semibold text-offwhite/50">
              {initials(person.name)}
            </span>
          </div>
        )}
      </div>
      <div className="border-t border-white/10 px-3 py-3">
        <h3 className="font-sans text-sm font-semibold leading-snug text-offwhite">
          {person.linkedin ? (
            <a href={person.linkedin} target="_blank" rel="noreferrer" className="hover:text-accent">
              {person.name}
            </a>
          ) : (
            person.name
          )}
        </h3>
        {role ? (
          <p className="mt-1 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-offwhite/50">
            {role}
          </p>
        ) : null}
      </div>
    </article>
  );
}
