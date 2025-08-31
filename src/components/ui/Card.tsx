import clsx from "clsx";
import { forwardRef } from "react";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  shadow?: "none" | "sm" | "md" | "lg";
  rounded?: "none" | "2xl" | "3xl";
  children: React.ReactNode;
  className?: string;
};

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ shadow = "sm", rounded = "2xl", children, className, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          "p-4 transition duration-200",
          shadow !== "none" && `shadow-${shadow}`,
          rounded !== "none" && `rounded-${rounded}`,
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
