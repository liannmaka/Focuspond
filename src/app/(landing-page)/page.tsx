import Hero from "./_components/Hero";
// import HowItWorks from "./_components/HowItWorks";
import Pitch from "./_components/Pitch";
import WhoItsForSection from "./_components/WhoItsFor";
export default function LandingPage() {
  return (
    <div>
      <Hero />
      <WhoItsForSection />
      {/* <HowItWorks /> */}
      <Pitch />
    </div>
  );
}
