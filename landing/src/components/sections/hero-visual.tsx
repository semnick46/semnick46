"use client";

import { m } from "framer-motion";

import { duration, ease, revealViewport } from "@/lib/motion";

const BARS = [38, 52, 44, 67, 58, 79, 71, 88, 76, 94, 85, 100];

/**
 * Abstract product shot, drawn rather than photographed.
 *
 * A screenshot here would be the LCP element and the single biggest asset on
 * the page. Inline SVG plus a handful of divs costs nothing to download, scales
 * cleanly, and inherits the theme tokens for free.
 */
export function HeroVisual() {
  return (
    <m.div
      initial={{ opacity: 0, y: 32, rotateX: 6 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={revealViewport}
      transition={{ duration: duration.slow, ease, delay: 0.15 }}
      style={{ perspective: 1200 }}
      className="relative mx-auto mt-16 w-full max-w-4xl"
    >
      <div className="overflow-hidden rounded-card border border-line bg-elevated shadow-2xl shadow-brand/10">
        {/* Window chrome */}
        <div className="flex items-center gap-2 border-b border-line bg-surface px-4 py-3">
          <span className="flex gap-1.5" aria-hidden>
            <Dot />
            <Dot />
            <Dot />
          </span>
          <span className="ml-2 rounded-pill bg-bg px-3 py-1 text-xs text-subtle">
            lumen.app / funnels / checkout
          </span>
        </div>

        <div className="grid gap-6 p-5 sm:grid-cols-[1fr_auto] sm:p-7">
          <div className="min-w-0">
            <p className="text-sm text-muted">Checkout conversion</p>
            <p className="mt-1 flex items-baseline gap-2">
              <span className="text-title tabular-nums">4.82%</span>
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                +0.61
              </span>
            </p>

            {/* Bars grow from the baseline, staggered left to right. */}
            <div
              className="mt-6 flex h-32 items-end gap-1.5 sm:gap-2"
              aria-hidden
            >
              {BARS.map((height, i) => (
                <m.span
                  key={i}
                  className="flex-1 rounded-t-sm bg-brand/25 last:bg-brand"
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={revealViewport}
                  transition={{
                    duration: duration.base,
                    ease,
                    delay: 0.4 + i * 0.035,
                  }}
                  style={{ height: `${height}%`, transformOrigin: "bottom" }}
                />
              ))}
            </div>
          </div>

          <ul className="flex shrink-0 flex-row gap-4 border-line sm:w-40 sm:flex-col sm:border-l sm:pl-6">
            {[
              { label: "Visited", value: "128,402" },
              { label: "Added to cart", value: "31,955" },
              { label: "Purchased", value: "6,187" },
            ].map((step) => (
              <li key={step.label} className="min-w-0 flex-1 sm:flex-none">
                <p className="truncate text-xs text-subtle">{step.label}</p>
                <p className="mt-0.5 text-sm font-medium tabular-nums">
                  {step.value}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Floating annotation — the kind of detail that sells "live". */}
      <m.div
        initial={{ opacity: 0, scale: 0.9, y: 8 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={revealViewport}
        transition={{ duration: duration.base, ease, delay: 1 }}
        className="absolute -bottom-4 right-3 hidden items-center gap-2 rounded-pill border border-line bg-elevated px-3 py-2 text-xs shadow-lg sm:flex"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        Deploy <span className="font-medium">v2.14.0</span> · 4m ago
      </m.div>
    </m.div>
  );
}

function Dot() {
  return <span className="h-2.5 w-2.5 rounded-full bg-line" />;
}
