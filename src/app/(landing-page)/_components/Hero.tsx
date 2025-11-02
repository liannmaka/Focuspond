"use client";

// import clsx from "clsx";
// import heroImage from "../../../../public/lotties/hero-illustration-3.json";
import { BrandLogo, Button } from "@/components/ui";
// import { useLottie } from "lottie-react";
import { ChevronsRight } from "lucide-react";
// import { useEffect, useState } from "react";
import Link from "next/link";

const Hero = () => {
//   const [isLoaded, setIsLoaded] = useState<boolean>(false);

//   const options = { animationData: heroImage, loop: true, autoplay: true };
//   const { View, animationItem } = useLottie(options);

//   useEffect(() => {
//     if (animationItem) setIsLoaded(true);
//   }, [animationItem]);



//  <div className="grid lg:grid-cols-2 lg:gap-12 gap-4 items-center">
//         {/* Text Section */}
//         <div>
//           <h1>Crush your goals, not your energy.</h1>
//           <p className="font-manrope mt-6 text-base sm:text-lg max-w-md">
//             Focuspond is a productivity and wellness web app that helps you stay
//             focused, take mindful breaks, and end your day with calm clarity.
//           </p>
//           <div className="mt-8 flex sm:space-x-4">
//             <Button
//               href="/waitlist"
//               size="lg"
//               aria-label="Sign up for FocusPond"
//               className="relative overflow-hidden font-semibold group"
//             >
//               <span className="relative z-10">Get Early Access</span>
//               <span className="absolute inset-0 animate-shimmer bg-linear-to-r from-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//             </Button>

//             <div className="hidden sm:block">
//               <Button
//                 variant="ghost"
//                 href="#benefits"
//                 size="sm"
//               >
//                 <div className="inline-flex group font-medium hover:underline tracking-wide">
//                   <span>Learn More</span>
//                   <ChevronsRight
//                     aria-hidden="true"
//                     className="size-4 self-center group-hover:translate-x-0.5 will-change-transform transition-transform duration-300"
//                   />
//                 </div>
//               </Button>
//             </div>
//           </div>
//         </div>


//         {/* Visual Section */}
//         <div
//           className={clsx(
//             "md:mb-14 lg:mb-16 relative aspect-146/101 overflow-hidden",
//             !isLoaded && "bg-gray-300/30 rounded-xl mt-8 lg:mt-0"
//           )}
//         >
//           {!isLoaded && <span className="absolute inset-0 animate-shimmer" />}

//           <div
//             className={clsx(
//               "transition-opacity duration-500 w-full h-full",
//               isLoaded ? "opacity-100" : "opacity-0"
//             )}
//           >
//             {View}
//           </div>
//         </div>
//       </div>




  return (
    <section className="hero-section-wrapper content-center pb-5 md:pb-0">
     
{/* testing to be deleted */}
      <div className="flex flex-col items-center justify-center pt-10 pb-32">
          <div className="flex items-center">
          <div className="-ml-4">
            <BrandLogo />
          </div>
          <Link
            href="/"
            className="text-walnut-brown font-sora text-2xl font-semibold tracking-tight -ml-2 pt-1"
            title="Go to the homepage"
            aria-label="Go to the homepage"
          >
            <span>Focus</span>
            <span className="text-accent-button">Pond</span>
          </Link>
        </div>
          <h1 className="text-4xl mt-4 max-w-md mx-auto text-center">Your calm space to plan, focus, and reflect.</h1>
          <p className="font-manrope mt-9 text-base max-w-md">
            Stay centered. Stay creative. Stay kind to your mind.
          </p>
          <div className="mt-5 flex sm:space-x-4">
            <Button
              href="/waitlist"
              size="sm"
              aria-label="Sign up for FocusPond"
              className="relative overflow-hidden font-semibold group"
            >
              <span className="relative z-10">Get Early Access</span>
              <span className="absolute inset-0 animate-shimmer bg-linear-to-r from-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>

            <div className="hidden sm:block">
              <Button
                variant="ghost"
                href="#benefits"
                size="xs"
              >
                <div className="inline-flex group font-medium hover:underline tracking-wide">
                  <span>Learn More</span>
                  <ChevronsRight
                    aria-hidden="true"
                    className="size-4 self-center group-hover:translate-x-0.5 will-change-transform transition-transform duration-300"
                  />
                </div>
              </Button>
            </div>
          </div>
        </div>
    </section>
  );
};

export default Hero;
