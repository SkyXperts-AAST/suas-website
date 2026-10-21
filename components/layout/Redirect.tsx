"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/**
 * Client-side redirect for moved pages. The site is a static export, so there
 * are no server redirects; old URLs (bookmarks, shared links) land here and are
 * forwarded. The meta refresh covers visitors without JS.
 */
export default function Redirect({ to }: { to: string }) {
  const router = useRouter();
  useEffect(() => {
    router.replace(to);
  }, [router, to]);
  return (
    <div className="mx-auto max-w-xl px-6 py-32 text-center">
      <meta httpEquiv="refresh" content={`0; url=${to}`} />
      <p className="text-offwhite/70">
        This page has moved to{" "}
        <Link href={to} className="text-accent underline">
          {to}
        </Link>
        .
      </p>
    </div>
  );
}
