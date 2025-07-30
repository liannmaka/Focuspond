import { LucideIcon } from "lucide-react";

export interface FaqItemProp {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
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
