import Image from "next/image";
import type { BuildLogContentBlock } from "@/lib/build-log/types";

type BuildLogEntryBodyProps = {
  blocks?: BuildLogContentBlock[];
  summary: string;
};

export default function BuildLogEntryBody({
  blocks,
  summary,
}: BuildLogEntryBodyProps) {
  const content =
    blocks && blocks.length > 0
      ? blocks
      : [{ type: "paragraph" as const, text: summary }];

  return (
    <div className="build-log-prose space-y-8 font-sans md:space-y-9">
      {content.map((block, index) => {
        if (block.type === "paragraph") {
          return (
            <p
              key={`paragraph-${index}`}
              className="text-[1.0625rem] font-normal leading-[1.85] text-offwhite/90 md:text-lg md:leading-[1.9]"
            >
              {block.text}
            </p>
          );
        }

        if (block.type === "list") {
          return (
            <aside
              key={`list-${index}`}
              className="build-log-prose-aside border border-white/10 bg-white/[0.03] px-5 py-5 md:px-6 md:py-6"
            >
              {block.heading ? (
                <h3 className="font-display text-lg font-bold leading-snug text-offwhite md:text-xl">
                  {block.heading}
                </h3>
              ) : null}
              <ul className={`space-y-3 ${block.heading ? "mt-4" : ""}`}>
                {block.items.map((item, itemIndex) => (
                  <li
                    key={`list-${index}-item-${itemIndex}`}
                    className="flex gap-3 text-base leading-[1.75] text-offwhite/88 md:text-[1.0625rem] md:leading-[1.8]"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </aside>
          );
        }

        return (
          <figure key={`image-${index}`} className="build-log-prose-figure my-2">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-white/10 bg-white/[0.02] md:rounded-xl">
              <Image
                src={block.src}
                alt={block.alt}
                fill
                sizes="(max-width: 768px) 100vw, 672px"
                className="object-cover"
              />
            </div>
            {block.caption ? (
              <figcaption className="mt-3 text-sm leading-relaxed text-offwhite/60 md:text-[0.9375rem]">
                {block.caption}
              </figcaption>
            ) : null}
          </figure>
        );
      })}
    </div>
  );
}
