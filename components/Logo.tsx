import Image from "next/image";

const LOGO_ASSETS = {
  small: {
    src: "/small logo.png",
    width: 1795,
    height: 832,
    alt: "SkyXperts",
  },
  big: {
    src: "/Big logo.png",
    width: 8239,
    height: 1040,
    alt: "SkyXperts",
  },
} as const;

type LogoVariant = keyof typeof LOGO_ASSETS;

type LogoProps = {
  variant?: LogoVariant;
  className?: string;
  priority?: boolean;
};

/**
 * SkyXperts brand lockup. Use `small` (S+X mark) in the navbar and compact
 * UI; use `big` (full wordmark) for hero and landing placements.
 */
export default function Logo({
  variant = "small",
  className = "h-12 w-auto",
  priority = false,
}: LogoProps) {
  const asset = LOGO_ASSETS[variant];

  return (
    <Image
      src={asset.src}
      alt={asset.alt}
      width={asset.width}
      height={asset.height}
      className={className}
      priority={priority}
    />
  );
}

export { LOGO_ASSETS };
