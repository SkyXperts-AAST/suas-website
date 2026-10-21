import Image from "next/image";
import type { Photo } from "@/lib/content/types";

/** Simple masonry of photos; keeps each photo's own aspect ratio. */
export default function PhotoGrid({ photos }: { photos: Photo[] }) {
  if (!photos.length) return null;
  return (
    <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>li]:mb-4">
      {photos.map((p) => (
        <li key={p.src} className="break-inside-avoid overflow-hidden rounded-md border border-white/10">
          <Image
            src={p.src}
            alt={p.alt}
            width={1200}
            height={900}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="h-auto w-full"
          />
        </li>
      ))}
    </ul>
  );
}
