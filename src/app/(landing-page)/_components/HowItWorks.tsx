import { SectionDivider } from "@/components/ui";
import { CheckCircle, Clock, Activity, Repeat } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface Step {
  Icon: LucideIcon;
  title: string;
  description: string;
}

const HowItWorks = () => {
  const steps: Step[] = [
    {
      Icon: CheckCircle,
      title: "1. Pick Your Frog",
      description:
        "Choose the day’s single most important (and difficult) task.",
    },

    {
      Icon: Clock,
      title: "2. Start a Pomodoro",
      description:
        "Launch a 25-minute focus sprint on that Frog, no distractions allowed.",
    },
    {
      Icon: Activity,
      title: "3. Track Progress",
      description:
        "Log your Pomodoros, watch your streak, and see real momentum.",
    },
    {
      Icon: Repeat,
      title: "4. Stay Consistent",
      description:
        "On low-energy days, toggle Mini-Frog Mode and use energy-based planning to keep going.",
    },
  ];

  return (
    <>
      <SectionDivider />
      <section
        id="how-it-works"
        className="pt-7 pb-16 md:px-6"
      >
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Headline + Subheadline */}
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl lg:4xl font-sora font-semibold">
              How It Works
            </h2>
            <p className="mt-4 font-manrope text-base/7 text-walnut-brown/90 md:text-lg/7 max-w-2xl mx-auto">
              A simple, four step flow that guides you from “big scary task” to
              “completed Frog,” even on your lowest energy days.
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(({ Icon, title, description }) => (
              <div
                key={title}
                className="flex flex-col items-center space-y-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-[#ffe5b4]/50 py-6 px-5"
              >
                {/* Icon Circle */}
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-button">
                  <Icon className="size-6 text-white" />
                </div>

                {/* Title */}
                <h3 className="font-sora text-base font-semibold text-center">
                  {title}
                </h3>

                {/* Description */}
                <p className="font-manrope text-sm text-walnut-brown/80 leading-relaxed text-center">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HowItWorks;
