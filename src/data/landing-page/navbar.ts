import { NavLink } from "@/types/landing-page";
import { LayoutGrid, PlayCircle, Lightbulb, HelpCircle } from "lucide-react";

export const navLinks: NavLink[] = [
  {
    href: "#features",
    linkLabel: "Features",
    Icon: LayoutGrid,
  },
  {
    href: "#how-it-works",
    linkLabel: "How It Works",
    Icon: PlayCircle,
  },
  {
    href: "#benefits",
    linkLabel: "Why FocusPond?",
    Icon: Lightbulb,
  },
  {
    href: "#faq",
    linkLabel: "FAQs",
    Icon: HelpCircle,
  },
];
