"use client";

import { useState, type FormEvent } from "react";
import {
  CONTACT_REASONS,
  TEAM_EMAIL,
  type ContactReason,
} from "@/lib/contact/contacts";

type FormState = {
  name: string;
  email: string;
  reason: ContactReason;
  message: string;
};

type SubmitStatus = "idle" | "loading" | "success" | "error";

const INITIAL_STATE: FormState = {
  name: "",
  email: "",
  reason: "general",
  message: "",
};

const CONTACT_ENDPOINT = "https://contact-api.skyxperts.com/";

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage(null);

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = (await response.json().catch(() => null)) as
        | { success?: boolean; error?: string }
        | null;

      if (!response.ok || !data?.success) {
        throw new Error(data?.error ?? "Something went wrong. Please try again.");
      }

      setStatus("success");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong. Please try again.",
      );
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-3xl border border-white/15 bg-[#07101f]/80 p-10 text-center shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-sm md:p-14">
        <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-accent">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <path d="M22 4 12 14.01l-3-3" />
          </svg>
        </span>
        <h2 className="mt-4 text-3xl leading-[1.02] text-offwhite md:text-4xl">
          Message sent
        </h2>
        <p className="mt-3 text-base leading-8 text-offwhite/70">
          Thanks for reaching out — we&apos;ll get back to you soon. If it&apos;s
          urgent, you can also reach us directly at{" "}
          <a
            href={`mailto:${TEAM_EMAIL}`}
            className="font-semibold text-accent hover:underline"
          >
            {TEAM_EMAIL}
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setForm(INITIAL_STATE);
          }}
          className="mt-6 rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-offwhite transition hover:border-white/35 hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-white/15 bg-[#07101f]/80 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-sm md:p-12"
    >
      <div className="text-center">
        <h2 className="text-3xl leading-[1.02] text-offwhite md:text-4xl">
          Send us a message
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-offwhite/70">
          Tell us what&apos;s on your mind — we&apos;ll reply from there.
        </p>
      </div>

      <div className="mt-10 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Full name" htmlFor="contact-name">
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              autoComplete="name"
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
              }
              className={inputClassName}
              placeholder="Your name"
            />
          </Field>

          <Field label="Email address" htmlFor="contact-email">
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={(event) =>
                setForm((current) => ({ ...current, email: event.target.value }))
              }
              className={inputClassName}
              placeholder="you@example.com"
            />
          </Field>
        </div>

        <Field label="Reason for contact" htmlFor="contact-reason">
          <select
            id="contact-reason"
            name="reason"
            required
            value={form.reason}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                reason: event.target.value as ContactReason,
              }))
            }
            className={inputClassName}
          >
            {CONTACT_REASONS.map((reason) => (
              <option key={reason.value} value={reason.value}>
                {reason.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Message" htmlFor="contact-message">
          <textarea
            id="contact-message"
            name="message"
            required
            rows={6}
            value={form.message}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                message: event.target.value,
              }))
            }
            className={`${inputClassName} min-h-[10rem] resize-y`}
            placeholder="Share details about your request..."
          />
        </Field>
      </div>

      {status === "error" && (
        <p
          role="alert"
          className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-sm font-medium text-red-400"
        >
          {errorMessage}
        </p>
      )}

      <div className="mt-8 flex justify-center">
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-10 py-4 text-base font-semibold text-white shadow-lg shadow-accent/20 transition hover:bg-[#c81616] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#07101f] disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
        >
          {status === "loading" && (
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          )}
          {status === "loading" ? "Sending..." : "Submit request"}
        </button>
      </div>
    </form>
  );
}

const inputClassName =
  "mt-2 w-full rounded-xl border border-white/15 bg-[#0a1628]/80 px-4 py-3.5 text-base text-offwhite placeholder:text-offwhite/35 outline-none transition focus:border-accent/50 focus:ring-2 focus:ring-accent/20";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="text-sm font-semibold text-offwhite/85">{label}</span>
      {children}
    </label>
  );
}
