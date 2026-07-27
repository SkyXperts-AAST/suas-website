import { TEAM_INBOX, TEAM_LEADS } from "@/lib/contact/contacts";

function EmailLink({ address }: { address: string }) {
  return (
    <a
      href={`mailto:${address}`}
      className="text-sm text-accent transition-colors hover:underline focus:outline-none focus-visible:underline md:text-base"
    >
      {address}
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

      <dl className="mx-auto mt-10 max-w-2xl divide-y divide-white/10 border-y border-white/10">
        {TEAM_LEADS.map((lead) => (
          <div
            key={lead.email}
            className="gap-4 py-5 md:flex md:items-baseline md:justify-between"
          >
            <dt>
              <span className="block font-semibold text-offwhite">
                {lead.name}
              </span>
              <span className="mt-0.5 block text-sm text-offwhite/60">
                {lead.role}
              </span>
            </dt>
            <dd className="mt-2 md:mt-0 md:text-right">
              <EmailLink address={lead.email} />
            </dd>
          </div>
        ))}

        <div className="gap-4 py-5 md:flex md:items-baseline md:justify-between">
          <dt className="font-semibold text-offwhite">Team email</dt>
          <dd className="mt-2 md:mt-0 md:text-right">
            <EmailLink address={TEAM_INBOX} />
          </dd>
        </div>
      </dl>
    </div>
  );
}
