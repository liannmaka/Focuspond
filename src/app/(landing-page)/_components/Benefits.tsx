import Image from "next/image";
import { SectionDivider } from "@/components/ui";
import { Badge } from "@/components/ui";
import { benefits } from "@/data/landing-page/benefits";

const StickyScrollBenefits = () => {
  return (
    <>
      <SectionDivider />
      <section className="pt-10 pb-20 md:space-y-20">
        <div className="px-7 text-center">
          <h2 className="text-3xl md:text-4xl font-sora font-semibold leading-tight mb-10">
            A calm way to stay productive
          </h2>
          <div className="hidden lg:inline-flex space-x-4">
            {benefits.map(({ badge }) => (
              <Badge
                key={badge}
                title={badge}
              />
            ))}
          </div>
        </div>

        {benefits.map(({ badge, title, paragraph, image }, idx) => (
          <div
            key={idx}
            className="relative w-full"
          >
            <div
              className="hidden md:block absolute inset-y-0 right-0 w-[50%] bg-[#fff0e8]
                         rounded-tl-full rounded-bl-full z-0"
              aria-hidden="true"
            />
            <div className="content-center grid gap-y-5 lg:grid-cols-2  lg:gap-x-10 relative z-10">
              {/* Left: Text column*/}
              <div>
                <Badge title={badge} />
                <h3 className="text-2xl md:text-3xl font-sora font-semibold leading-tight">
                  {title}
                </h3>
                <p className="mt-4 font-manrope text-base md:text-lg lg:text-balance">
                  {paragraph}
                </p>
              </div>
              {/* Right: Image column*/}
              <div className="flex justify-center">
                <Image
                  src={image}
                  alt={title}
                  width={400}
                  height={300}
                  className="relative"
                  priority
                />
              </div>
            </div>
          </div>
        ))}
      </section>
    </>
  );
};

export default StickyScrollBenefits;
