import clsx from "clsx";
import { Badge, Card } from "@/components/ui";
import WaitlistForm from "../_components/ui/WaitlistForm";
import { waitlist } from "@/data/landing-page/waitlist";
import Footer from "../_components/Footer";

export default function WaitlistPage() {
  return (
    <>
    <div className="max-w-lg mx-auto min-h-[calc(100vh-var(--header-height))] flex flex-col justify-center pt-14 md:pt-0 md:pb-0">
      <div className="px-7">
        <div className="text-center mb-6">
          <Badge title="Join the Waitlist" />
          <h1 className="text-3xl font-sora lg:text-4xl">
            Focus deeply. Rest intentionally.
          </h1>
          {/* my-5 font-manrope text-[15px] text-dark-accent/90 */}
          <p className="my-5 font-manrope text-[15px] text-dark-accent/90">
            Be the first to experience FocusPond when we launch.
          </p>
        </div>
        <WaitlistForm />
      </div>
      <div className="mt-16 grid sm:grid-cols-3 gap-y-8 gap-x-7 px-16 sm:px-0">
        {waitlist.map(({ Icon, benefit }, index: number) => {
          return (
            <Card
              key={index}
              rounded="2xl"
              shadow="md"
              className={clsx(
                "border border-light-background/40 relative hover:shadow-lg bg-white/80"
              )}
            >
              <div
                className={
                  "absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-accent-button p-3 ring-4 ring-base-background shadow"
                }
              >
                <Icon className={clsx("w-3 h-3 text-white")} />
              </div>
              <p className="mt-3 px-3 font-bold text-sm font-manrope leading-relaxed text-center">
                {benefit}
              </p>
            </Card>
          );
        })}
      </div>
    </div>
    <Footer/>
    </>
  );
}
