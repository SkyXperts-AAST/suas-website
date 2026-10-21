import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Avatar } from "@/components/ui/PersonCard";
import { getPost, getPosts, getSeason } from "@/lib/content";
import { POST_TYPE_LABEL, formatDate } from "@/lib/content/types";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return { title: "Journal | SkyXperts" };
  return {
    title: `${post.title} | SkyXperts Journal`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: post.date,
      images: post.cover ? [post.cover] : undefined,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  // Older/newer neighbours within the same sub-team (or type), so a build log
  // reads as a series.
  const series = getPosts().filter((p) =>
    post.team ? p.team === post.team : p.type === post.type,
  );
  const index = series.findIndex((p) => p.slug === post.slug);
  const newer = index > 0 ? series[index - 1] : undefined;
  const older = index < series.length - 1 ? series[index + 1] : undefined;
  const season = getSeason(post.season);

  return (
    <article className="bg-navy">
      <header className="border-b border-white/10">
        <div className="mx-auto max-w-3xl px-6 pb-12 pt-12 md:pt-16">
          <Link
            href={post.team ? `/journal?team=${post.team}` : "/journal"}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-offwhite/55 transition hover:text-accent"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            {post.teamName ? `${post.teamName} journal` : "Journal"}
          </Link>
          <p className="mt-8 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs uppercase tracking-[0.16em] text-offwhite/50">
            <span className="text-accent">{POST_TYPE_LABEL[post.type]}</span>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            {season ? (
              <Link href={`/legacy/${season.id}`} className="hover:text-accent">
                {season.label} season
              </Link>
            ) : null}
            <span>{post.readingMinutes} min read</span>
          </p>
          <h1 className="mt-4 text-4xl text-offwhite md:text-6xl">{post.title}</h1>
          {post.summary ? (
            <p className="mt-5 text-lg leading-relaxed text-offwhite/70 md:text-xl">{post.summary}</p>
          ) : null}
          {post.authors.length ? (
            <ul className="mt-8 flex flex-wrap gap-4">
              {post.authors.map((a) => (
                <li key={a.id} className="flex items-center gap-2 text-sm text-offwhite/80">
                  <Avatar person={a} size={32} />
                  {a.name}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </header>

      {post.cover ? (
        <div className="mx-auto mt-10 max-w-4xl px-6">
          <div className="relative aspect-[16/9] overflow-hidden rounded-md border border-white/10">
            <Image src={post.cover} alt={post.coverAlt ?? ""} fill priority sizes="(max-width: 896px) 100vw, 896px" className="object-cover" />
          </div>
        </div>
      ) : null}

      <div
        className="prose-journal mx-auto max-w-3xl px-6 py-12 md:py-16"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />

      {post.tags.length ? (
        <div className="mx-auto flex max-w-3xl flex-wrap gap-2 px-6 pb-12">
          {post.tags.map((t) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
        </div>
      ) : null}

      <nav aria-label="More entries" className="border-t border-white/10">
        <div className="mx-auto grid max-w-3xl gap-px px-6 py-10 sm:grid-cols-2">
          {older ? (
            <Link href={`/journal/${older.slug}`} className="group py-3 pr-4">
              <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-offwhite/45">
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Previous
              </span>
              <span className="mt-2 block font-display text-lg text-offwhite group-hover:text-accent">{older.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {newer ? (
            <Link href={`/journal/${newer.slug}`} className="group py-3 pl-4 text-right">
              <span className="flex items-center justify-end gap-2 font-mono text-xs uppercase tracking-[0.16em] text-offwhite/45">
                Next <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <span className="mt-2 block font-display text-lg text-offwhite group-hover:text-accent">{newer.title}</span>
            </Link>
          ) : null}
        </div>
      </nav>
    </article>
  );
}
