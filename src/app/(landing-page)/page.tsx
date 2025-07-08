import Hero from "./_components/Hero";
// import HowItWorks from "./_components/HowItWorks";
// import Pitch from "./_components/Pitch";
import WhoItsForSection from "./_components/WhoItsFor";
import Pain from "./_components/PainSolution";
import Faqs from "./_components/Faqs";
import Footer from "./_components/Footer";

export default function LandingPage() {
  return (
    <div>
      <Hero />
      <WhoItsForSection />
      <Pain />
      <div className="bg-[#a8c686]/10">
        <Faqs />
        <Footer />
      </div>

      {/* <HowItWorks /> */}
      {/* <Pitch /> */}
    </div>
  );
}
