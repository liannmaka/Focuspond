import { LucideIcon } from "lucide-react";

/**
 * Landing-page data types. Human-readable copy lives in the i18n message
 * catalogs (`src/i18n/messages/{locale}/marketing.json`); these types keep only
 * the structural pieces (icons, images, hrefs) plus a stable literal `key`/
 * `href` that maps each item to its translation. Keys are literal unions so the
 * `t(`items.${key}...`)` calls stay type-checked against the message catalog.
 */

export type NavHref = "benefits" | "features" | "how-it-works" | "faqs";

export type FeatureKey =
  | "daily-planner"
  | "focus-timer"
  | "quick-notes"
  | "vibe-switcher"
  | "mood-checkin"
  | "frog-selection"
  | "mindful-breaks"
  | "reflection";

export type BenefitKey =
  "focus-first" | "pomodoro-rhythm" | "mood-aware" | "progress-tracking";

export type HowItWorkKey =
  "check-mood" | "plan-day" | "start-sprint" | "reflect";

export type PersonaKey = "student" | "professional" | "creator" | "well";

export type TestimonialKey = "rita" | "james" | "chiamaka" | "isabel";

export type FaqKey =
  | "what-is"
  | "is-free"
  | "offline"
  | "frog-of-day"
  | "identify-frog"
  | "no-account"
  | "vibe-switcher";

export type FooterNavKey = "pricing" | "contact" | "getStarted";

export interface NavLink {
  /** Section id; also the translation key under `marketing.nav`. */
  href: NavHref;
  Icon: LucideIcon;
}

export interface FaqData {
  /** Translation key under `marketing.faqs.items`. */
  key: FaqKey;
}

export interface Feature {
  Icon: LucideIcon;
  iconColor: string;
  /** Translation key under `marketing.features.items`. */
  key: FeatureKey;
}

export interface FooterNavLinks {
  href: string;
  /** Translation key under `marketing.footer`. */
  key: FooterNavKey;
}

export interface Benefit {
  /** Translation key under `marketing.benefits.items`. */
  key: BenefitKey;
  image: string;
}

export interface HowItWork {
  Icon: LucideIcon;
  /** Translation key under `marketing.howItWorks.items`. */
  key: HowItWorkKey;
}

export interface WhoitsFor {
  /** Persona id; also the translation key under `marketing.whoItsFor.items`. */
  id: PersonaKey;
  image: string;
}

export interface Testimonial {
  /** Translation key under `marketing.testimonials.items`. */
  key: TestimonialKey;
}

export interface Waitlist {
  Icon: LucideIcon;
  benefit: string;
}
