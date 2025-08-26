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
      "Begin each day by picking your Frog, the one task that truly matters. No clutter. Just calm, focused energy.",
    image: solutionOne,
  },
  {
    badge: "Gentle Pomodoro Rhythm",
    title: "Work in focused sprints, rest with intention",
    paragraph:
      "Alternate between deep focus and mindful breaks. Stay productive, not drained.",
    image: solutionTwo,
  },
  {
    badge: "Mood-Aware Productivity",
    title: "Check in with how you feel",
    paragraph:
      "Your energy matters. Use mood check-ins and mini-frogs to stay aligned, even on tough days.",
    image: solutionThree,
  },
  {
    badge: "Gentle Progress Tracking",
    title: "Reflect, log, and grow your focus",
    paragraph:
      "See streaks, your completed Frogs, and your focus blooms, because every small win counts.",
    image: solutionFour,
  },
];
