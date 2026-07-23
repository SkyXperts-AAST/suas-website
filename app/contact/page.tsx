import type { Metadata } from "next";
import ContactDirectory from "@/components/contact/ContactDirectory";
import ContactForm from "@/components/contact/ContactForm";
import { PageHero, PageSection, PageShell } from "@/components/layout/PageShell";

export const metadata: Metadata = {
  title: "Contact | SkyXperts",
  description:
    "Reach the SkyXperts SUAS team — sub-team leads, shared inbox, and request form.",
};

export default function ContactPage() {
  return (
    <PageShell>
      <PageHero
        label="Contact"
        title={
          <>
            Get in touch with
            <span className="block text-offwhite/85">the SkyXperts team.</span>
          </>
        }
        description="Reach sub-team leads directly, write to our shared inbox, or send a structured request with your reason for contacting us."
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
