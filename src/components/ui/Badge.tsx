import { cn } from "@/lib/utils";

type BadgeProps = {
  title: string;
  className?: string;
};

/**
 * Section eyebrow. Renders a <span>, not a heading — this used to emit an <h2>
 * on every marketing section, which injected phantom levels into the document
 * outline and confused screen-reader navigation.
 */
const Badge = ({ title, className }: BadgeProps) => (
  <div className={cn(className)}>
    <span className="badge">{title}</span>
  </div>
);

export default Badge;
