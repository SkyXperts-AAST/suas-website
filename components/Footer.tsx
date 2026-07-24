import Link from "next/link";
import Logo from "@/components/Logo";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-[#0a1628]/90 px-6 py-8 text-center backdrop-blur-sm">
      <Link
        href="/"
        className="mx-auto inline-flex h-9 w-[min(100%,18rem)] items-center rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/80 sm:h-10"
        aria-label="SkyXperts home"
      >
        <Logo variant="big" className="size-full object-contain object-center opacity-90" />
      </Link>
      <p className="mt-4 text-sm text-offwhite/50">© 2026 SkyXperts</p>
    </footer>
  );
}