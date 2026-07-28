import { TEAM_EMAIL, TEAM_LEADS } from "@/lib/contact/contacts";

function MailIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 opacity-70"
      aria-hidden="true"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function EmailLink({ address }: { address: string }) {
  return (
    <a
      href={`mailto:${address}`}
      className="group inline-flex items-center gap-2 text-sm text-accent transition-colors focus:outline-none md:text-base"
    >
      <MailIcon />
      <span className="group-hover:underline group-focus-visible:underline">
        {address}
      </span>
    </a>
  );
}

export default function ContactDirectory() {
  return (
    <div>
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-offwhite/50">
          Direct contact
        </p>
        <h2 className="mt-2 text-2xl leading-[1.05] text-offwhite md:text-3xl">
          Reach the team directly
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-offwhite/70 md:text-base">
          Have a question, want to sponsor us, or just want to say hi? Reach out
          below or email a lead directly.
        </p>
      </div>

      <dl className="mx-auto mt-12 max-w-2xl divide-y divide-white/10 border-y border-white/10">
        {TEAM_LEADS.map((lead) => (
          <div
            key={lead.email}
            className="py-7 md:flex md:items-baseline md:justify-between md:gap-8"
          >
            <dt className="leading-tight">
              <span className="block font-semibold text-offwhite">
                {lead.name}
              </span>
              <span className="mt-1 block text-sm text-offwhite/55">
                {lead.role}
              </span>
            </dt>
            <dd className="mt-2.5 md:mt-0 md:text-right">
              <EmailLink address={lead.email} />
            </dd>
          </div>
        ))}
      </dl>

      <dl className="mx-auto mt-7 max-w-2xl md:flex md:items-baseline md:justify-between md:gap-8">
        <dt className="text-xs font-bold uppercase tracking-[0.18em] text-offwhite/40">
          Team email
        </dt>
        <dd className="mt-2 md:mt-0 md:text-right">
          <EmailLink address={TEAM_EMAIL} />
        </dd>
      </dl>
    </div>
  );
}
