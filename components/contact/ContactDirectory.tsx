import { TEAM_EMAIL } from "@/lib/contact/contacts";

export default function ContactDirectory() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-offwhite/50">
          Direct contact
        </p>
        <h2 className="mt-2 text-2xl leading-[1.05] text-offwhite md:text-3xl">
          Reach the team directly
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-offwhite/70 md:text-base">
          For general questions, sponsorships, or sub-team topics, use the inbox
          or contact a lead below.
        </p>
        <a
          href={`mailto:${TEAM_EMAIL}`}
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-5 py-2.5 text-sm font-semibold text-accent transition hover:border-accent/50 hover:bg-accent/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#07101f]"
        >
          <MailIcon />
          {TEAM_EMAIL}
        </a>
      </div>
    </div>
  );
}

function MailIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}
