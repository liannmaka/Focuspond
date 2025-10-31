import { Benefit } from "@/types/landing-page";
import solutionOne from "../../../public/svgs/solution-1.svg";
import solutionTwo from "../../../public/svgs/solution-2.svg";
import solutionThree from "../../../public/svgs/solution-3.svg";
import solutionFour from "../../../public/svgs/solution-4.svg";

export const benefits: Benefit[] = [
  {
    badge: "Focus-First Planning",
    title: "Plan your day with intention",
    paragraph:
      "Start your day by choosing your Frog, the one task that truly matters. No clutter, no overwhelm. Just calm, focused energy.",
    image: solutionOne,
  },
  {
    badge: "Gentle Pomodoro Rhythm",
    title: "Work in focused sprints, rest with care",
    paragraph:
      "Find your natural rhythm. Focus deeply, take mindful breaks, and keep your energy steady throughout the day.",
    image: solutionTwo,
  },
  {
    badge: "Mood-Aware Productivity",
    title: "Stay connected to how you feel",
    paragraph:
      "Your energy shapes your focus. Use mood check-ins and mini-Frogs to stay aligned and kind to yourself, even on tough days.",
    image: solutionThree,
  },
  {
    badge: "Gentle Progress Tracking",
    title: "Reflect, log, and grow your focus",
    paragraph:
      "End your day calmly by noting your wins and insights. See your streaks and completed Frogs, because every small step forward counts.",
    image: solutionFour,
  },
];
