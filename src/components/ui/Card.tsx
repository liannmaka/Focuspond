import clsx from "clsx";
import { forwardRef } from "react";

const shadowClasses = {
  none: "",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
} as const;

type Shadow = keyof typeof shadowClasses;

const roundedClasses = {
  none: "",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
} as const;

type Rounded = keyof typeof roundedClasses;

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  shadow?: Shadow;
  rounded?: Rounded;
};

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ shadow = "sm", rounded = "2xl", className, children, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          "p-4 transition-shadow duration-200",
          shadowClasses[shadow],
          roundedClasses[rounded],
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

export default Card;
