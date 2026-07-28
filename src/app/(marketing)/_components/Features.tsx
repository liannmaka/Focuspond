import clsx from "clsx";
import { SectionDivider, Badge, Card } from "@/components/ui";
import { Feature } from "@/types/landing-page";
import { features } from "@/data/landing-page/features";
import { useTranslations } from "next-intl";

const Features = () => {
  const t = useTranslations("marketing.features");

  return (
    <>
      <SectionDivider />
      <section
        className="pt-10 pb-20"
        id="features"
      >
        <div className="content-center">
          <div className="text-center mb-16">
            <Badge title={t("badge")} />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold font-sora leading-tight">
              {t("title")}
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-base font-manrope sm:text-lg">
              {t("subtitle")}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {features.map(
              ({ Icon, iconColor, key }: Feature, index: number) => {
                return (
                  <Card
                    key={index}
                    rounded="2xl"
                    elevation="e2"
                    padding="none"
                    className="relative px-6 py-8 transition-transform duration-200 hover:-translate-y-1 hover:shadow-e3"
                  >
                    <div className="absolute -top-4">
                      <Icon className={clsx("w-8 h-8", iconColor)} />
                    </div>
                    <h3 className="text-lg font-semibold text-center mb-3 font-sora tracking-tight text-ink">
                      {t(`items.${key}.title`)}
                    </h3>
                    <p className="text-sm font-manrope leading-relaxed text-center text-ink-muted">
                      {t(`items.${key}.description`)}
                    </p>
                  </Card>
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
