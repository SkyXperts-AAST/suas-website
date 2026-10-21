import type { Metadata } from "next";
import { Suspense } from "react";
import JournalBrowser from "@/components/journal/JournalBrowser";
import { PageHero, PageShell } from "@/components/layout/PageShell";
import { getPosts, toSummary } from "@/lib/content";

export const metadata: Metadata = {
  title: "Journal | SkyXperts",
  description:
    "Build logs, stories and competition recaps from every SkyXperts sub-team, season by season.",
};

export default function JournalPage() {
  const posts = getPosts().map(toSummary);
  return (
    <PageShell>
      <PageHero
        label="Journal"
        title={
          <>
            Notes from the bench,
            <br />
            <span className="text-accent">the field and the road.</span>
          </>
        }
        description="Build logs from every sub-team, stories from competitions, and what we learned along the way. Written by the people who did the work."
      />
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <Suspense fallback={null}>
          <JournalBrowser posts={posts} />
        </Suspense>
      </div>
    </PageShell>
  );
}
