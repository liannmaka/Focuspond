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
    title: "Reflect, log, and grow your foocus",
    paragraph:
      "See streaks, your completed Frogs, and your focus blooms, because every small win counts.",
    image: "/svgs/solution-4.svg",
  },
];

const StickyScrollBenefits = () => {
  return (
    <>
      <SectionDivider />
      <section>
        <div className="container px-7 mx-auto pt-16 pb-20 space-y-28">
          {benefits.map(
            ({ badge, title, paragraph, image }: Benefit, index: number) => (
              <div
                key={index}
                className="grid lg:grid-cols-2 lg:gap-x-10 gap-y-12 relative overflow-hidden"
              >
                {/* left container */}
                <div>
                  <Badge title={badge} />
                  <h3 className="text-2xl md:text-3xl font-sora font-semibold leading-tight">
                    {title}
                  </h3>
                  <p className="mt-4 font-manrope text-base md:text-lg max-w-md">
                    {paragraph}
                  </p>
                </div>

                {/* right container */}
                <div className="relative w-fit mx-auto md:pr-0">
                  <div className="hidden md:block absolute top-1/2 -translate-y-1/2 translate-x-[50%] h-[120%] w-[60vw] right-0 bg-[#fff0e8] rounded-l-3xl rounded-br-3xl z-0" />
                  <div className="relative z-10">
                    <Image
                      src={image}
                      alt={title}
                      width={400}
                      height={300}
                    />
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        {/* <div class="relative size-32 ...">
  <div class="absolute top-0 right-0 size-16 ...">03</div>
</div> */}
      </section>
    </>
  );
};

export default StickyScrollBenefits;
