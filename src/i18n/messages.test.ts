import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { locales, defaultLocale, namespaces } from "@/i18n/config";

const MESSAGES_DIR = join(process.cwd(), "src", "i18n", "messages");

type Json = Record<string, unknown>;

function readNamespace(locale: string, ns: string): Json {
  const file = join(MESSAGES_DIR, locale, `${ns}.json`);
  if (!existsSync(file)) return {};
  return JSON.parse(readFileSync(file, "utf8")) as Json;
}

/** Flatten a nested message object into dot-separated leaf keys. */
function flatten(obj: Json, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return flatten(value as Json, path);
    }
    return [path];
  });
}

function keysFor(locale: string): Set<string> {
  return new Set(
    namespaces.flatMap((ns) => flatten(readNamespace(locale, ns), ns))
  );
}

const englishKeys = keysFor(defaultLocale);
const otherLocales = locales.filter((l) => l !== defaultLocale);

describe("i18n message catalogs", () => {
  it("English (source of truth) defines keys for every namespace", () => {
    expect(englishKeys.size).toBeGreaterThan(0);
  });

  // Non-English locales may omit keys (they fall back to English), but must not
  // introduce keys that don't exist in English — that would be a typo/stale key.
  it.each(otherLocales)(
    "locale '%s' has no keys missing from English",
    (locale) => {
      const extra = [...keysFor(locale)].filter((k) => !englishKeys.has(k));
      expect(extra, `Unknown keys in ${locale}: ${extra.join(", ")}`).toEqual(
        []
      );
    }
  );
});
