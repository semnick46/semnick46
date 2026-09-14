"use client";

import { m, type Variants } from "framer-motion";
import type { ElementType, ReactNode } from "react";

import { fadeRise, revealViewport, staggerParent } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Element to render. Defaults to a plain div. */
  as?: ElementType;
  /** Override the entrance. Defaults to the shared fade-and-rise. */
  variants?: Variants;
  /** Seconds to wait before this element starts animating. */
  delay?: number;
};

/**
 * Scroll-triggered entrance for a single element.
 *
 * Fires once, a quarter of the way into view, using the shared viewport config
 * so unrelated sections still feel like they belong to the same page.
 */
export function Reveal({
  children,
  className,
  as = "div",
  variants = fadeRise,
  delay = 0,
}: RevealProps) {
  const MotionTag = m[as as keyof typeof m] as typeof m.div;

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </MotionTag>
  );
}

type RevealGroupProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** Gap between each child's entrance, in seconds. */
  stagger?: number;
  /** Delay before the first child starts, in seconds. */
  delayChildren?: number;
};

/**
 * Staggered entrance for a list. Children animate by declaring the same
 * `hidden`/`visible` variant keys — usually via `RevealItem` — which keeps
 * them unaware of their own index.
 */
export function RevealGroup({
  children,
  className,
  as = "div",
  stagger = 0.08,
  delayChildren = 0,
}: RevealGroupProps) {
  const MotionTag = m[as as keyof typeof m] as typeof m.div;

  return (
    <MotionTag
      className={className}
      variants={staggerParent(stagger, delayChildren)}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
    >
      {children}
    </MotionTag>
  );
}

/** A child of `RevealGroup`. Timing comes from the parent. */
export function RevealItem({
  children,
  className,
  as = "div",
  variants = fadeRise,
}: Omit<RevealProps, "delay">) {
  const MotionTag = m[as as keyof typeof m] as typeof m.div;

  return (
    <MotionTag className={className} variants={variants}>
      {children}
    </MotionTag>
  );
}
