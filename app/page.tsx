import type { Metadata } from "next";
import Logo from "@/components/Logo";
import { PageShell } from "@/components/layout/PageShell";

export const metadata: Metadata = {
  title: "SkyXperts",
  description: "SkyXperts SUAS — autonomous flight systems built in-house.",
};

export default function Home() {
  return (
    <PageShell>
      <section className="relative flex min-h-[calc(100vh-72px-5.5rem)] flex-col items-center justify-center px-6 py-20 text-center">
        <Logo
          variant="big"
          className="h-16 w-auto max-w-[min(90vw,36rem)] object-contain sm:h-20 md:h-24"
          priority
        />
        <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-accent">
          SUAS · USA
        </p>
        <h1 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight text-offwhite md:text-5xl">
          Engineering autonomous flight,
          <span className="block text-offwhite/85">one subsystem at a time.</span>
        </h1>
        <p className="mt-5 max-w-lg text-base leading-8 text-offwhite/70 md:text-lg">
          Homepage coming soon. Explore our vehicle, build log, and gallery in
          the meantime.
        </p>
      </section>
    </PageShell>
  );
}
