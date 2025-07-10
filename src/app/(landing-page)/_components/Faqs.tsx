import Badge from "@/components/ui/Badge";

const Faqs = () => {
  return (
    <section className="relative bg-[#a8c686]/10 pt-0 pb-10">
      {/* Top curve */}
      <div className="absolute -top-1 w-full overflow-hidden leading-none">
        <svg
          viewBox="0 0 1440 160"
          xmlns="http://www.w3.org/2000/svg"
          className="block w-full"
        >
          <path
            fill="#fdf9f3"
            d="
         M0,64 
          C120,120 360,40 540,80 
          C720,120 960,160 1140,100 
         C1320,40 1440,80 1440,80 
        L1440,0 
      L0,0 
      Z
    "
          />
        </svg>
      </div>

      {/* FAQ content */}
      <div className="container mx-auto px-7 mt-24">
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
