import TeamIcon from "@/components/build-log/TeamIcon";
import { getTeamTheme } from "@/lib/build-log/themes";
import { TEAM_EMAIL, TEAM_HEADS } from "@/lib/contact/contacts";
import type { SubTeamSlug } from "@/lib/build-log/types";

function ContactLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="text-sm text-offwhite/80 transition-colors hover:text-accent focus:outline-none focus-visible:text-accent"
    >
      {children}
    </a>
  );
}

export default function ContactDirectory() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-offwhite/50">
          Direct contact
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-offwhite md:text-3xl">
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

      <div>
        <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-offwhite/50">
          Sub-team heads
        </p>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2">
          {TEAM_HEADS.map((head) => {
            const theme = getTeamTheme(head.slug as SubTeamSlug);

            return (
              <li
                key={head.slug}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-white/20 hover:bg-white/[0.05]"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/15 ${theme.iconBg} ${theme.iconText}`}
                  >
                    <TeamIcon slug={head.slug} className="h-5 w-5" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-bold uppercase tracking-[0.16em] ${theme.iconText}`}>
                      {theme.label}
                    </p>
                    <p className="mt-1 font-semibold text-offwhite">{head.name}</p>
                    <p className="text-sm text-offwhite/60">{head.role}</p>

                    <div className="mt-3 flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:gap-x-4">
                      <ContactLink href={`tel:${head.phone.replace(/\s/g, "")}`}>
                        {head.phone}
                      </ContactLink>
                      <ContactLink href={`mailto:${head.email}`}>
                        {head.email}
                      </ContactLink>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
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
