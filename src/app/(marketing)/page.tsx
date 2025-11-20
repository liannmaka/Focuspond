"use client";

import dynamic from "next/dynamic";

// Lazy load with deferred hydration
const Hero = dynamic(() => import("./_components/Hero"), { ssr: true });
const Benefits = dynamic(() => import("./_components/Benefits"), { ssr: true });
const Features = dynamic(() => import("./_components/Features"), {
  ssr: false,
});
const HowItWorks = dynamic(() => import("./_components/HowItWorks"), {
  ssr: false,
});
const WhoItsFor = dynamic(() => import("./_components/WhoItsFor"), {
  ssr: false,
});
const Testimonial = dynamic(() => import("./_components/Testimonial"), {
  ssr: false,
});
const CtaBanner = dynamic(() => import("./_components/CtaBanner"), {
  ssr: false,
});
const Faqs = dynamic(() => import("./_components/faq/Faqs"), { ssr: false });

export default function LandingPage() {
  return (
    <div>
      <Hero />
      <Benefits />
      {/* Hydrate rest only when visible */}
      <div id="below-the-fold">
        <Features />
        <HowItWorks />
        <WhoItsFor />
        <Testimonial />
        <CtaBanner />
        <Faqs />
      </div>
    </div>
  );
}
