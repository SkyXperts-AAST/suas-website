"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Fades its children up once they scroll into view. The hidden state is added
 * from an effect, so server HTML is always visible and nothing stays hidden if
 * JS fails. `delay` staggers siblings (ms).
 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article";
}) {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<"idle" | "armed" | "in">("idle");

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (node.getBoundingClientRect().top < window.innerHeight * 0.9) return;

    const arm = requestAnimationFrame(() => setState("armed"));
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setState("in");
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(node);
    return () => {
      cancelAnimationFrame(arm);
      observer.disconnect();
    };
  }, []);

  const stateClass =
    state === "armed" ? "reveal-armed" : state === "in" ? "reveal-in" : "";

  return (
    <Tag
      ref={ref as never}
      className={`${stateClass} ${className}`.trim()}
      style={state === "in" && delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
