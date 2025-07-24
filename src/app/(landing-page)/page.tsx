import {
  Hero,
  // WhoItsFor,
  PainSolution,
  Faqs,
  CtaBanner,
  Testimonial,
} from "./_components";

export default function LandingPage() {
  return (
    <div>
      <Hero />
      {/* <WhoItsFor /> */}
      <PainSolution />
      <Testimonial />
      <CtaBanner />
      <Faqs />
    </div>
  );
}
