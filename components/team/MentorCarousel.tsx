"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import MemberCard from "@/components/team/MemberCard";
import type { TeamMember } from "@/lib/team/members";

type MentorCarouselProps = {
  mentors: TeamMember[];
};

export default function MentorCarousel({ mentors }: MentorCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (mentors.length === 0) {
    return null;
  }

  const showPrevious = () => {
    setActiveIndex((index) => (index - 1 + mentors.length) % mentors.length);
  };
  const showNext = () => {
    setActiveIndex((index) => (index + 1) % mentors.length);
  };

  return (
    <div className="mx-auto flex max-w-md items-center justify-center gap-3 sm:gap-5">
      <button
        type="button"
        onClick={showPrevious}
        aria-label="Previous mentor"
        className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-offwhite transition hover:border-accent/50 hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <ChevronLeft aria-hidden="true" size={20} />
      </button>

      <div className="w-full max-w-[220px]" aria-live="polite">
        <MemberCard member={mentors[activeIndex]} />
      </div>

      <button
        type="button"
        onClick={showNext}
        aria-label="Next mentor"
        className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-offwhite transition hover:border-accent/50 hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <ChevronRight aria-hidden="true" size={20} />
      </button>
      <p className="sr-only" aria-live="polite">
        Mentor {activeIndex + 1} of {mentors.length}: {mentors[activeIndex].name}
      </p>
    </div>
  );
}