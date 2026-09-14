import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { hero } from "@/content/site";

import { HeroVisual } from "./hero-visual";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <Backdrop />

      <div className="section relative pt-32 md:pt-40">
        <RevealGroup
          stagger={0.09}
          className="flex flex-col items-center text-center"
        >
          <RevealItem>
            <Link
              href={hero.announcement.href}
              className="group inline-flex items-center gap-2 rounded-pill border border-line bg-elevated/80 py-1 pl-1.5 pr-3 text-sm text-muted backdrop-blur transition-colors hover:border-brand/30 hover:text-fg"
            >
              <span className="inline-flex items-center gap-1 rounded-pill bg-brand-soft px-2 py-0.5 text-xs font-medium text-brand">
                <Sparkles size={12} />
                New
              </span>
              {hero.announcement.label}
              <ArrowRight
                size={14}
                className="transition-transform duration-200 ease-out group-hover:translate-x-0.5"
              />
            </Link>
          </RevealItem>

          <RevealItem
            as="h1"
            className="mt-7 max-w-4xl text-display-lg text-balance"
          >
            {hero.headline}
          </RevealItem>

          <RevealItem
            as="p"
            className="mt-6 max-w-prose text-lead text-muted text-pretty"
          >
            {hero.subhead}
          </RevealItem>

          <RevealItem className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <ButtonLink href={hero.primaryCta.href} size="lg" className="group">
              {hero.primaryCta.label}
              <ArrowRight
                size={17}
                className="transition-transform duration-200 ease-out group-hover:translate-x-0.5"
              />
            </ButtonLink>
            <ButtonLink
              href={hero.secondaryCta.href}
              variant="secondary"
              size="lg"
            >
              {hero.secondaryCta.label}
            </ButtonLink>
          </RevealItem>

          <RevealItem as="p" className="mt-5 text-sm text-subtle">
            {hero.reassurance}
          </RevealItem>
        </RevealGroup>

        <HeroVisual />

        <RevealGroup
          stagger={0.08}
          className="mx-auto mt-14 grid max-w-2xl grid-cols-1 gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-3"
        >
          {hero.metrics.map((metric) => (
            <RevealItem
              key={metric.label}
              className="flex flex-col items-center gap-1 bg-bg px-6 py-6"
            >
              <span className="text-title tabular-nums">{metric.value}</span>
              <span className="text-sm text-muted">{metric.label}</span>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

/**
 * Pure CSS backdrop — a gradient wash plus a masked grid. Deliberately not an
 * image: nothing to download, nothing to shift layout, no LCP candidate
 * competing with the headline.
 */
function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute left-1/2 top-[-14rem] h-[34rem] w-[64rem] -translate-x-1/2 rounded-full bg-brand/15 blur-[120px]" />
      <div
        className="absolute inset-0 opacity-[0.35] dark:opacity-25"
        style={{
          backgroundImage:
            "linear-gradient(to right, hsl(var(--line)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--line)) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 80% 55% at 50% 0%, #000 55%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 55% at 50% 0%, #000 55%, transparent 100%)",
        }}
      />
    </div>
  );
}
