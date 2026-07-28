/**
 * Central locale configuration for FocusPond's i18n ("Vibe Switcher").
 *
 * One unified locale axis: English is the calm default, Nigerian Pidgin carries
 * the relaxed vibe, and the rest are localization/inclusion. Locale codes are
 * BCP-47 so they map directly onto the <html lang> attribute.
 */

export const locales = ["en", "pcm", "ig", "yo", "ha", "fr"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/**
 * Message namespaces, each a JSON file per locale
 * (`src/i18n/messages/{locale}/{namespace}.json`). Add new surfaces here as the
 * app grows; the loader merges them into one message tree per request.
 */
export const namespaces = [
  "common",
  "nav",
  "marketing",
  "mood",
  "tasks",
] as const;

export type Namespace = (typeof namespaces)[number];

/** Cookie that persists the reader's chosen locale (read server-side to avoid a flash). */
export const LOCALE_COOKIE = "NEXT_LOCALE";

export interface LanguageConfig {
  /** BCP-47 code, also the messages folder name and <html lang> value. */
  code: Locale;
  /** English display name. */
  name: string;
  /** Endonym — how the language names itself; used as the switcher label. */
  nativeName: string;
  /** On-brand "Vibe Switcher" descriptor shown alongside select locales. */
  vibeLabel?: string;
}

/** Drives the LanguageSwitcher dropdown (nativeName is the label). */
export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  { code: "en", name: "English", nativeName: "English", vibeLabel: "Calm" },
  {
    code: "pcm",
    name: "Nigerian Pidgin",
    nativeName: "Naijá",
    vibeLabel: "Relaxed",
  },
  { code: "ig", name: "Igbo", nativeName: "Igbo" },
  { code: "yo", name: "Yoruba", nativeName: "Yorùbá" },
  { code: "ha", name: "Hausa", nativeName: "Hausa" },
  { code: "fr", name: "French", nativeName: "Français" },
];

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}
