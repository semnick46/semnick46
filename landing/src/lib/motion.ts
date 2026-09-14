import type { Transition, Variants } from "framer-motion";

/**
 * Motion tokens. Every animation in the app composes these rather than
 * hand-rolling durations, so the whole page shares one sense of timing.
 */
export const duration = {
  fast: 0.18,
  base: 0.42,
  slow: 0.7,
} as const;

/** Custom cubic-bezier mirrored in tailwind.config as `ease-out`. */
export const ease = [0.22, 1, 0.36, 1] as const;

export const springy: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 30,
  mass: 0.9,
};

/** Distance travelled by "rise" style entrances, in px. */
const RISE = 24;

export const fadeRise: Variants = {
  hidden: { opacity: 0, y: RISE },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.base, ease },
  },
};

export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: duration.base, ease } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: springy },
};

/**
 * Parent variant for staggered groups. Children opt in by using `fadeRise`
 * (or any variant with the same hidden/visible keys) — the parent drives the
 * timing, so children stay ignorant of their position in the list.
 */
export function staggerParent(stagger = 0.08, delayChildren = 0): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren },
    },
  };
}

/** Shared viewport config so every scroll reveal triggers at the same point. */
export const revealViewport = { once: true, amount: 0.25 } as const;
