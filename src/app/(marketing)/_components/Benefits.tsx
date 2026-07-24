import Image from "next/image";
import { SectionDivider } from "@/components/ui";
import { Badge } from "@/components/ui";
import { benefits } from "@/data/landing-page/benefits";
import { useTranslations } from "next-intl";

const StickyScrollBenefits = () => {
  const t = useTranslations("marketing.benefits");

  return (
    <>
      <SectionDivider />
      <section
        className="pt-10 pb-20 md:space-y-20"
        id="benefits"
      >
        <div className="px-7 text-center">
          <h2 className="text-3xl md:text-4xl font-sora font-semibold leading-tight mb-10">
            {t("sectionTitle")}
          </h2>
          <div className="hidden lg:inline-flex space-x-4">
            {benefits.map(({ key }) => (
              <Badge
                key={key}
                title={t(`items.${key}.badge`)}
              />
            ))}
          </div>
        </div>

        {benefits.map(({ key, image }, idx) => (
          <div
            key={idx}
            className="relative w-full"
          >
            <div
              className="hidden md:block absolute inset-y-0 right-0 w-[50%] bg-[#fff0e8]
                         rounded-tl-full rounded-bl-full z-0"
              aria-hidden="true"
            />
            <div className="content-center grid gap-y-5 lg:grid-cols-2  lg:gap-x-10 relative z-10 items-center">
              {/* Left: Text column*/}
              <div>
                <Badge title={t(`items.${key}.badge`)} />
                <h3 className="text-2xl md:text-3xl font-sora font-semibold leading-tight">
                  {t(`items.${key}.title`)}
                </h3>
                <p className="mt-4 font-manrope text-base md:text-lg lg:text-balance">
                  {t(`items.${key}.paragraph`)}
                </p>
              </div>
              {/* Right: Image column*/}
              <div className="relative flex justify-center">
                <Image
                  src={image}
                  alt={t(`items.${key}.title`)}
                  width={400}
                  height={400}
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
