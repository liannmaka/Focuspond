import { LucideIcon } from "lucide-react";
export interface NavLink {
  href: string;
  linkLabel: string;
  Icon: LucideIcon;
}

export interface FaqData {
  question: string;
  answer: string;
}

export interface Feature {
  Icon: LucideIcon;
  iconColor: string;
  title: string;
  description: string;
}

export interface FooterNavLinks {
  href: string;
  linkLabel: string;
}

export interface Benefit {
  title: string;
  paragraph: string;
  badge: string;
  image: string;
}

export interface HowItWork {
  Icon: LucideIcon;
  title: string;
  description: string;
}

export interface WhoitsFor {
  id: string;
  label: string;
  headline: string;
  bullets: string[];
  image: string;
}

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
}
