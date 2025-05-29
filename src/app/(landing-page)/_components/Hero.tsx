import Image from "next/image";
import Link from "next/link";

const Hero: React.FC = () => {
  return (
    <section className="relative py-14 md:px-6 overflow-hidden min-h-[calc(100vh-69px)] flex items-center justify-center">
      <div className="max-w-7xl grid md:grid-cols-2 gap-12 items-center h-full">
        {/* Text Section */}
        <div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-sora font-semibold leading-tight">
            Crush your goals, not your energy.
          </h1>
          <p className="font-manrope font-normal mt-6 text-md md:text-lg text-[#8b5e3c]/80 max-w-md">
            Turn your low-energy days into consistent wins with focused, mindful
            progress.
          </p>
          <div className="mt-8 flex space-x-4 font-sora">
            <Link
              href="/signup"
              className="bg-[#ff9472] text-white font-semibold px-6 py-3 rounded-lg tracking-wider shadow-md hover:scale-[1.02] transition hidden sm:inline-block hover:brightness-110"
            >
              Start free
            </Link>
            <Link
              href="/signup"
              className="sm:hidden p-2 rounded-md bg-[#ff9472] text-white group"
              title="Get started for free"
              aria-label="Get started for free"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 transform transition-transform duration-200 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>

            <Link
              href="#how-it-helps"
              className="text-sm md:text-base font-medium hover:underline"
            >
              Learn More →
            </Link>
          </div>
        </div>

        {/* Visual Section */}
        <div className="relative">
          <div className="bg-white/30 backdrop-blur-lg rounded-3xl p-8 shadow-lg ring-1 ring-white/10">
            <Image
              src="/svgs/undraw.svg"
              alt="Hero illustration"
              width={400}
              height={400}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
