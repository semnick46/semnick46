"use client";

import { m } from "framer-motion";
import { Check } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { fadeRise, springy } from "@/lib/motion";
import { cn } from "@/lib/utils";

type PricingCardProps = {
  name: string;
  price: string;
  cadence: string;
  description: string;
  features: readonly string[];
  cta: { label: string; href: string };
  featured: boolean;
  badge?: string;
};

export function PricingCard({
  name,
  price,
  cadence,
  description,
  features,
  cta,
  featured,
  badge,
}: PricingCardProps) {
  return (
    <m.div
      variants={fadeRise}
      whileHover="hover"
      className={cn(
        "relative flex flex-col rounded-card border p-6 sm:p-7",
        featured
          ? "border-brand/40 bg-elevated shadow-xl shadow-brand/10 md:-my-4 md:py-11"
          : "border-line bg-elevated",
      )}
    >
      {badge ? (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-pill bg-brand px-3 py-1 text-xs font-medium text-brand-on shadow-sm">
          {badge}
        </span>
      ) : null}

      <h3 className="text-sm font-semibold uppercase tracking-widest text-brand">
        {name}
      </h3>

      <p className="mt-4 flex items-baseline gap-1.5">
        <m.span
          variants={{ hover: { scale: 1.03 } }}
          transition={springy}
          className="inline-block origin-left text-4xl font-semibold tracking-tight tabular-nums"
        >
          {price}
        </m.span>
        {cadence ? (
          <span className="text-sm text-muted">{cadence}</span>
        ) : null}
      </p>

      <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted text-pretty">
        {description}
      </p>

      <ButtonLink
        href={cta.href}
        variant={featured ? "primary" : "secondary"}
        size="lg"
        className="mt-7 w-full"
      >
        {cta.label}
      </ButtonLink>

      <ul className="mt-7 flex flex-col gap-3 border-t border-line pt-7">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-[0.9375rem]">
            <span
              aria-hidden
              className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-brand-soft text-brand"
            >
              <Check size={11} strokeWidth={3} />
            </span>
            <span className="text-pretty">{feature}</span>
          </li>
        ))}
      </ul>
    </m.div>
  );
}
