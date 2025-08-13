import {
  Hero,
  WhoItsFor,
  Benefits,
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
      <Benefits />
      <Features />
      <HowItWorks />
      <WhoItsFor />
      <Testimonial />
      <CtaBanner />
      <Faqs />
    </div>
  );
}
