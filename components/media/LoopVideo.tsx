/**
 * Muted, looping, inline clip with a poster. Plays automatically where the
 * browser allows it; `controls` adds a play bar for clips with sound.
 */
export default function LoopVideo({
  src,
  poster,
  caption,
  controls = false,
  className = "",
  aspect = "aspect-video",
}: {
  src: string;
  poster?: string;
  caption?: string;
  controls?: boolean;
  className?: string;
  aspect?: string;
}) {
  return (
    <figure className={className}>
      <div className={`relative overflow-hidden rounded-md border border-white/10 bg-black ${aspect}`}>
        <video
          src={src}
          poster={poster}
          className="h-full w-full object-cover"
          muted
          loop
          playsInline
          autoPlay={!controls}
          controls={controls}
          preload="metadata"
        />
      </div>
      {caption ? (
        <figcaption className="mt-3 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-offwhite/50">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
