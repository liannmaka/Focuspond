import { SectionDivider } from "@/components/ui";
import { Badge } from "@/components/ui";
import Image from "next/image";

interface Benefit {
  title: string;
  paragraph: string;
  badge: string;
  image: string;
}

const benefits: Benefit[] = [
  {
    badge: "Focus-First Planning",
    title: "Plan your day with intention",
    paragraph:
      "Begin each day by picking your Frog, the one task that truly matters. No clutter. Just calm, focused energy.",
    image: "/svgs/solution-1.svg",
  },
  {
    badge: "Gentle Pomodoro Rhythm",
    title: "Work in focused sprints, rest with intention",
    paragraph:
      "Alternate between deep focus and mindful breaks. Stay productive, not drained.",
    image: "/svgs/solution-2.svg",
  },
  {
    badge: "Mood-Aware Productivity",
    title: "Check in with how you feel",
    paragraph:
      "Your energy matters. Use mood check-ins and mini-frogs to stay aligned, even on tough days.",
    image: "/svgs/solution-3.svg",
  },
  {
    badge: "Gentle Progress Tracking",
    title: "Reflect, log, and grow your focus",
    paragraph:
      "See streaks, your completed Frogs, and your focus blooms, because every small win counts.",
    image: "/svgs/solution-4.svg",
  },
];

const StickyScrollBenefits = () => {
  return (
    <>
      <SectionDivider />
      <section className="pt-14 pb-20 md:space-y-20">
        <div className="px-7 text-center">
          <h2 className="text-3xl md:text-4xl font-sora font-semibold leading-tight mb-10">
            A calm way to stay productive
          </h2>
          <div className="hidden lg:inline-flex space-x-4">
            {benefits.map(({ badge }) => (
              <Badge
                key={badge}
                title={badge}
              />
            ))}
          </div>
        </div>

        {benefits.map(({ badge, title, paragraph, image }, idx) => (
          <div
            key={idx}
            className="relative w-full"
          >
            <div
              className="hidden md:block absolute inset-y-0 right-0 w-[50%] bg-[#fff0e8]
                         rounded-tl-full rounded-bl-full z-0"
              aria-hidden="true"
            />
            <div className="content-center grid gap-y-5 lg:grid-cols-2  lg:gap-x-10 relative z-10">
              {/* Left: Text */}
              <div>
                <Badge title={badge} />
                <h3 className="text-2xl md:text-3xl font-sora font-semibold leading-tight">
                  {title}
                </h3>
                <p className="mt-4 font-manrope text-base md:text-lg text-balance">
                  {paragraph}
                </p>
              </div>
              {/* Right: Image */}
              <div className="flex justify-center">
                <Image
                  src={image}
                  alt={title}
                  width={400}
                  height={300}
                  className="relative"
                />
              </div>
            </div>
          </div>
        ))}
      </section>
    </>
  );
};

export default StickyScrollBenefits;
