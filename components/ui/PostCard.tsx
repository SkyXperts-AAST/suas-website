import Image from "next/image";
import Link from "next/link";
import { POST_TYPE_LABEL, formatDate, type PostSummary } from "@/lib/content/types";

export default function PostCard({
  post,
  featured = false,
}: {
  post: PostSummary;
  featured?: boolean;
}) {
  return (
    <article className={`panel panel-hover group flex h-full flex-col overflow-hidden ${featured ? "md:flex-row" : ""}`}>
      {post.cover ? (
        <div
          className={`relative overflow-hidden border-white/10 bg-white/[0.03] ${
            featured ? "aspect-[16/10] border-b md:aspect-auto md:w-1/2 md:border-b-0 md:border-r" : "aspect-[16/9] border-b"
          }`}
        >
          <Image
            src={post.cover}
            alt={post.coverAlt ?? ""}
            fill
            sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
            className="object-cover transition duration-700 group-hover:scale-[1.03]"
          />
        </div>
      ) : null}
      <div className={`flex flex-1 flex-col p-5 ${featured ? "md:justify-center md:p-10" : ""} ${featured && !post.cover ? "bg-grid md:py-14" : ""}`}>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-offwhite/50">
          <span className="text-accent">{POST_TYPE_LABEL[post.type]}</span>
          {post.teamName ? <span>{post.teamName}</span> : null}
          <span>{formatDate(post.date, "short")}</span>
        </p>
        <h3 className={`mt-3 text-offwhite ${featured ? "max-w-3xl text-3xl md:text-5xl" : "text-xl"}`}>
          <Link href={`/journal/${post.slug}`} className="after:absolute after:inset-0 focus:outline-none">
            {post.title}
          </Link>
        </h3>
        {post.summary ? (
          <p className={`mt-3 text-sm leading-relaxed text-offwhite/65 ${featured ? "max-w-2xl md:text-lg" : "line-clamp-3"}`}>
            {post.summary}
          </p>
        ) : null}
        <p className="mt-auto pt-5 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-offwhite/40">
          {post.readingMinutes} min read
        </p>
      </div>
    </article>
  );
}
