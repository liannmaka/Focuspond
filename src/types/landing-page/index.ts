import { LucideIcon } from "lucide-react";

export type FaqItemProp = {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
};
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
