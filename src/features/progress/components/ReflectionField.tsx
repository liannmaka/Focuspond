"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";

import { useReflection } from "../hooks/useProgress";

/**
 * The day's-end note: one field, saved when you click away.
 *
 * No Save button on purpose. The promise is "end your day calmly by noting
 * your wins" — asking someone to write a sentence and then press a button to
 * keep it is one ceremony more than the sentence deserves.
 *
 * The textarea is uncontrolled-ish: local state while typing, seeded from the
 * stored note. It deliberately does **not** reseed on every live-query update,
 * because a write triggers one, and overwriting the box mid-sentence with what
 * is on disk is how editing loses characters.
 */
export default function ReflectionField() {
  const t = useTranslations("progress.reflection");
  const { note, save } = useReflection();

  const [value, setValue] = useState("");
  const [saved, setSaved] = useState(false);
  // Seeded once, when the stored note first arrives. `undefined` is "still
  // loading" — seeding from it would blank a real note on first blur.
  const seeded = useRef(false);

  useEffect(() => {
    if (seeded.current || note === undefined) return;

    seeded.current = true;
    setValue(note);
  }, [note]);

  const commit = async () => {
    if (note !== undefined && value.trim() === note.trim()) return;

    await save(value);
    setSaved(true);
  };

  return (
    <section className="rounded-xl border border-line bg-surface-raised p-5 md:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="font-sora text-base font-semibold tracking-[-0.01em] text-ink">
          {t("heading")}
        </h2>
        {saved && (
          <p
            role="status"
            className="flex items-center gap-1.5 font-sora text-[11px] font-semibold text-success"
          >
            <Check
              className="size-3"
              aria-hidden
            />
            {t("saved")}
          </p>
        )}
      </div>

      <p className="mt-1.5 text-xs text-ink-subtle">{t("hint")}</p>

      <textarea
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
          setSaved(false);
        }}
        onBlur={() => void commit()}
        rows={3}
        aria-label={t("heading")}
        placeholder={t("placeholder")}
        className="mt-3 w-full resize-y rounded-lg border border-line bg-surface px-3 py-2.5 text-sm leading-relaxed text-ink outline-none placeholder:text-ink-subtle focus-visible:border-accent"
      />
    </section>
  );
}
