import clsx from "clsx";
import { SectionDivider, Badge } from "@/components/ui";
import { Feature } from "@/types/landing-page";
import { features } from "@/data/landing-page/features";

const Features = () => {
  return (
    <>
      <SectionDivider />
      <section className="pt-10 pb-20">
        <div className="content-center">
          <div className="text-center mb-16">
            <Badge title="Features" />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold font-sora leading-tight">
              Gentle tools to support your focus
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-base font-manrope sm:text-lg">
              Each feature is designed to help you plan, work, and reflect with
              intention, without the noise or burnout.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {features.map(
              (
                { Icon, iconColor, title, description }: Feature,
                index: number
              ) => {
                const bgColor =
                  index % 2 === 0
                    ? "bg-light-background/10"
                    : "bg-secondary-accent/10";
                return (
                  <div
                    className={clsx("card relative", bgColor)}
                    key={index}
                  >
                    <div className={`${iconColor}/20 absolute -top-4`}>
                      <Icon className={clsx("w-8 h-8", iconColor)} />
                    </div>
                    <h3 className="text-lg font-semibold text-center mb-3 font-sora tracking-wide text-[#5a3a24]">
                      {title}
                    </h3>
                    <p className="text-sm font-manrope leading-relaxed text-center text-[#5a3a24]">
                      {description}
                    </p>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Features;
