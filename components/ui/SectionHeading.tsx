import type { ReactNode } from "react";

/**
 * Section opener: mono eyebrow, display title, optional intro. `accent` is
 * rendered in red after the title, for the one word that carries the section.
 */
export default function SectionHeading({
  eyebrow,
  title,
  accent,
  intro,
  align = "center",
  className = "",
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  accent?: string;
  intro?: ReactNode;
  align?: "center" | "left";
  className?: string;
  as?: "h1" | "h2";
}) {
  const centered = align === "center";
  return (
    <div className={`${centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"} ${className}`.trim()}>
      {eyebrow ? (
        <p className={centered ? "eyebrow-center" : "eyebrow"}>{eyebrow}</p>
      ) : null}
      <Tag
        className={`${eyebrow ? "mt-4" : ""} text-balance ${
          Tag === "h1" ? "text-5xl md:text-7xl" : "text-4xl md:text-5xl"
        } text-offwhite`}
      >
        {title}
        {accent ? <span className="text-accent"> {accent}</span> : null}
      </Tag>
      {intro ? (
        <p
          className={`mt-5 text-pretty text-base leading-relaxed text-offwhite/70 md:text-lg ${
            centered ? "mx-auto max-w-2xl" : "max-w-2xl"
          }`}
        >
          {intro}
        </p>
      ) : null}
    </div>
  );
}
