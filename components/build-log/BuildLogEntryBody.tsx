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
    <div className="build-log-prose max-w-[65ch] space-y-5 font-sans">
      {content.map((block, index) => {
        if (block.type === "paragraph") {
          return (
            <p
              key={`paragraph-${index}`}
              className="text-base font-normal leading-[1.75] text-offwhite/92 md:text-[1.0625rem] md:leading-[1.8]"
            >
              {block.text}
            </p>
          );
        }

        if (block.type === "list") {
          return (
            <div key={`list-${index}`} className="space-y-2.5">
              {block.heading ? (
                <p className="text-xs font-black uppercase tracking-[0.14em] text-offwhite/50">
                  {block.heading}
                </p>
              ) : null}
              <ul className="space-y-2">
                {block.items.map((item, itemIndex) => (
                  <li
                    key={`list-${index}-item-${itemIndex}`}
                    className="flex gap-2.5 text-base font-normal leading-[1.7] text-offwhite/92 md:text-[1.0625rem]"
                  >
                    <span className="mt-[0.65em] h-1 w-1 shrink-0 rounded-full bg-offwhite/50" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        }

        return (
          <figure
            key={`image-${index}`}
            className="my-3 max-w-[16rem] sm:max-w-[18rem]"
          >
            <div className="relative aspect-[4/3] max-h-32 w-full overflow-hidden rounded-sm border border-white/10 bg-white/[0.02] sm:max-h-36">
              <Image
                src={block.src}
                alt={block.alt}
                fill
                sizes="(max-width: 640px) 256px, 288px"
                className="object-cover"
              />
            </div>
            {block.caption ? (
              <figcaption className="mt-2 text-xs leading-relaxed text-offwhite/65 md:text-[0.8125rem]">
                {block.caption}
              </figcaption>
            ) : null}
          </figure>
        );
      })}
    </div>
  );
}
