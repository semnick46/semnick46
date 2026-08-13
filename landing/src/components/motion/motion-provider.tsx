"use client";

import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Wraps the tree once, at the root.
 *
 * - `LazyMotion` + `domAnimation` ships only the DOM animation feature set
 *   (roughly half the weight of importing `motion` directly). The trade-off is
 *   that every animated element must use the `m.*` components, never `motion.*`.
 * - `reducedMotion="user"` makes Framer drop transform/layout animations for
 *   anyone with the OS setting on, while keeping opacity fades — so the page
 *   still reads as intentional rather than inert.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
