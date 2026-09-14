import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  headline: string;
  subhead?: string;
  align?: "center" | "left";
  className?: string;
};

/** The eyebrow / headline / subhead stack every section opens with. */
export function SectionHeading({
  eyebrow,
  headline,
  subhead,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <RevealGroup
      stagger={0.07}
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start",
        className,
      )}
    >
      {eyebrow ? (
        <RevealItem
          as="span"
          className="rounded-pill border border-brand/20 bg-brand-soft px-3 py-1 text-xs font-medium uppercase tracking-widest text-brand"
        >
          {eyebrow}
        </RevealItem>
      ) : null}

      <RevealItem as="h2" className="max-w-prose text-display text-balance">
        {headline}
      </RevealItem>

      {subhead ? (
        <RevealItem
          as="p"
          className={cn(
            "max-w-prose text-lead text-muted text-pretty",
            align === "center" && "mx-auto",
          )}
        >
          {subhead}
        </RevealItem>
      ) : null}
    </RevealGroup>
  );
}

/** Re-exported so sections can compose one-off reveals without a second import. */
export { Reveal };
