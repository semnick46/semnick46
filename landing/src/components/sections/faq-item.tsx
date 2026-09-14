"use client";

import { AnimatePresence, m } from "framer-motion";
import { Plus } from "lucide-react";
import { useId, useState } from "react";

import { duration, ease } from "@/lib/motion";

type FaqItemProps = {
  question: string;
  answer: string;
};

/**
 * A disclosure, not a single-select accordion: each row toggles on its own so
 * two answers can be compared side by side, and there is no roving tabindex to
 * get wrong. The button carries aria-expanded and points at the panel it
 * controls, so screen readers announce state without any extra wiring.
 */
export function FaqItem({ question, answer }: FaqItemProps) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const panelId = `${id}-panel`;
  const buttonId = `${id}-button`;

  return (
    <div className="border-b border-line">
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="group flex w-full items-start justify-between gap-6 py-5 text-left"
        >
          <span className="text-[1.0625rem] font-medium tracking-tight transition-colors group-hover:text-brand">
            {question}
          </span>
          <m.span
            aria-hidden
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: duration.fast, ease }}
            className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-line text-muted transition-colors group-hover:border-brand/40 group-hover:text-brand"
          >
            <Plus size={14} strokeWidth={2.2} />
          </m.span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {open ? (
          <m.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: duration.base, ease }}
            className="overflow-hidden"
          >
            <p className="pb-5 pr-12 text-[0.9375rem] leading-relaxed text-muted text-pretty">
              {answer}
            </p>
          </m.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
