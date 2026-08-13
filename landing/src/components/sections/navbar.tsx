"use client";

import { AnimatePresence, m, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { ButtonLink } from "@/components/ui/button";
import { nav, site } from "@/content/site";
import { duration, ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  // Subscribing to the motion value avoids a React state update per scroll
  // frame — we only re-render on the transition across the threshold.
  useMotionValueEvent(scrollY, "change", (latest) => {
    const next = latest > 12;
    setScrolled((prev) => (prev === next ? prev : next));
  });

  return (
    <m.header
      initial={{ y: -72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: duration.base, ease, delay: 0.1 }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className={cn(
          "transition-[background-color,border-color,backdrop-filter] duration-300 ease-out",
          scrolled || open
            ? "border-b border-line bg-bg/80 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <nav
          aria-label="Main"
          className="mx-auto flex h-16 w-full max-w-content items-center justify-between px-5 sm:px-6"
        >
          <Link
            href="#"
            className="flex items-center gap-2 text-[0.9375rem] font-semibold tracking-tight"
          >
            <LogoMark />
            {site.name}
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {nav.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-pill px-3 py-2 text-sm text-muted transition-colors hover:bg-surface hover:text-fg"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-2 md:flex">
            <Link
              href={nav.secondary.href}
              className="rounded-pill px-3 py-2 text-sm text-muted transition-colors hover:text-fg"
            >
              {nav.secondary.label}
            </Link>
            <ButtonLink href={nav.cta.href} size="sm">
              {nav.cta.label}
            </ButtonLink>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="-mr-2 inline-flex h-10 w-10 items-center justify-center rounded-pill text-fg transition-colors hover:bg-surface md:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        <AnimatePresence initial={false}>
          {open ? (
            <m.div
              id="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: duration.base, ease }}
              className="overflow-hidden md:hidden"
            >
              <ul className="mx-auto flex max-w-content flex-col gap-1 px-5 pb-4 sm:px-6">
                {nav.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-card px-3 py-2.5 text-[0.9375rem] text-muted transition-colors hover:bg-surface hover:text-fg"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li className="mt-2 flex flex-col gap-2">
                  <ButtonLink
                    href={nav.cta.href}
                    onClick={() => setOpen(false)}
                    className="w-full"
                  >
                    {nav.cta.label}
                  </ButtonLink>
                  <ButtonLink
                    href={nav.secondary.href}
                    variant="secondary"
                    onClick={() => setOpen(false)}
                    className="w-full"
                  >
                    {nav.secondary.label}
                  </ButtonLink>
                </li>
              </ul>
            </m.div>
          ) : null}
        </AnimatePresence>
      </div>
    </m.header>
  );
}

function LogoMark() {
  return (
    <span
      aria-hidden
      className="grid h-7 w-7 place-items-center rounded-lg bg-brand text-brand-on"
    >
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
        <path
          d="M2 11.5 6 6l3.2 3.6L14 3.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
