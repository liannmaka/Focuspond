"use client";

import { useState, useEffect } from "react";
import { BrandLogo } from "@/components/ui";
import { cn, getTimeBasedQuestion } from "@/lib/utils";
import { moodDB } from "@/lib/config/indexedDB";
import { MOODS, Mood } from "@/constants/moods";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function MoodCheckIn() {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [greeting, setGreeting] = useState("How are you feeling today?");

  const router = useRouter();

  useEffect(() => {
    const question = getTimeBasedQuestion();
    setGreeting(question);
  }, []);

  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood);
  };

  const handleMoodSubmit = async () => {
    if (!selectedMood) {
      toast.error("Please select a mood");
      return;
    }

    setIsLoading(true);

    try {
      await moodDB.add({
        level: selectedMood.level,
        label: selectedMood.label,
        energyLevel: selectedMood.energyLevel,
      });

      toast.success("Mood saved!", {
        description: `You're feeling ${selectedMood?.label.toLowerCase()} today`,
        duration: 2000,
      });

      router.push("/dashboard/today");
    } catch (error) {
      console.error("Failed to save mood:", error);

      if (error instanceof Error) {
        if (error.name === "QuotaExceededError") {
          toast.error("Storage full", {
            description: "Please clear some browser data and try again",
          });
        } else {
          toast.error("Couldn't save mood", {
            description: "Don't worry, you can continue anyway",
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    router.push("/dashboard/today");
  };

  return (
    // container for mood check-in component
    <div className="bg-base-background text-dark-accent grid grid-cols-1 lg:grid-cols-[55%_45%] min-h-screen w-full overflow-hidden">
      {/* left column */}
      <div className="flex flex-col items-center pb-12 pt-8 md:pt-14 px-8 overflow-y-auto max-h-screen hide-scrollbar">
        <div>
          {/* logo and appname */}
          <div className="hidden lg:flex items-center mb-9">
            <div className="-ml-4">
              <BrandLogo />
            </div>
            <div className="font-sora text-2xl font-semibold tracking-tight -ml-2 pt-1">
              <span>Focus</span>
              <span className="text-accent-button">Pond</span>
            </div>
          </div>

          <div className="space-y-6 mt-9">
            <h1 className="font-sora text-3xl sm:text-4xl font-semibold text-center text-dark-accent/95">
              Welcome to Focuspond!
            </h1>
            <div className="text-center space-y-5">
              <p className="font-manrope text-sm sm:text-base text-dark-accent/70">
                Let&apos;s start with a quick mood check-in
              </p>

              <p className="font-sora text-xl sm:text-2xl font-medium">
                {greeting}
              </p>
            </div>
          </div>
        </div>
        {/* Mood Buttons */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 px-6 sm:px-10 max-w-[20rem] sm:max-w-160 mx-auto w-full">
          {MOODS.map((mood) => {
            const isSelected = selectedMood?.id === mood.id;
            return (
              <button
                key={mood.id}
                onClick={() => handleMoodSelect(mood)}
                className={cn(
                  "w-full p-4 md:p-5 rounded-2xl cursor-pointer text-left items-center md:flex",
                  !isSelected && ["hover:translate-x-1"],
                  isSelected ? "scale-[1.02]" : "scale-100"
                )}
                style={{
                  border: isSelected
                    ? `2.5px solid ${mood.colors.dark}`
                    : "2px solid rgba(255, 229, 180, 0.4)",
                  backgroundColor: isSelected
                    ? `${mood.colors.light}40`
                    : "white",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform:
                    selectedMood?.id === mood.id ? "scale(1.02)" : "scale(1)",
                  boxShadow: isSelected
                    ? `0 8px 24px ${mood.colors.dark}30`
                    : "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                <div className="md:flex-1 md:text-left text-center">
                  <div
                    className="font-sora text-base font-semibold mb-2"
                    style={{
                      color: isSelected ? mood.colors.dark : "#8B5E3C",
                    }}
                  >
                    {mood.label}
                  </div>
                  <div className="font-manrope text-dark-accent/70 text-[13px]">
                    {mood.description}
                  </div>
                </div>
                {isSelected && (
                  <div
                    className="w-6 h-6 rounded-full hidden md:flex justify-center items-center text-white text-[13px] font-semibold"
                    style={{
                      backgroundColor: mood.colors.dark,
                    }}
                  >
                    ✓
                  </div>
                )}
              </button>
            );
          })}
        </div>
        {/* Action Buttons */}
        <div className="mt-14 flex flex-col w-full">
          <button
            onClick={handleMoodSubmit}
            disabled={!selectedMood || isLoading}
            className={cn(
              "relative overflow-hidden font-medium group w-full max-w-sm mx-auto mb-6 p-4 transition-all duration-300 ease-in-out font-sora bg-accent-button border-none rounded-lg text-base text-white cursor-pointer hover:-translate-y-0.5 hover:shadow-lg focus:outline-none",
              (!selectedMood || isLoading) &&
                "bg-accent-button/70 cursor-not-allowed"
            )}
            style={{
              boxShadow: "0 4px 16px rgba(255, 148, 114, 0.3)",
            }}
          >
            <span className="relative z-10">
              {isLoading ? "Saving..." : "Continue"}
            </span>
            <span className="absolute inset-0 animate-shimmer bg-linear-to-r from-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
          <button
            onClick={handleSkip}
            className="bg-transparent text-dark-accent border-none font-medium text-[13px] cursor-pointer font-sora opacity-60 transition-opacity duration-300 ease-in-out hover:opacity-100"
          >
            <span>Skip for now →</span>
          </button>
        </div>
      </div>

      {/* right column */}
      <div className="hidden lg:block sticky top-0 h-screen">
        <div
          className="h-full rounded-l-[60px] flex items-center justify-center relative overflow-hidden"
          style={{
            backgroundColor: selectedMood
              ? selectedMood.colors.light
              : "#F5F5F0",
            transition: "background 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {selectedMood ? (
            <div>
              {/* Decorative gradient overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `radial-gradient(circle at 50% 50%, ${selectedMood.colors.dark}20 0%, transparent 70%)`,
                  transition: "background 0.6s ease",
                }}
              />

              {/* Lottie Animation */}
              <div
                style={{
                  width: "400px",
                  height: "400px",
                  position: "relative",
                  zIndex: 1,
                  transition: "transform 0.3s ease",
                  animation: "float 3s ease-in-out infinite",
                }}
              >
                <style>
                  {`
              @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-20px); }
              }
            `}
                </style>
                {/* In production, use actual Lottie component:
          <Lottie 
            animationData={selectedMood.animation}
            loop={true}
            autoplay={true}
          /> */}

                {/* Fallback large emoji for demo */}
                <div
                  style={{
                    fontSize: "240px",
                    textAlign: "center",
                    lineHeight: "400px",
                    filter: "drop-shadow(0 10px 40px rgba(0,0,0,0.1))",
                  }}
                >
                  {selectedMood.emoji}
                </div>
              </div>

              {/* Mood label */}
              <div
                className="text-center"
              >
                <div
                  className="font-sora"
                  style={{
                    fontSize: "28px",
                    fontWeight: "600",
                    color: selectedMood.colors.dark,
                    marginBottom: "8px",
                    textShadow: "0 2px 8px rgba(255,255,255,0.8)",
                  }}
                >
                  {selectedMood.label}
                </div>
                <div
                  className="font-manrope"
                  style={{
                    fontSize: "16px",
                    color: selectedMood.colors.emoji,
                    opacity: 0.8,
                  }}
                >
                  {selectedMood.description}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-dark-accent/40">
              <div className="text-6xl mb-4">🐸</div>
              <p className="text-lg font-medium">Select your mood</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
