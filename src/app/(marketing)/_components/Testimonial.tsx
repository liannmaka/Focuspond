"use client";

import useMeasure from "react-use-measure";
import { animate, motion, useMotionValue } from "framer-motion";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui";
import { testimonials } from "@/data/landing-page/testimonial";
import { useTranslations } from "next-intl";

const Testimonial = () => {
  const t = useTranslations("marketing.testimonials");
  const FAST_SPEED = 15;
  const SLOW_SPEED = 80;

  const [ref, { width }] = useMeasure();
  const xTranslation = useMotionValue(0);

  const [duration, setDuration] = useState<number>(FAST_SPEED);
  const [mustFinish, setMustFinish] = useState<boolean>(false);
  const [rerender, setRerender] = useState<boolean>(false);

  // Detect if the primary pointer is "coarse" (touchscreen)
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: coarse)");

    const handleChange = () => {
      const coarse = mediaQuery.matches;
      setIsTouchDevice(coarse);

      // On touch devices, always use slow speed
      setDuration(coarse ? SLOW_SPEED : FAST_SPEED);
    };

    // Initialize
    handleChange();

    // Listen for changes (e.g. if user switches input modes — rare but possible)
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  // Animation
  useEffect(() => {
    let controls;
    const finalPosition = -width / 2 - 6;

    if (mustFinish) {
      controls = animate(xTranslation, [xTranslation.get(), finalPosition], {
        ease: "linear",
        duration: duration * (1 - xTranslation.get() / finalPosition),
        onComplete: () => {
          setMustFinish(false);
          setRerender(!rerender);
        },
      });
    } else {
      controls = animate(xTranslation, [0, finalPosition], {
        ease: "linear",
        duration: duration, // Adjust speed
        repeat: Infinity,
        repeatType: "loop",
        // repeatDelay: 0,
      });
    }

    return controls?.stop;
  }, [xTranslation, width, duration, rerender, mustFinish]);

  // Duplicate testimonials to create seamless infinite loop
  const scrollingTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="relative py-24 bg-ambient/8 overflow-hidden">
      <div className="content-center grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Column: Title + Description */}
        <div>
          <Badge title={t("badge")} />
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-sora font-semibold leading-tight text-darker-accent">
            {t("title")}
          </h2>
          <p className="paragraph-for-gb max-w-md text-wrap">{t("subtitle")}</p>
        </div>
        {/* Right Column: Sliding Testimonials */}
        <div className="relative overflow-hidden w-full">
          <motion.div
            className="flex gap-6 my-4 w-max"
            ref={ref}
            style={{ x: xTranslation }}
            // Desktop: Hover to slow down
            onHoverStart={
              !isTouchDevice
                ? () => {
                    setMustFinish(true);
                    setDuration(SLOW_SPEED);
                  }
                : undefined
            }
            onHoverEnd={
              !isTouchDevice
                ? () => {
                    setMustFinish(true);
                    setDuration(FAST_SPEED);
                  }
                : undefined
            }
          >
            {scrollingTestimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="card"
              >
                <p className="text-sm leading-relaxed text-darker-accent/90">
                  “{t(`items.${testimonial.key}.quote`)}”
                </p>

                <div className="flex items-center gap-3 mt-6">
                  {/* Placeholder Avatar */}
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-ambient/45 to-accent/45" />
                  <div className="text-sm">
                    <div className="font-semibold text-darker-accent">
                      {t(`items.${testimonial.key}.name`)}
                    </div>
                    <div className="text-xs text-darker-accent/70">
                      {t(`items.${testimonial.key}.role`)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
