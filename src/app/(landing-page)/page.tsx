import {
  Hero,
  WhoItsFor,
  PainSolution,
  Faqs,
  CtaBanner,
  Testimonial,
  Features,
  HowItWorks,
} from "./_components";

export default function LandingPage() {
  return (
    <div>
      <Hero />
      <PainSolution />
      <Features />
      <HowItWorks />
      <WhoItsFor />
      <Testimonial />
      <CtaBanner />
      <Faqs />
    </div>
  );
}
