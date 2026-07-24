import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import {
  defaultLocale,
  isLocale,
  LOCALE_COOKIE,
  namespaces,
  type Locale,
} from "@/i18n/config";

type MessageTree = Record<string, unknown>;

/** Deep-merge `override` onto `base` (override wins; missing keys fall back to base). */
function deepMerge(base: MessageTree, override: MessageTree): MessageTree {
  const out: MessageTree = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const existing = out[key];
    if (
      existing &&
      value &&
      typeof existing === "object" &&
      typeof value === "object" &&
      !Array.isArray(existing) &&
      !Array.isArray(value)
    ) {
      out[key] = deepMerge(existing as MessageTree, value as MessageTree);
    } else {
      out[key] = value;
    }
  }
  return out;
}

/** Load and merge every namespace file for a locale; missing files are skipped. */
async function loadMessages(locale: Locale): Promise<MessageTree> {
  const entries = await Promise.all(
    namespaces.map(async (ns) => {
      try {
        // Relative path (not the @/ alias) so the bundler can build the
        // dynamic-import context for every locale/namespace JSON file.
        const mod = await import(`./messages/${locale}/${ns}.json`);
        return [ns, mod.default as MessageTree] as const;
      } catch {
        // Namespace not yet translated for this locale — English fills the gap.
        return [ns, {} as MessageTree] as const;
      }
    })
  );
  return Object.fromEntries(entries);
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const requested = cookieStore.get(LOCALE_COOKIE)?.value;
  const locale: Locale = isLocale(requested) ? requested : defaultLocale;

  // English is the source of truth; deep-merge the active locale on top so any
  // untranslated key gracefully falls back to English.
  const englishMessages = await loadMessages(defaultLocale);
  const localeMessages =
    locale === defaultLocale ? {} : await loadMessages(locale);

  return {
    locale,
    messages: deepMerge(englishMessages, localeMessages),
  };
});
