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
      className={`nav-glass sticky top-0 z-50 overflow-x-clip border-b border-white/[0.06] transition-[background-color,box-shadow,border-color] duration-300 ${
        scrolled ? "nav-glass-scrolled" : ""
      }`}
    >
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-10">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex h-9 w-[5rem] shrink-0 items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/80 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent sm:h-10 sm:w-[5.5rem]"
          aria-label="SkyXperts home"
        >
          <Logo
            variant="small"
            className="size-full object-contain object-left"
            priority
          />
        </Link>

        <ul className="hidden items-center gap-8 lg:gap-10 md:flex">
          {LINKS.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`text-sm font-bold tracking-[0.01em] transition-colors duration-200 focus:outline-none focus-visible:text-accent ${
                    active
                      ? "text-accent"
                      : "text-white/75 hover:text-white"
                  }`}
                >
                  {link.label}
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
          className="inline-flex h-9 w-9 items-center justify-center text-white/80 transition-colors hover:text-white focus:outline-none focus-visible:text-accent md:hidden"
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
            className="fixed inset-0 top-16 z-40 bg-[#05071e]/50 backdrop-blur-sm md:hidden"
            onClick={() => setOpen(false)}
          />
          <div
            id="mobile-menu"
            className="nav-glass absolute inset-x-4 top-[calc(100%+0.375rem)] z-50 overflow-hidden border border-white/10 shadow-2xl shadow-black/40 md:hidden"
          >
            <ul className="flex flex-col py-1">
              {LINKS.map((link) => {
                const active = isActive(pathname, link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`block px-5 py-3.5 text-sm font-bold transition-colors duration-200 focus:outline-none focus-visible:text-accent ${
                        active
                          ? "text-accent"
                          : "text-white/70 hover:text-white"
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
