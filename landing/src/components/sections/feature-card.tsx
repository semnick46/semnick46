"use client";

import { m } from "framer-motion";
import { Activity, GitBranch, Users, type LucideIcon } from "lucide-react";

import { fadeRise, springy } from "@/lib/motion";

/**
 * Icons are looked up by key rather than passed as components, so content
 * stays a plain serialisable object in site.ts and never imports from React.
 */
const ICONS = {
  activity: Activity,
  gitBranch: GitBranch,
  users: Users,
} satisfies Record<string, LucideIcon>;

export type FeatureIcon = keyof typeof ICONS;

type FeatureCardProps = {
  icon: FeatureIcon;
  title: string;
  body: string;
};

export function FeatureCard({ icon, title, body }: FeatureCardProps) {
  const Icon = ICONS[icon];

  return (
    <m.article
      variants={fadeRise}
      whileHover="hover"
      className="group relative flex flex-col overflow-hidden rounded-card border border-line bg-elevated p-6 sm:p-7"
    >
      {/* Brand wash that fades in on hover, behind the content. */}
      <m.span
        aria-hidden
        variants={{ hover: { opacity: 1 } }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-soft/70 to-transparent"
      />

      <m.span
        aria-hidden
        variants={{ hover: { scale: 1.06, rotate: -3 } }}
        transition={springy}
        className="relative grid h-11 w-11 place-items-center rounded-xl border border-brand/15 bg-brand-soft text-brand"
      >
        <Icon size={20} strokeWidth={1.9} />
      </m.span>

      <h3 className="relative mt-5 text-lg font-semibold tracking-tight">
        {title}
      </h3>
      <p className="relative mt-2 text-[0.9375rem] leading-relaxed text-muted text-pretty">
        {body}
      </p>

      {/* Hairline that draws across the top edge on hover. */}
      <m.span
        aria-hidden
        variants={{ hover: { scaleX: 1 } }}
        initial={{ scaleX: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-x-0 top-0 h-px origin-left bg-gradient-to-r from-brand/0 via-brand to-brand/0"
      />
    </m.article>
  );
}
