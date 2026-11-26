import clsx from "clsx";
import { useTranslations } from "next-intl";

import { Badge, Card } from "@/components/ui";
import WaitlistForm from "../_components/ui/WaitlistForm";
import { waitlist } from "@/data/landing-page/waitlist";
import Footer from "../_components/Footer";

/**
 * The notify-me list.
 *
 * It used to say "be the first to experience FocusPond when we launch" on a
 * site whose main button says "Start for free" — a contradiction on a public,
 * indexable page, and the sort a stranger notices before anything else. The
 * app has launched; what has not is anywhere to put your data but this device.
 *
 * So this is now a list for one specific promise — accounts and backup, M8 and
 * M9 — and it says so. The API route behind it already works, which is why
 * this was worth repurposing rather than deleting.
 */
export default function WaitlistPage() {
  const t = useTranslations("marketing.waitlist");

  return (
    <>
      <div className="mx-auto flex min-h-[calc(100vh-var(--header-height))] max-w-lg flex-col justify-center pt-14 md:pt-0 md:pb-0">
        <div className="px-7">
          <div className="mb-6 text-center">
            <Badge title={t("badge")} />
            <h1 className="font-sora text-3xl lg:text-4xl">{t("heading")}</h1>
            <p className="my-5 font-manrope text-[15px] text-ink-muted">
              {t("body")}
            </p>
          </div>
          <WaitlistForm />
        </div>

        <div className="mt-16 grid gap-x-7 gap-y-8 px-16 sm:grid-cols-3 sm:px-0">
          {waitlist.map(({ Icon, key }) => (
            <Card
              key={key}
              rounded="2xl"
              elevation="e2"
              className="relative hover:shadow-e3"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-accent p-3 ring-4 ring-surface shadow-e1">
                <Icon className={clsx("h-3 w-3 text-accent-ink")} />
              </div>
              <p className="mt-3 px-3 text-center font-manrope text-sm leading-relaxed font-bold text-ink">
                {t(`items.${key}`)}
              </p>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
