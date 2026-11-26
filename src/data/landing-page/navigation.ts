import { NavLink, FooterNavLinks } from "@/types/landing-page";
import { LayoutGrid, PlayCircle, Lightbulb, HelpCircle } from "lucide-react";

// Labels live in `marketing.nav.<href>` in the message catalogs.
export const navLinks: NavLink[] = [
  { href: "benefits", Icon: Lightbulb },
  { href: "features", Icon: LayoutGrid },
  { href: "how-it-works", Icon: PlayCircle },
  { href: "faqs", Icon: HelpCircle },
];

// Labels live in `marketing.footer.<key>` in the message catalogs.
export const footerNavLinks: FooterNavLinks[] = [
  { href: "/pricing", key: "pricing" },
  { href: "/contact", key: "contact" },
  // The notify-me list. Reachable from the site at last: it was indexable
  // but unlinked, which is how its copy drifted out of date unnoticed.
  { href: "/waitlist", key: "waitlist" },
  { href: "/mood", key: "getStarted" },
];
