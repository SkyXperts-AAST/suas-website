"use client";

import { useEffect, useState, type ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HiBuildingOffice2,
  HiClipboardDocumentList,
  HiEllipsisHorizontal,
  HiEnvelope,
  HiHome,
  HiPhoto,
  HiRocketLaunch,
  HiUserGroup,
  HiXMark,
} from "react-icons/hi2";
import Logo from "@/components/Logo";

const DESKTOP_LINKS = [
  { href: "/team", label: "Team" },
  { href: "/vehicles", label: "Vehicles" },
  { href: "/gallery", label: "Gallery" },
  { href: "/build-log", label: "Build Log" },
  { href: "/sponsorships", label: "Sponsorships" },
  { href: "/contact", label: "Contact" },
] as const;

const MOBILE_PRIMARY = [
  { href: "/", label: "Home", icon: HiHome, exact: true },
  { href: "/team", label: "Team", icon: HiUserGroup },
  { href: "/vehicles", label: "Vehicles", icon: HiRocketLaunch },
  { href: "/build-log", label: "Log", icon: HiClipboardDocumentList },
] as const;

const MOBILE_MORE = [
  { href: "/gallery", label: "Gallery", icon: HiPhoto },
  { href: "/sponsorships", label: "Sponsorships", icon: HiBuildingOffice2 },
  { href: "/contact", label: "Contact", icon: HiEnvelope },
] as const;

function isActive(pathname: string, href: string, exact = false) {
  if (exact) {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function DesktopNavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`text-sm font-bold tracking-[0.01em] transition-colors duration-200 focus:outline-none focus-visible:text-accent ${
        active ? "text-accent" : "text-white/75 hover:text-white"
      }`}
    >
      {label}
    </Link>
  );
}

function MobilePrimaryLink({
  href,
  label,
  icon: Icon,
  active,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-1 py-2 transition-colors duration-200 focus:outline-none focus-visible:text-accent ${
        active ? "text-accent" : "text-white/55 active:text-white/80"
      }`}
    >
      <Icon aria-hidden className="h-5 w-5 shrink-0" />
      <span className="w-full truncate text-center text-[0.5625rem] font-bold leading-none tracking-[0.02em]">
        {label}
      </span>
    </Link>
  );
}

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const moreActive = MOBILE_MORE.some((link) => isActive(pathname, link.href));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`nav-glass sticky top-0 z-50 hidden overflow-x-clip border-b border-white/[0.06] transition-[background-color,box-shadow,border-color] duration-300 md:block ${
          scrolled ? "nav-glass-scrolled" : ""
        }`}
      >
        <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-8 lg:px-10">
          <Link
            href="/"
            className="flex h-10 w-[5.5rem] shrink-0 items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/80 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            aria-label="SkyXperts home"
          >
            <Logo
              variant="small"
              className="size-full object-contain object-left"
              priority
            />
          </Link>

          <ul className="flex items-center gap-8 lg:gap-10">
            {DESKTOP_LINKS.map((link) => (
              <li key={link.href}>
                <DesktopNavLink
                  href={link.href}
                  label={link.label}
                  active={isActive(pathname, link.href)}
                />
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <header
        className={`nav-glass sticky top-0 z-50 border-b border-white/[0.06] pt-[env(safe-area-inset-top)] transition-[background-color,box-shadow,border-color] duration-300 md:hidden ${
          scrolled ? "nav-glass-scrolled" : ""
        }`}
      >
        <nav
          aria-label="Mobile navigation"
          className="relative mx-auto flex h-14 w-full max-w-lg items-stretch px-1"
        >
          <ul className="flex min-w-0 flex-1 items-stretch">
            {MOBILE_PRIMARY.map((link) => (
              <li key={link.href} className="flex min-w-0 flex-1">
                <MobilePrimaryLink
                  href={link.href}
                  label={link.label}
                  icon={link.icon}
                  active={isActive(
                    pathname,
                    link.href,
                    "exact" in link && link.exact,
                  )}
                  onNavigate={() => setMenuOpen(false)}
                />
              </li>
            ))}

            <li className="flex min-w-0 flex-1">
              <button
                type="button"
                aria-expanded={menuOpen}
                aria-controls="mobile-nav-menu"
                aria-label={menuOpen ? "Close menu" : "More pages"}
                onClick={() => setMenuOpen((open) => !open)}
                className={`flex w-full flex-col items-center justify-center gap-0.5 px-1 py-2 transition-colors duration-200 focus:outline-none focus-visible:text-accent ${
                  menuOpen || moreActive
                    ? "text-accent"
                    : "text-white/55 active:text-white/80"
                }`}
              >
                {menuOpen ? (
                  <HiXMark aria-hidden className="h-5 w-5 shrink-0" />
                ) : (
                  <HiEllipsisHorizontal aria-hidden className="h-5 w-5 shrink-0" />
                )}
                <span className="text-[0.5625rem] font-bold leading-none tracking-[0.02em]">
                  More
                </span>
              </button>
            </li>
          </ul>
        </nav>

        {menuOpen ? (
          <>
            <button
              type="button"
              aria-label="Close menu"
              className="fixed inset-0 top-[calc(3.5rem+env(safe-area-inset-top))] z-40 bg-[#05071e]/55 backdrop-blur-[2px]"
              onClick={() => setMenuOpen(false)}
            />
            <div
              id="mobile-nav-menu"
              className="nav-glass absolute inset-x-3 top-[calc(100%+0.375rem)] z-50 overflow-hidden rounded-xl border border-white/10 shadow-2xl shadow-black/40"
            >
              <ul className="py-1">
                {MOBILE_MORE.map((link) => {
                  const active = isActive(pathname, link.href);
                  const Icon = link.icon;

                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={`flex items-center gap-3 px-4 py-3.5 text-sm font-bold transition-colors duration-200 focus:outline-none focus-visible:text-accent ${
                          active
                            ? "text-accent"
                            : "text-white/70 hover:text-white"
                        }`}
                      >
                        <Icon aria-hidden className="h-5 w-5 shrink-0 opacity-80" />
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
    </>
  );
}
