import type { Metadata } from "next";
import ContactDirectory from "@/components/contact/ContactDirectory";
import ContactForm from "@/components/contact/ContactForm";
import { PageHero, PageSection, PageShell } from "@/components/layout/PageShell";

export const metadata: Metadata = {
  title: "Contact | SkyXperts",
  description:
    "Reach the SkyXperts SUAS team — email a lead directly or send us a message.",
};

export default function ContactPage() {
  return (
    <PageShell>
      <PageHero
        label="Contact"
        title={
          <>
            Get in touch with
            <span className="block text-offwhite/85">SkyXperts.</span>
          </>
        }
        description="Email us directly or send a message below — we'll get back to you."
      />

      <PageSection narrow>
        <ContactForm />

        <div className="mt-16 border-t border-white/10 pt-14 md:mt-20 md:pt-16">
          <ContactDirectory />
        </div>
      </PageSection>
    </PageShell>
  );
}
