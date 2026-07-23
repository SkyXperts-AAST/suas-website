"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";

const LINKS = [
  { href: "/team", label: "Team" },
  { href: "/vehicles", label: "Vehicles" },
  { href: "/gallery", label: "Gallery" },
  { href: "/build-log", label: "Build Log" },
  { href: "/sponsorships", label: "Sponsorships" },
  { href: "/contact", label: "Contact" },
] as const;

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-50 bg-navy">
      <nav className="mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between px-6">
        {/* Brand — links home */}
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
          aria-label="SkyXperts home"
        >
          <Logo />
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-7 md:flex lg:gap-9">
          {LINKS.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative text-[0.8125rem] font-semibold uppercase tracking-[0.12em] transition-colors after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:rounded-full after:bg-accent after:transition-all after:duration-300 focus:outline-none focus-visible:text-accent ${
                    active
                      ? "text-accent after:w-full"
                      : "text-offwhite/80 after:w-0 hover:text-offwhite hover:after:w-full"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-offwhite transition-colors hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent md:hidden"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {open ? (
              <path d="M18 6 6 18M6 6l12 12" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu — overlays content so it never affects layout height */}
      {open && (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-full border-t border-white/10 bg-navy shadow-lg md:hidden"
        >
          <ul className="flex flex-col px-6 py-2">
            {LINKS.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`block border-b border-white/5 py-3 text-sm font-semibold uppercase tracking-[0.12em] transition-colors last:border-b-0 ${
                      active
                        ? "text-accent"
                        : "text-offwhite/80 hover:text-accent"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}
