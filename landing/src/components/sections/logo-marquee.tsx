"use client";

import { m, useReducedMotion } from "framer-motion";

type LogoMarqueeProps = {
  logos: readonly string[];
  /** Seconds for one full pass. Longer list, longer duration. */
  duration?: number;
};

/**
 * Infinite logo strip.
 *
 * The list is rendered twice and translated by exactly -50%, so the second
 * copy lands where the first began and the loop has no visible seam. Only
 * `transform` animates, so this stays on the compositor.
 *
 * With reduced motion on, the strip renders static and wraps instead — an
 * endlessly moving band is exactly what that preference exists to stop.
 */
export function LogoMarquee({ logos, duration = 38 }: LogoMarqueeProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
        {logos.map((logo) => (
          <li key={logo} className="text-lg font-semibold text-subtle">
            {logo}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div
      className="relative overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)",
      }}
    >
      <m.ul
        className="flex w-max items-center gap-x-14"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration, ease: "linear", repeat: Infinity }}
      >
        {[...logos, ...logos].map((logo, i) => (
          <li
            key={`${logo}-${i}`}
            aria-hidden={i >= logos.length}
            className="shrink-0 whitespace-nowrap text-lg font-semibold tracking-tight text-subtle"
          >
            {logo}
          </li>
        ))}
      </m.ul>
    </div>
  );
}
