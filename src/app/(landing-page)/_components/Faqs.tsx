import Badge from "@/components/ui/Badge";

const Faqs = () => {
  return (
    <section className="bg-[#a8c686]/10">
      {/* FAQ content */}
      <div className="container mx-auto px-7">
        <Badge title="FAQs" />
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-sora font-semibold">
            Frequently asked questions
          </h2>
          <p className="mt-4 font-manrope text-base/7 text-walnut-brown/90 md:text-lg/7">
            Check out the most common questions
          </p>
        </div>
      </div>
    </section>
  );
};

export default Faqs;
