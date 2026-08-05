import { Features } from "@/components/sections/features";
import { Hero } from "@/components/sections/hero";
import { Navbar } from "@/components/sections/navbar";
import { SocialProof } from "@/components/sections/social-proof";

/**
 * Landing page composition root.
 *
 * Sections are added here one at a time as they are built. Everything is a
 * server component except the motion wrappers, so the initial HTML ships fully
 * rendered and only the animation runtime hydrates.
 */
export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <SocialProof />
      </main>
    </>
  );
}
