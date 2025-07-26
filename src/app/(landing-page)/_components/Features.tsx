import { SectionDivider, Badge } from "@/components/ui";
import { LucideIcon } from "lucide-react";
import {
  Calendar,
  Timer,
  FileText,
  RefreshCcw,
  HeartPulse,
  Award,
  Coffee,
  BookOpen,
} from "lucide-react";

interface Feature {
  Icon: LucideIcon;
  iconColor: string;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    Icon: Calendar,
    iconColor: "text-[#ff9472]",
    title: "Daily Planner",
    description:
      "Organize your day with simple checklists and auto-roll unfinished tasks.",
  },
  {
    Icon: Timer,
    iconColor: "text-[#a8c686]",
    title: "Focus Timer",
    description:
      "Break work into Pomodoro sessions with mindful breaks to maintain energy.",
  },
  {
    Icon: FileText,
    iconColor: "text-yellow-500",
    title: "Quick Notes",
    description:
      "Jot down thoughts instantly to clear your mind, without leaving the app.",
  },
  {
    Icon: RefreshCcw,
    iconColor: "text-[#8b5e3c]",
    title: "Vibe Switcher",
    description:
      "Toggle app tone between Formal and Pidgin to match your mood.",
  },
  {
    Icon: HeartPulse,
    iconColor: "text-[#ff9472]",
    title: "Mood Check-In",
    description:
      "Reflect on your feelings with quick emoji or phrase check-ins.",
  },
  {
    Icon: Award,
    iconColor: "text-[#a8c686]",
    title: "Frog Selection",
    description:
      "Pick your most important task of the day, your ‘Frog’ and tackle it first.",
  },
  {
    Icon: Coffee,
    iconColor: "text-yellow-500",
    title: "Mindful Breaks",
    description:
      "Get gentle prompts during breaks to stretch, breathe, or hydrate.",
  },
  {
    Icon: BookOpen,
    iconColor: "text-[#8b5e3c]",
    title: "End-of-Day Reflection",
    description: "Review your wins and insights to wrap up your day calmly.",
  },
];

const Features = () => {
  return (
    <>
      <SectionDivider />
      <section className="pt-14 pb-20">
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
