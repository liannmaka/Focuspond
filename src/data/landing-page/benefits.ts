import { Benefit } from "@/types/landing-page";
import solutionOne from "../../../public/svgs/solution-1.svg";
import solutionTwo from "../../../public/svgs/solution-2.svg";
import solutionThree from "../../../public/svgs/solution-3.svg";
import solutionFour from "../../../public/svgs/solution-4.svg";

// Copy lives in `marketing.benefits.items.<key>` in the message catalogs.
export const benefits: Benefit[] = [
  { key: "focus-first", image: solutionOne },
  { key: "pomodoro-rhythm", image: solutionTwo },
  { key: "mood-aware", image: solutionThree },
  { key: "progress-tracking", image: solutionFour },
];
