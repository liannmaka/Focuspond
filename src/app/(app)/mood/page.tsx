"use client";

import { useState, useEffect } from "react";
import { BrandLogo } from "@/components/ui";
import { cn, getTimeBasedGreeting } from "@/lib/utils";
import { moodDB } from "@/features/mood/lib/indexedDB";
import { MOODS, Mood } from "@/features/mood/constants/moods";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function MoodCheckIn() {
  const t = useTranslations("mood");
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [greeting, setGreeting] = useState("");

  const router = useRouter();

  useEffect(() => {
    const period = getTimeBasedGreeting();
    setGreeting(t("question", { period: t(`periods.${period}`) }));
  }, [t]);

  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood);
  };

  const handleMoodSubmit = async () => {
    if (!selectedMood) {
      toast.error(t("toast.selectError"));
      return;
    }

    setIsLoading(true);

    try {
      await moodDB.add({
        level: selectedMood.level,
        label: selectedMood.label,
        energyLevel: selectedMood.energyLevel,
      });

      const moodLabel = selectedMood.id
        ? t(`moods.${selectedMood.id}.label`)
        : selectedMood.label;

      toast.success(t("toast.saved"), {
        description: t("toast.savedDescription", {
          mood: moodLabel.toLowerCase(),
        }),
        duration: 2000,
      });

      router.push("/home/all");
    } catch (error) {
      console.error("Failed to save mood:", error);

      if (error instanceof Error) {
        if (error.name === "QuotaExceededError") {
          toast.error(t("toast.storageFull"), {
            description: t("toast.storageFullDescription"),
          });
        } else {
          toast.error(t("toast.saveError"), {
            description: t("toast.saveErrorDescription"),
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    router.push("/home/all");
  };

  return (
    // container for mood check-in component
    <div className="bg-surface text-ink grid grid-cols-1 lg:grid-cols-[55%_45%] min-h-screen w-full overflow-hidden">
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
              <span className="text-accent-text">Pond</span>
            </div>
          </div>

          <div className="space-y-6 mt-9">
            <h1 className="font-sora text-3xl sm:text-4xl font-semibold text-center text-ink">
              {t("welcome")}
            </h1>
            <div className="text-center space-y-5">
              <p className="font-manrope text-sm sm:text-base text-ink-muted">
                {t("intro")}
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
                aria-pressed={isSelected}
                className={cn(
                  "w-full p-4 md:p-5 rounded-2xl cursor-pointer text-left items-center md:flex",
                  "border-2 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
                  isSelected
                    ? "scale-[1.02] shadow-e2"
                    : "scale-100 border-line bg-surface-raised shadow-e1 hover:translate-x-1"
                )}
                style={
                  isSelected
                    ? {
                        borderColor: mood.colors.accent,
                        backgroundColor: mood.colors.soft,
                      }
                    : undefined
                }
              >
                <div className="md:flex-1 md:text-left text-center">
                  <div
                    className="font-sora text-base font-semibold mb-2"
                    style={
                      isSelected ? { color: mood.colors.accent } : undefined
                    }
                  >
                    {mood.id ? t(`moods.${mood.id}.label`) : mood.label}
                  </div>
                  <div className="font-manrope text-ink-muted text-[13px]">
                    {mood.id
                      ? t(`moods.${mood.id}.description`)
                      : mood.description}
                  </div>
                </div>
                {isSelected && (
                  <div
                    className="w-6 h-6 shrink-0 rounded-full hidden md:flex justify-center items-center text-[13px] font-semibold text-surface-raised"
                    style={{ backgroundColor: mood.colors.accent }}
                    aria-hidden
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
              "relative overflow-hidden font-medium group w-full max-w-sm mx-auto mb-6 p-4 transition-all duration-300 ease-in-out font-sora bg-accent border-none rounded-lg text-base text-accent-ink shadow-e2 cursor-pointer hover:bg-accent-hover hover:-translate-y-0.5 hover:shadow-e3",
              (!selectedMood || isLoading) && "opacity-50 pointer-events-none"
            )}
          >
            <span className="relative z-10">
              {isLoading ? t("saving") : t("continue")}
            </span>
            <span className="absolute inset-0 animate-shimmer bg-linear-to-r from-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
          <button
            onClick={handleSkip}
            className="bg-transparent text-ink-muted border-none font-medium text-[13px] cursor-pointer font-sora transition-colors duration-300 ease-in-out hover:text-ink"
          >
            <span>{t("skip")}</span>
          </button>
        </div>
      </div>

      {/* right column */}
      <div className="hidden lg:block sticky top-0 h-screen">
        <div
          className="h-full rounded-l-[60px] flex items-center justify-center relative overflow-hidden bg-surface-sunken transition-colors duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={
            selectedMood
              ? { backgroundColor: selectedMood.colors.soft }
              : undefined
          }
        >
          {/* The drop lands where the mood does — ripples read out from centre. */}
          <div
            className="ripple-field pointer-events-none absolute inset-0 [--ripple-origin:50%_50%]"
            aria-hidden
          />

          {selectedMood ? (
            <div className="relative z-10 flex flex-col items-center">
              <div
                className="mood-float grid size-70 place-items-center rounded-full"
                style={{
                  backgroundColor: `color-mix(in oklch, ${selectedMood.colors.accent} 12%, transparent)`,
                }}
              >
                {/* Placeholder until the mood Lotties exist — see
                    public/lotties/ and the `animation` field on each MOOD. */}
                <span
                  className="text-[7rem] leading-none"
                  aria-hidden
                >
                  {selectedMood.emoji}
                </span>
              </div>

              <div className="mt-10 text-center">
                <p
                  className="font-sora text-2xl font-semibold"
                  style={{ color: selectedMood.colors.accent }}
                >
                  {selectedMood.id
                    ? t(`moods.${selectedMood.id}.label`)
                    : selectedMood.label}
                </p>
                <p className="mt-1.5 font-manrope text-sm text-ink-muted">
                  {selectedMood.id
                    ? t(`moods.${selectedMood.id}.description`)
                    : selectedMood.description}
                </p>
              </div>
            </div>
          ) : (
            <div className="relative z-10 flex flex-col items-center text-center">
              <span
                className="mood-float grid size-70 place-items-center rounded-full bg-ambient-soft text-[7rem] leading-none"
                aria-hidden
              >
                🐸
              </span>
              <p className="mt-10 font-sora text-lg font-medium text-ink-muted">
                {t("selectPrompt")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
