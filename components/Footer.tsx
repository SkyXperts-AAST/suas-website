import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0a1628] px-6 py-8 text-center text-gray-300">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-4">
        <Link
          href="mailto:SkyXperts@aast.edu"
          className="text-sm text-white/80 transition hover:text-white"
        >
          SkyXperts@aast.edu
        </Link>

        <p className="text-xs text-white/50">© 2026 SkyXperts</p>
      </div>
    </footer>
  );
}