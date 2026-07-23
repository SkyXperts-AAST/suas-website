import Image from "next/image";

/**
 * SkyXperts brand lockup — the S+X mark with the "SKYXPERTS" wordmark, served
 * from the transparent PNG asset. Height is controlled via `className`
 * (defaults to fitting the navbar); width follows the asset's aspect ratio.
 */
export default function Logo({
  className = "h-12 w-auto",
}: {
  className?: string;
}) {
  return (
    <Image
      src="/skyxperts-logo.png"
      alt="SkyXperts"
      width={788}
      height={470}
      className={className}
      priority
    />
  );
}
