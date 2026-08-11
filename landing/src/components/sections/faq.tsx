import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { faq } from "@/content/site";

import { FaqItem } from "./faq-item";

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-24 border-t border-line">
      <div className="section">
        <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-[minmax(0,20rem)_1fr] md:gap-16">
          <SectionHeading
            eyebrow={faq.eyebrow}
            headline={faq.headline}
            align="left"
            className="md:sticky md:top-28 md:self-start"
          />

          <RevealGroup stagger={0.06} className="min-w-0">
            {faq.items.map((item) => (
              <RevealItem key={item.q}>
                <FaqItem question={item.q} answer={item.a} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
