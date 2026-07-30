import type { ReactNode } from "react";

type HomeStoryChapterProps = {
  chapter: string;
  label: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function HomeStoryChapter({
  chapter,
  label,
  title,
  description,
  align = "left",
  className = "",
}: HomeStoryChapterProps) {
  const centered = align === "center";

  return (
    <div
      className={`${centered ? "mx-auto max-w-3xl text-center" : "max-w-xl"} ${className}`.trim()}
    >
      <h2
        className={`font-display text-3xl leading-[1.05] tracking-tight text-accent sm:text-4xl lg:text-5xl ${
          centered ? "text-balance" : ""
        }`}
      >
        {label}
      </h2>
      <p className="mt-3 font-display text-[13px] font-bold uppercase tracking-[0.2em] text-offwhite">
        {title}
      </p>
      {description ? (
        <p
          className={`mt-4 text-sm leading-relaxed text-offwhite/70 sm:text-base sm:leading-[1.75] ${
            centered ? "text-pretty" : "max-w-lg"
          }`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function HomeSectionBridge() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none h-px w-full bg-gradient-to-r from-transparent via-white/12 to-transparent"
    />
  );
}
