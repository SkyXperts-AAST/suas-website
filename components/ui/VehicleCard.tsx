import Image from "next/image";
import Link from "next/link";
import {
  FLEET_KIND_LABEL,
  FLEET_STATUS_LABEL,
  type Vehicle,
} from "@/lib/content/types";

const STATUS_DOT: Record<Vehicle["status"], string> = {
  active: "bg-emerald-400",
  development: "bg-amber-400",
  retired: "bg-offwhite/40",
};

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const keySpecs = vehicle.specs.slice(1, 4);
  return (
    <article className="panel panel-hover group flex h-full flex-col overflow-hidden">
      <div className="bg-grid relative flex aspect-[16/10] items-center justify-center overflow-hidden border-b border-white/10">
        {vehicle.image ? (
          <Image
            src={vehicle.image}
            alt={vehicle.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain p-8 transition duration-700 group-hover:scale-[1.04]"
          />
        ) : vehicle.photo ? (
          <Image
            src={vehicle.photo}
            alt={vehicle.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <span className="px-6 text-center font-display text-4xl text-offwhite/10">{vehicle.name}</span>
        )}
        <span className="chip absolute left-4 top-4 bg-navy/70">
          <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[vehicle.status]}`} aria-hidden="true" />
          {FLEET_STATUS_LABEL[vehicle.status]}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-offwhite/50">
          {FLEET_KIND_LABEL[vehicle.kind]} · {vehicle.seasons.join(", ")}
        </p>
        <h3 className="mt-2 text-3xl text-offwhite">
          <Link href={`/fleet/${vehicle.slug}`} className="after:absolute after:inset-0 focus:outline-none">
            {vehicle.name}
          </Link>
        </h3>
        {vehicle.nameTBA ? (
          <p className="mt-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-offwhite/40">Name to be announced</p>
        ) : null}
        <p className="mt-1 text-sm text-offwhite/60">{vehicle.tagline}</p>
        {keySpecs.length ? (
          <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-white/10 pt-4">
            {keySpecs.map((spec) => (
              <div key={spec.label}>
                <dt className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-offwhite/45">{spec.label}</dt>
                <dd className="mt-1 font-mono text-sm text-offwhite">{spec.value}</dd>
              </div>
            ))}
          </dl>
        ) : vehicle.achievements.length ? (
          <ul className="mt-5 space-y-1 border-t border-white/10 pt-4 text-sm text-offwhite/70">
            {vehicle.achievements.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}
