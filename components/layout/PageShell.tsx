import type { ReactNode } from "react";

type PageShellProps = {
  children: ReactNode;
  className?: string;
};

export function PageShell({ children, className = "" }: PageShellProps) {
  return (
    <div
      className={`relative overflow-x-clip bg-navy text-offwhite ${className}`.trim()}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_top,rgba(227,28,28,0.18),transparent_55%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-32 h-72 w-72 -translate-x-1/3 rounded-full bg-sky-500/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-48 h-72 w-72 translate-x-1/3 rounded-full bg-violet-500/10 blur-3xl"
      />
      {children}
    </div>
  );
}

export function PageBadge({ label }: { label: string }) {
  return (
    <p className="font-display inline-flex items-center gap-2 rounded-full border border-accent/30 bg-[#0a1628]/70 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-accent backdrop-blur-sm">
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
      {label}
    </p>
  );
}

type PageHeroContentProps = {
  label: string;
  title: ReactNode;
  description?: string;
  children?: ReactNode;
  titleClassName?: string;
};

export function PageHeroContent({
  label,
  title,
  description,
  children,
  titleClassName = "",
}: PageHeroContentProps) {
  return (
    <>
      <PageBadge label={label} />
      <h1
        className={`mt-5 max-w-3xl text-4xl leading-[1.02] md:text-6xl ${titleClassName}`.trim()}
      >
        {title}
      </h1>
      {description ? (
        <p className="mt-5 max-w-2xl text-base leading-8 text-offwhite/75 md:text-lg">
          {description}
        </p>
      ) : null}
      {children}
    </>
  );
}

type PageHeroProps = PageHeroContentProps & {
  bordered?: boolean;
  className?: string;
};

export function PageHero({
  bordered = true,
  className = "",
  ...contentProps
}: PageHeroProps) {
  return (
    <section
      className={`relative ${bordered ? "border-b border-white/10" : ""} ${className}`.trim()}
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-14 md:py-20">
        <PageHeroContent {...contentProps} />
      </div>
    </section>
  );
}

type PageSectionProps = {
  children: ReactNode;
  className?: string;
  narrow?: boolean;
};

export function PageSection({
  children,
  className = "",
  narrow = false,
}: PageSectionProps) {
  return (
    <section
      className={`relative mx-auto w-full px-6 py-10 md:py-16 ${
        narrow ? "max-w-4xl" : "max-w-6xl"
      } ${className}`.trim()}
    >
      {children}
    </section>
  );
}

export function ComingSoonPanel({ message = "Coming soon." }: { message?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-14 text-center backdrop-blur-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-offwhite/45">
        In progress
      </p>
      <p className="mt-3 text-lg text-offwhite/70">{message}</p>
    </div>
  );
}
