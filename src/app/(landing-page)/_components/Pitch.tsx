"use client";
// import Image from "next/image";
// {/* Visual or Highlight Box */}
//     <div className="relative">
//       <div className="bg-white/30 backdrop-blur-xl rounded-3xl p-8 shadow-lg ring-1 ring-white/20">
//         <Image
//           src="/svgs/pitch-illustration.svg"
//           alt="Productivity tools illustration"
//           width={400}
//           height={400}
//           className="w-full h-auto"
//         />
//       </div>
//     </div>

import AOS from "aos";
import { AlertCircle, Zap, EyeOff, Sun, BarChart2, Layers } from "lucide-react";
import Link from "next/link";
import Accordion from "@/components/ui/Accordion";
import { useEffect } from "react";

const Pitch = () => {
  useEffect(() => {
    AOS.init({ once: true, duration: 600 });
  }, []);

  return (
    <section
      id="pitch"
      className="py-14 md:py-16 px-6 bg-light-background text-walnut-brown rounded-4xl"
    >
      <div className="max-w-5xl mx-auto space-y-8">
        {/* 1. Headline + Subtext */}
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl lg:4xl font-sora font-semibold">
            Why FocusPond is Different
          </h2>
          <p className="mt-4 font-manrope text-base/7 text-walnut-brown/90 md:text-lg/7">
            FocusPond pairs the “Eat The Frog” method with gentle Pomodoro
            sprints, so you can tackle your biggest, hardest tasks first without
            burning out. Below, see exactly how we solve each frustration that
            keeps you stuck.
          </p>

          <div className="mt-6">
            <Link
              href="/signup"
              className="font-sora font-medium hover:underline text-base"
            >
              Ready to tackle your first Frog? Start free today →
            </Link>
          </div>
        </div>

        {/* Small‐screen Accordion (shown on sm only) */}
        <div className="block md:hidden space-y-4">
          <Accordion
            title="Procrastination & Overwhelm"
            icon={<AlertCircle className="w-6 h-6" />}
          >
            {/* Pain Description */}
            <p className="mt-3 font-manrope text-sm/7 text-walnut-brown/80 leading-relaxed">
              Users know they should tackle their hardest task, but it often
              feels confusing or scary so they delay getting started.
            </p>
            {/* Solution Explanation */}
            <p className="mt-3 font-manrope text-sm/7 text-walnut-brown/90">
              <strong>How FocusPond fixes it:</strong> On login, pick your
              “Frog” (your single most important & difficult task). Then jump
              into a guided 25-minute Pomodoro sprint on that Frog, bundling the
              big scary job into one short focus block so you actually get
              started instead of endlessly delaying.
            </p>
          </Accordion>
          <Accordion
            title="Low Energy & Inconsistent Motivation"
            icon={<Zap className="w-6 h-6" />}
          >
            {/* Pain Description */}
            <p className="mt-3 font-manrope text-sm/7 text-walnut-brown/80 leading-relaxed">
              Even when users want to focus, they wake up tired or hit midday
              slumps and then feel guilty for “wasting” the day.
            </p>
            {/* Solution Explanation */}
            <p className="mt-3 font-manrope text-sm/7 text-walnut-brown/90">
              <strong>How FocusPond fixes it:</strong> Toggle into{" "}
              <strong>Mini-Frog Mode</strong> on low-energy days, complete any
              small task to preserve your streak, rather than forcing the big
              Frog. Plus, tag tasks as High/Medium/Low energy and get smart
              suggestions matching how you feel, so you always have a clear next
              step.
            </p>
          </Accordion>
          <Accordion
            title="Burnout & Unsustainable Routines"
            icon={<Sun className="w-6 h-6" />}
          >
            {/* Pain Description */}
            <p className="mt-3 font-manrope text-sm/7 text-walnut-brown/80 leading-relaxed">
              Users hit a hot streak, overwork themselves, then crash, often
              resenting “productivity tools” that feel punishing.
            </p>
            {/* Solution Explanation */}
            <p className="mt-3 font-manrope text-sm/7 text-walnut-brown/90">
              <strong>How FocusPond fixes it:</strong> Balanced work/breath
              cycles ensure each Pomodoro is followed by a mindful break, no
              grind culture allowed. Plus, if you miss a Frog, Mini-Frog Mode
              lets you complete a small task to keep your streak alive, no
              shame, just forward momentum.
            </p>
          </Accordion>
          <Accordion
            title="Lack of Insight & No Sense of Progress"
            icon={<BarChart2 className="w-6 h-6" />}
          >
            {/* Pain Description */}
            <p className="mt-3 font-manrope text-sm/7 text-walnut-brown/80 leading-relaxed">
              Users often feel “busy,” but they can’t point to any real results,
              ending the day tired, yet unsure they moved the needle.
            </p>
            {/* Solution Explanation */}
            <p className="mt-3 font-manrope text-sm/7 text-walnut-brown/90">
              <strong>How FocusPond fixes it:</strong> Every Pomodoro and Frog
              completion is logged in your Analytics Dashboard. See your weekly
              focus time, Frog-completion rate, and streak at a glance. Each win
              also earns a tiny “garden bloom” icon, so you visually track
              progress, not just busywork.
            </p>
          </Accordion>
        </div>

        {/* 2. Grid of Pain & Solution Cards Desktop grid (hidden on sm screens)*/}
        <div className="hidden md:grid gap-7 md:grid-cols-2">
          {/* Card #1 */}
          {/* className="bg-[#fffaf3] rounded-2xl shadow-sm p-6 flex flex-col animate-fade-in-up" */}
          <div
            className="bg-[#fffaf3] rounded-2xl shadow-sm p-6 flex flex-col animate-fade-in-up"
            data-aos="fade-up"
          >
            {/* Icon + Title */}
            <div className="flex items-center gap-2">
              {/* Example icon; swap out for a custom Lucide icon */}
              <span className="text-accent-button">
                <AlertCircle className="w-6 h-6" />
              </span>
              <h3 className="font-semibold text-lg">
                Procrastination & Overwhelm
              </h3>
            </div>
            {/* Pain Description */}
            <p className="mt-3 font-manrope text-sm/7 text-walnut-brown/80 leading-relaxed">
              Users know they should tackle their hardest task, but it often
              feels confusing or scary so they delay getting started.
            </p>
            {/* Solution Explanation */}
            <p className="mt-3 font-manrope text-sm/7 text-walnut-brown/90">
              <strong>How FocusPond fixes it:</strong> On login, pick your
              “Frog” (your single most important & difficult task). Then jump
              into a guided 25-minute Pomodoro sprint on that Frog, bundling the
              big scary job into one short focus block so you actually get
              started instead of endlessly delaying.
            </p>
          </div>

          {/* Card #2 */}
          <div
            className="bg-[#fffaf3] rounded-2xl shadow-sm p-6 flex flex-col animate-fade-in-up"
            data-aos="fade-up"
          >
            <div className="flex items-center gap-2">
              <span className="text-accent-button">
                <Zap className="w-6 h-6" />
              </span>
              <h3 className="font-semibold text-lg">
                Low Energy & Inconsistent Motivation
              </h3>
            </div>
            <p className="mt-3 font-manrope text-sm/7 text-walnut-brown/80 leading-relaxed">
              Even when users want to focus, they wake up tired or hit midday
              slumps and then feel guilty for “wasting” the day.
            </p>
            <p className="mt-3 font-manrope text-sm/7 text-walnut-brown/90">
              <strong>How FocusPond fixes it:</strong> Toggle into{" "}
              <strong>Mini-Frog Mode</strong> on low-energy days, complete any
              small task to preserve your streak, rather than forcing the big
              Frog. Plus, tag tasks as High/Medium/Low energy and get smart
              suggestions matching how you feel, so you always have a clear next
              step.
            </p>
          </div>

          {/* Card #3 */}
          {/* <div
            className="bg-[#fffaf3] rounded-2xl shadow-sm p-6 flex flex-col animate-fade-in-up"
            data-aos="fade-up"
          >
            <div className="flex items-center gap-2">
              <span className="text-accent-button">
                <EyeOff className="w-6 h-6" />
              </span>
              <h3 className="font-semibold text-lg">
                Getting Distracted & Losing Focus
              </h3>
            </div>
            <p className="mt-3 font-manrope text-sm text-walnut-brown/80 leading-relaxed">
              Notifications, wandering thoughts, and endless tabs make sustained
              deep work impossible so tasks never get done.
            </p>
            <p className="mt-3 font-manrope text-sm text-walnut-brown/90">
              <strong>How FocusPond fixes it:</strong> Our Pomodoro timer is
              tied directly to your Frog. Hit “Start” and FocusPond visually
              blocks off 25 minutes so you know exactly when you can break. Then
              during each 5-minute break, the app offers a quick breathing
              exercise or nature sound, no social media rabbit holes allowed, so
              you return to work more focused.
            </p>
          </div> */}

          {/* Card #4 */}
          <div
            className="bg-[#fffaf3] rounded-2xl shadow-sm p-6 flex flex-col animate-fade-in-up"
            data-aos="fade-up"
          >
            <div className="flex items-center gap-2">
              <span className="text-accent-button">
                <Sun className="w-6 h-6" />
              </span>
              <h3 className="font-semibold text-lg">
                Burnout & Unsustainable Routines
              </h3>
            </div>
            <p className="mt-3 font-manrope text-sm/7 text-walnut-brown/80 leading-relaxed">
              Users hit a hot streak, overwork themselves, then crash, often
              resenting “productivity tools” that feel punishing.
            </p>
            <p className="mt-3 font-manrope text-sm/7 text-walnut-brown/90">
              <strong>How FocusPond fixes it:</strong> Balanced work/breath
              cycles ensure each Pomodoro is followed by a mindful break, no
              grind culture allowed. Plus, if you miss a Frog, Mini-Frog Mode
              lets you complete a small task to keep your streak alive, no
              shame, just forward momentum.
            </p>
          </div>

          {/* Card #5 */}
          <div
            className="bg-[#fffaf3] rounded-2xl shadow-sm p-6 flex flex-col animate-fade-in-up"
            data-aos="fade-up"
          >
            <div className="flex items-center gap-2">
              <span className="text-accent-button">
                <BarChart2 className="w-6 h-6" />
              </span>
              <h3 className="font-semibold text-lg">
                Lack of Insight & No Sense of Progress
              </h3>
            </div>
            <p className="mt-3 font-manrope text-sm/7 text-walnut-brown/80 leading-relaxed">
              Users often feel “busy,” but they can’t point to any real results,
              ending the day tired, yet unsure they moved the needle.
            </p>
            <p className="mt-3 font-manrope text-sm/7 text-walnut-brown/90">
              <strong>How FocusPond fixes it:</strong> Every Pomodoro and Frog
              completion is logged in your Analytics Dashboard. See your weekly
              focus time, Frog-completion rate, and streak at a glance. Each win
              also earns a tiny “garden bloom” icon, so you visually track
              progress, not just busywork.
            </p>
          </div>

          {/* Card #6 */}
          {/* <div
            className="bg-[#fffaf3] rounded-2xl shadow-sm p-6 flex flex-col animate-fade-in-up"
            data-aos="fade-up"
          >
            <div className="flex items-center gap-2">
              <span className="text-accent-button">
                <Layers className="w-6 h-6" />
              </span>
              <h3 className="font-semibold text-lg">
                Juggling Too Many Tools & Fragmented Workflow
              </h3>
            </div>
            <p className="mt-3 font-manrope text-sm text-walnut-brown/80 leading-relaxed">
              Many users juggle separate apps for to-dos, timers, habit
              tracking, and meditation, wasting time switching contexts.
            </p>
            <p className="mt-3 font-manrope text-sm text-walnut-brown/90">
              <strong>How FocusPond fixes it:</strong> FocusPond is your
              all-in-one hub: tasks (with Frog tagging), Pomodoro timer,
              Mini-Frog Mode, habit-style streaks, and mindful break prompts all
              live in a single interface. Click a task → start a timer → see
              your updated status, no more app-hopping, just fluid, gentle
              focus.
            </p>
          </div> */}
        </div>

        {/* 3. Optional Bottom CTA */}
        <div className="text-center mt-12">
          <Link
            href="/signup"
            className="inline-block bg-accent-button text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 transition"
          >
            Start Your First Frog →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Pitch;
