import { SectionDivider, Badge } from "@/components/ui";
import { Feature } from "@/types/landing-page";
import { features } from "@/data/features";

const Features = () => {
  return (
    <>
      <SectionDivider />
      <section className="pt-10 pb-20">
        <div className="container mx-auto px-7">
          <div className="text-center mb-5">
            <Badge title="Features" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {features.map(
              (
                { Icon, iconColor, title, description }: Feature,
                index: number
              ) => {
                const bgColor =
                  index % 2 === 0 ? "bg-[#ffe5b4]/10" : "bg-[#a8c686]/10";
                return (
                  <div
                    className={`rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200 border border-light-background/40 relative ${bgColor}`}
                    key={index}
                  >
                    <div className={`${iconColor}/20 absolute -top-4`}>
                      <Icon className={`w-8 h-8 ${iconColor}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-center mb-3 font-sora tracking-wide">
                      {title}
                    </h3>
                    <p className="text-sm font-manrope leading-relaxed text-center">
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
