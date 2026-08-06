import { RevealGroup } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { pricing } from "@/content/site";

import { PricingCard } from "./pricing-card";

export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-24 border-t border-line bg-surface">
      <div className="section">
        <SectionHeading
          eyebrow={pricing.eyebrow}
          headline={pricing.headline}
          subhead={pricing.subhead}
        />

        {/* items-start keeps the featured card's negative margin from
            stretching its neighbours to match. */}
        <RevealGroup
          stagger={0.1}
          delayChildren={0.05}
          className="mt-16 grid items-start gap-5 md:grid-cols-3"
        >
          {pricing.tiers.map((tier) => (
            <PricingCard
              key={tier.name}
              name={tier.name}
              price={tier.price}
              cadence={tier.cadence}
              description={tier.description}
              features={tier.features}
              cta={tier.cta}
              featured={tier.featured}
              badge={"badge" in tier ? tier.badge : undefined}
            />
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
