import { RevealGroup } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { features } from "@/content/site";

import { FeatureCard } from "./feature-card";

export function Features() {
  return (
    <section id="features" className="scroll-mt-24 border-t border-line bg-surface">
      <div className="section">
        <SectionHeading
          eyebrow={features.eyebrow}
          headline={features.headline}
          subhead={features.subhead}
        />

        <RevealGroup
          stagger={0.1}
          delayChildren={0.05}
          className="mt-14 grid gap-5 md:grid-cols-3"
        >
          {features.items.map((item) => (
            <FeatureCard
              key={item.title}
              icon={item.icon}
              title={item.title}
              body={item.body}
            />
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
