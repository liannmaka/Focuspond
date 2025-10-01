"use client";

import clsx from "clsx";
import { Badge, Card } from "@/components/ui";
import { waitlist } from "@/data/landing-page/waitlist";
import { FormEvent, useState } from "react";

export default function WaitlistPage() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("joining waitlist", email);
    // hook into backend or email service
  };
  return (<div>
    <div className="max-w-xs mx-auto">
      <div className="text-center mb-6">
        <Badge title="Join the Waitlist" />
        <h1 className="text-3xl font-bold font-sora">Focus deeply. Rest intentionally.</h1>
        <p className="my-3 font-manrope text-sm">Be the first to experience FocusPond when we launch.</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="text-xs flex w-full rounded-full overflow-hidden border border-light-background/40 bg-secondary-accent/10 font-sora">
          <input type="email" placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="flex-1 px-4 py-3 text-gray-700 focus:outline-none" />
          <button type="submit" className="cursor-pointer bg-accent-button px-4 py-2.5 rounded-full m-2 text-white relative overflow-hidden font-medium group ring-4 ring-base-background shadow"> <span className="relative z-10">Join Waitlist</span>
            <span className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" /></button>
        </div>
      </form>
    </div>
    <div className="mt-20 grid sm:grid-cols-3 gap-6">
      {waitlist.map(
        (
          { Icon, benefit },
          index: number
        ) => {

          return (
            <Card
              key={index}
              rounded="2xl"
              shadow="md"
              className={clsx(
                "border border-light-background/40 relative hover:shadow-lg bg-white/80"
              )}
            >
              <div className={"absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-accent-button p-3 ring-4 ring-base-background shadow"}>
                <Icon className={clsx("w-3 h-3 text-white")} />
              </div>
              <p className="mt-3 px-3 font-bold text-sm font-manrope leading-relaxed text-center">
                {benefit}
              </p>
            </Card>
          );
        }
      )}
    </div>
  </div>);
}
