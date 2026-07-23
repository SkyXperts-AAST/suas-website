import type { Metadata } from "next";
import ContactDirectory from "@/components/contact/ContactDirectory";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact | SkyXperts",
  description:
    "Reach the SkyXperts SUAS team — sub-team leads, shared inbox, and request form.",
};

export default function ContactPage() {
  return (
    <div className="relative overflow-hidden bg-navy text-offwhite">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_top,rgba(227,28,28,0.18),transparent_55%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-32 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-48 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl"
      />

      <section className="relative border-b border-white/10">
        <div className="mx-auto w-full max-w-6xl px-6 py-14 md:py-20">
          <p className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-[#0a1628]/70 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-accent backdrop-blur-sm">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
            Contact
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">
            Get in touch with
            <span className="block text-offwhite/85">the SkyXperts team.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-offwhite/75 md:text-lg">
            Reach sub-team leads directly, write to our shared inbox, or send a
            structured request with your reason for contacting us.
          </p>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-6xl px-6 py-10 md:py-16">
        <div className="mx-auto w-full max-w-4xl">
          <ContactForm />
        </div>

        <div className="mx-auto mt-16 w-full max-w-6xl border-t border-white/10 pt-14 md:mt-20 md:pt-16">
          <ContactDirectory />
        </div>
      </section>
    </div>
  );
}
