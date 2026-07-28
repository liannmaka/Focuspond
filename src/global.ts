import type common from "@/i18n/messages/en/common.json";
import type nav from "@/i18n/messages/en/nav.json";
import type marketing from "@/i18n/messages/en/marketing.json";
import type mood from "@/i18n/messages/en/mood.json";
import type tasks from "@/i18n/messages/en/tasks.json";
import type { Locale } from "@/i18n/config";

/**
 * Typed messages for next-intl. English is the source of truth, so the `t()`
 * keys and their shapes are derived from the English namespace files — giving
 * autocomplete and compile-time errors on typos without a codegen step.
 */
type Messages = {
  common: typeof common;
  nav: typeof nav;
  marketing: typeof marketing;
  mood: typeof mood;
  tasks: typeof tasks;
};

declare module "next-intl" {
  interface AppConfig {
    Messages: Messages;
    Locale: Locale;
  }
}
