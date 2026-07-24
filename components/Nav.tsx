"use client";

import { useEffect, useState } from "react";
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

/**
 * The sliding indicator under a desktop nav link. Active and hover are given
 * deliberately different weights — 2px Accent Red versus a 1px translucent
 * off-white — so that hovering an inactive link never looks like it selected
 * the page. Both animate from the left edge rather than fading in place.
 */
function LinkIndicator({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-3 bottom-1 origin-left rounded-full transition-[transform,opacity] duration-200 ease-out ${
        active
          ? "h-0.5 scale-x-100 bg-accent opacity-100"
          : "h-px scale-x-0 bg-offwhite opacity-0 group-hover:scale-x-100 group-hover:opacity-45"
      }`}
    />
  );
}

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`nav-glass sticky top-0 z-50 overflow-x-clip border-b transition-[background-color,box-shadow,border-color] duration-300 ${
        scrolled ? "nav-glass-scrolled" : ""
      }`}
    >
      <nav className="mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between px-5 sm:px-6">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex h-10 w-[5.25rem] shrink-0 items-center rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/80 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent sm:h-11 sm:w-[5.75rem]"
          aria-label="SkyXperts home"
        >
          <Logo
            variant="small"
            className="size-full object-contain object-left"
            priority
          />
        </Link>

        {/* Hairline divider separating the brand mark from navigation. */}
        <div
          aria-hidden="true"
          className="ml-5 mr-auto hidden h-6 w-px bg-white/15 md:block"
        />

        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`group relative block px-3.5 pt-2 pb-3 text-sm font-medium tracking-[0.04em] transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 ${
                    active
                      ? "text-accent"
                      : "text-offwhite/75 hover:text-white"
                  }`}
                >
                  {link.label}
                  <LinkIndicator active={active} />
                </Link>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/14 bg-white/8 text-offwhite transition-all hover:border-white/22 hover:bg-white/12 hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 md:hidden"
        >
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
            {open ? (
              <path d="M18 6 6 18M6 6l12 12" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </nav>

      {open ? (
        <>
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 top-[72px] z-40 bg-[#05071e]/45 backdrop-blur-sm md:hidden"
            onClick={() => setOpen(false)}
          />
          <div
            id="mobile-menu"
            className="nav-glass absolute inset-x-3 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-2xl border shadow-2xl shadow-black/35 md:hidden"
          >
            <ul className="flex flex-col p-2">
              {LINKS.map((link) => {
                const active = isActive(pathname, link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      // A stacked menu has no room for an underline, so the
                      // active state becomes a left accent bar — same 2px red
                      // marker, rotated to suit the layout.
                      className={`block rounded-xl border-l-2 px-4 py-3 text-sm font-medium tracking-[0.04em] transition-colors duration-200 ${
                        active
                          ? "border-accent bg-white/10 text-accent"
                          : "border-transparent text-offwhite/75 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      ) : null}
    </header>
  );
}
