import type { Metadata } from "next";
import SponsorLogoGrid from "@/components/sponsors/SponsorLogoGrid";
import { PageHero, PageSection, PageShell } from "@/components/layout/PageShell";
import { SPONSORSHIP_PROPOSAL_PDF } from "@/lib/sponsors/sponsors";

export const metadata: Metadata = {
  title: "Sponsorships | SkyXperts",
  description: "Partner with SkyXperts SUAS and support our competition program.",
};

export default function SponsorshipsPage() {
  return (
    <PageShell>
      <PageHero
        label="Sponsorships"
        title={
          <>
            Partner with SkyXperts
            <span className="block text-offwhite/85">and fuel the mission.</span>
          </>
        }
        description="Help us design, build, and fly competitive autonomous systems through sponsorship and in-kind support."
      />

      <PageSection>
        <div className="mb-8 md:mb-10">
          <p className="font-display text-sm font-bold uppercase tracking-[0.16em] text-accent md:text-base">
            Partners
          </p>
          <h2 className="mt-3 text-3xl leading-[1.05] text-offwhite md:text-4xl">
            Our Sponsors
          </h2>
        </div>

        <div className="mx-auto max-w-4xl">
          <SponsorLogoGrid />
        </div>
      </PageSection>

      <PageSection className="border-t border-white/10">
        <div className="mb-8 md:mb-10">
          <p className="font-display text-sm font-bold uppercase tracking-[0.16em] text-accent md:text-base">
            Proposal
          </p>
          <h2 className="mt-3 text-3xl leading-[1.05] text-offwhite md:text-4xl">
            Sponsorship Proposal
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-offwhite/70 md:text-lg">
            Open the full proposal in a new tab, or download a copy to share
            with your team.
          </p>
        </div>

        {/* Opens in the browser's own PDF viewer rather than embedding one.
            An <object> embed shipped the whole 15MB file to every visitor and
            doesn't render inline on iOS Safari at all. */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href={SPONSORSHIP_PROPOSAL_PDF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent/85 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
          >
            <ExternalLinkIcon />
            View Proposal
          </a>
          <a
            href={SPONSORSHIP_PROPOSAL_PDF}
            download
            className="inline-flex items-center justify-center gap-2 rounded-full border border-accent/40 bg-accent/15 px-5 py-2.5 text-sm font-semibold text-accent transition hover:border-accent/55 hover:bg-accent/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
          >
            <DownloadIcon />
            Download PDF
          </a>
          <p className="text-sm text-offwhite/50 sm:ml-1">PDF · 10 pages</p>
        </div>
      </PageSection>
    </PageShell>
  );
}

function ExternalLinkIcon() {
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
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

function DownloadIcon() {
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
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  );
}
