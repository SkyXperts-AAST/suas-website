"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import PostCard from "@/components/ui/PostCard";
import { POST_TYPE_LABEL, type PostSummary, type PostType } from "@/lib/content/types";

type Option = { value: string; label: string; count: number };

function options(posts: PostSummary[], key: (p: PostSummary) => string | undefined, label: (v: string) => string): Option[] {
  const counts = new Map<string, number>();
  posts.forEach((p) => {
    const v = key(p);
    if (v) counts.set(v, (counts.get(v) ?? 0) + 1);
  });
  return [...counts.entries()].map(([value, count]) => ({ value, label: label(value), count }));
}

/**
 * Filterable list of every post. Filters live in the URL (?type=&team=&season=)
 * so a filtered view can be linked to, e.g. a sub-team's build log.
 */
export default function JournalBrowser({ posts }: { posts: PostSummary[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const type = params.get("type") ?? "";
  const team = params.get("team") ?? "";
  const season = params.get("season") ?? "";

  const teamNames = useMemo(() => {
    const m = new Map<string, string>();
    posts.forEach((p) => p.team && m.set(p.team, p.teamName ?? p.team));
    return m;
  }, [posts]);

  const groups = [
    { key: "type", label: "Type", value: type, options: options(posts, (p) => p.type, (v) => POST_TYPE_LABEL[v as PostType]) },
    { key: "team", label: "Sub-team", value: team, options: options(posts, (p) => p.team, (v) => teamNames.get(v) ?? v) },
    {
      key: "season",
      label: "Season",
      value: season,
      options: options(posts, (p) => p.season, (v) => v).sort((a, b) => b.value.localeCompare(a.value)),
    },
  ];

  const filtered = posts.filter(
    (p) => (!type || p.type === type) && (!team || p.team === team) && (!season || p.season === season),
  );
  const anyFilter = Boolean(type || team || season);
  const [featured, ...rest] = filtered;

  function set(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return (
    <div>
      <div className="flex flex-col gap-4 border-y border-white/10 py-5">
        {groups.map((g) =>
          g.options.length > 1 ? (
            <div key={g.key} className="flex flex-wrap items-center gap-2">
              <span className="w-20 shrink-0 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-offwhite/45">
                {g.label}
              </span>
              <FilterButton active={!g.value} onClick={() => set(g.key, "")}>
                All
              </FilterButton>
              {g.options.map((o) => (
                <FilterButton key={o.value} active={g.value === o.value} onClick={() => set(g.key, o.value)}>
                  {o.label}
                  <span className="ml-1.5 text-offwhite/40">{o.count}</span>
                </FilterButton>
              ))}
            </div>
          ) : null,
        )}
      </div>

      <p className="mt-6 font-mono text-xs uppercase tracking-[0.16em] text-offwhite/45" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
        {anyFilter ? (
          <button type="button" onClick={() => router.replace(pathname, { scroll: false })} className="ml-4 text-accent hover:underline">
            Clear filters
          </button>
        ) : null}
      </p>

      {featured ? (
        <div className="mt-6">
          <PostCard post={featured} featured />
        </div>
      ) : (
        <p className="mt-10 text-offwhite/60">No entries match these filters yet.</p>
      )}

      {rest.length ? (
        <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <li key={post.slug}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-sm border px-3 py-1.5 text-sm transition ${
        active
          ? "border-accent bg-accent/15 text-offwhite"
          : "border-white/10 text-offwhite/65 hover:border-white/30 hover:text-offwhite"
      }`}
    >
      {children}
    </button>
  );
}
