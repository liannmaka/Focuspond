import { LOCALE_COOKIE, type Locale } from "@/i18n/config";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

/**
 * Persist the reader's chosen locale in a cookie. It's read back server-side in
 * `src/i18n/request.ts` on the next request/refresh, so the language survives
 * reloads and the first paint renders in the chosen vibe (no flash).
 */
export function setLocaleCookie(locale: Locale): void {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${ONE_YEAR_SECONDS}; samesite=lax`;
}
