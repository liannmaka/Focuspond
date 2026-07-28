import { forwardRef, HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva("transition-shadow duration-200", {
  variants: {
    surface: {
      /** Sits on the page ground. The default card. */
      raised: "bg-surface-raised border border-line text-ink",
      /** Recessed well — use for inputs, code, quiet groupings. */
      sunken: "bg-surface-sunken border border-line text-ink",
      /** Structure only, no fill. */
      outline: "bg-transparent border border-line text-ink",
      /** Caller supplies its own background. */
      none: "",
    },
    elevation: {
      none: "",
      e1: "shadow-e1",
      e2: "shadow-e2",
      e3: "shadow-e3",
    },
    rounded: {
      none: "",
      lg: "rounded-lg",
      xl: "rounded-xl",
      "2xl": "rounded-2xl",
      "3xl": "rounded-3xl",
    },
    padding: {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    },
  },
  defaultVariants: {
    surface: "raised",
    elevation: "e1",
    rounded: "2xl",
    padding: "sm",
  },
});

type CardProps = Omit<HTMLAttributes<HTMLDivElement>, "color"> &
  VariantProps<typeof cardVariants>;

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { surface, elevation, rounded, padding, className, children, ...rest },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({ surface, elevation, rounded, padding }),
          className
        )}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export { cardVariants };
export default Card;
