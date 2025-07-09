import Hero from "./_components/Hero";
// import HowItWorks from "./_components/HowItWorks";
// import Pitch from "./_components/Pitch";
import WhoItsForSection from "./_components/WhoItsFor";
import Pain from "./_components/PainSolution";
import Faqs from "./_components/Faqs";

export default function LandingPage() {
  return (
    <div>
      <Hero />
      <WhoItsForSection />
      <Pain />
      <Faqs />
      {/* <HowItWorks /> */}
      {/* <Pitch /> */}
    </div>
  );
}
