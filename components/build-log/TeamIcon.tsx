import type { SubTeamSlug } from "@/lib/build-log/types";

type TeamIconProps = {
  slug: SubTeamSlug;
  className?: string;
};

export default function TeamIcon({ slug, className = "h-6 w-6" }: TeamIconProps) {
  switch (slug) {
    case "computer-vision":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M2 12c2.5-4 6.5-6 10-6s7.5 2 10 6c-2.5 4-6.5 6-10 6s-7.5-2-10-6Z" />
          <circle cx="12" cy="12" r="2.75" />
          <path d="M12 5V3M12 21v-2M5 12H3M21 12h-2" />
        </svg>
      );
    case "control":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
          <path d="m5 5 2.5 2.5M16.5 16.5 19 19M5 19l2.5-2.5M16.5 7.5 19 5" />
        </svg>
      );
    case "electrical":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M13 2 4 14h7l-1 8 10-14h-7l0-6Z" />
        </svg>
      );
    case "mechanical":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 8a4 4 0 0 0-4 4 4 4 0 0 0 4 4 4 4 0 0 0 4-4 4 4 0 0 0-4-4Z" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          <circle cx="12" cy="12" r="1.25" fill="currentColor" stroke="none" />
        </svg>
      );
  }
}
