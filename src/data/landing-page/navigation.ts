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
  { href: "/mood", key: "getStarted" },
];
