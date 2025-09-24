import { NavLink, FooterNavLinks } from "@/types/landing-page";
import { LayoutGrid, PlayCircle, Lightbulb, HelpCircle } from "lucide-react";

export const navLinks: NavLink[] = [
  {
    href: "benefits",
    linkLabel: "Why FocusPond?",
    Icon: Lightbulb,
  },
  {
    href: "features",
    linkLabel: "Features",
    Icon: LayoutGrid,
  },
  {
    href: "how-it-works",
    linkLabel: "How It Works",
    Icon: PlayCircle,
  },
  {
    href: "faqs",
    linkLabel: "FAQs",
    Icon: HelpCircle,
  },
];

export const footerNavLinks: FooterNavLinks[] = [
  {
    href: "/pricing",
    linkLabel: "Pricing",
  },
  {
    href: "/contact",
    linkLabel: "Contact Us",
  },
  {
    href: "/signup",
    linkLabel: "Login or Sign Up",
  },
];
