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
