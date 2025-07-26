import {
  Hero,
  // WhoItsFor,
  PainSolution,
  Faqs,
  CtaBanner,
  Testimonial,
  Features,
} from "./_components";

export default function LandingPage() {
  return (
    <div>
      <Hero />
      {/* <WhoItsFor /> */}
      <PainSolution />
      <Features />
      <Testimonial />
      <CtaBanner />
      <Faqs />
    </div>
  );
}
