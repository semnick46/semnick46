"use client";

import { m } from "framer-motion";

import { fadeRise, springy } from "@/lib/motion";

type TestimonialCardProps = {
  quote: string;
  name: string;
  role: string;
  initials: string;
};

export function TestimonialCard({
  quote,
  name,
  role,
  initials,
}: TestimonialCardProps) {
  return (
    <m.figure
      variants={fadeRise}
      whileHover="hover"
      className="flex h-full flex-col justify-between gap-6 rounded-card border border-line bg-elevated p-6 sm:p-7"
    >
      <m.blockquote
        variants={{ hover: { x: 2 } }}
        transition={springy}
        className="text-[0.9375rem] leading-relaxed text-fg text-pretty"
      >
        <span aria-hidden className="mr-1 text-brand">
          &ldquo;
        </span>
        {quote}
      </m.blockquote>

      <figcaption className="flex items-center gap-3">
        <m.span
          variants={{ hover: { scale: 1.08 } }}
          transition={springy}
          aria-hidden
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-brand/15 bg-brand-soft text-sm font-semibold text-brand"
        >
          {initials}
        </m.span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium">{name}</span>
          <span className="block truncate text-sm text-muted">{role}</span>
        </span>
      </figcaption>
    </m.figure>
  );
}
