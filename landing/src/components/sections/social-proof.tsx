import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { socialProof } from "@/content/site";

import { LogoMarquee } from "./logo-marquee";
import { TestimonialCard } from "./testimonial-card";

export function SocialProof() {
  return (
    <section id="customers" className="scroll-mt-24 border-t border-line">
      <div className="section">
        <Reveal className="flex flex-col items-center gap-8">
          <p className="text-xs font-medium uppercase tracking-widest text-subtle">
            {socialProof.eyebrow}
          </p>
          <div className="w-full">
            <LogoMarquee logos={socialProof.logos} />
          </div>
        </Reveal>

        <RevealGroup
          stagger={0.1}
          className="mt-20 grid gap-5 md:grid-cols-3"
        >
          {socialProof.testimonials.map((t) => (
            <TestimonialCard
              key={t.name}
              quote={t.quote}
              name={t.name}
              role={t.role}
              initials={t.initials}
            />
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
