import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center justify-center gap-2 rounded-pill font-medium " +
  "transition-[transform,background-color,border-color,color] duration-150 ease-out " +
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap";

const variants = {
  primary:
    "bg-brand text-brand-on shadow-sm shadow-brand/25 hover:bg-brand-strong hover:shadow-md hover:shadow-brand/30",
  secondary:
    "bg-elevated text-fg border border-line hover:border-brand/40 hover:bg-brand-soft",
  ghost: "text-muted hover:text-fg hover:bg-surface",
} as const;

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-12 px-6 text-base",
} as const;

type ButtonVariant = keyof typeof variants;
type ButtonSize = keyof typeof sizes;

type SharedProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
};

/**
 * Renders an anchor when given `href`, a button otherwise — so a CTA that
 * navigates stays a real link and keeps its keyboard and middle-click
 * behaviour, without callers having to pick the right component.
 */
export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: SharedProps & ComponentPropsWithoutRef<"button">) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  ...props
}: SharedProps & ComponentPropsWithoutRef<typeof Link>) {
  return (
    <Link
      href={href}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </Link>
  );
}
