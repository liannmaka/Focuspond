import clsx from "clsx";
import Link from "next/link";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "outline" | "ghost";
type Size = "xs" | "sm" | "md" | "lg";

type ButtonProps = {
  href?: string;
  className?: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  type?: "button" | "submit" | "reset";
  ariaLabel?: string;
  onClick?: () => void;
};

const Button: React.FC<ButtonProps> = ({
  href,
  children,
  className,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  type = "button",
  ariaLabel,
  onClick,
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg font-sora";

  const variants: Record<Variant, string> = {
    primary:
      "bg-accent-button text-white shadow-md transition-transform duration-300 hover:-translate-y-0.5 tracking-wider",
    outline:
      "border border-dark-accent bg-transparent hover:bg-light-background",
    ghost: "bg-transparent",
  };

  const sizes: Record<Size, string> = {
    xs: "px-3 py-1.5 text-xs",
    sm: "px-4 py-2.5 text-sm",
    md: "px-5 py-3 text-sm lg:text-base",
    lg: "px-6 py-3 text-base",
  };

  const combinedClass = clsx(
    baseStyles,
    variants[variant],
    sizes[size],
    {
      "opacity-50 pointer-events-none": disabled || loading,
    },
    className
  );

  const content = (
    <>
      {loading && (
        <Loader2
          className="h-4 w-4 animate-spin"
          aria-hidden
        />
      )}
      {!loading && leftIcon}
      <span>{children}</span>
      {!loading && rightIcon}
    </>
  );

  if (href && !disabled) {
    return (
      <Link
        href={href}
        aria-label={ariaLabel}
        className={combinedClass}
      >
        {content}
      </Link>
    );
  }
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading}
      onClick={onClick}
      className={combinedClass}
    >
      {content}
    </button>
  );
};

export default Button;

// import { ButtonHTMLAttributes, forwardRef } from "react";
// import { cva, type VariantProps } from "class-variance-authority";

// interface ButtonProps
//   extends ButtonHTMLAttributes<HTMLButtonElement>,
//     VariantProps<typeof buttonVariants> {}

// const buttonVariants = cva("h-fit transition-all duration-150 ease-in-out", {
//   variants: {
//     variant: {
//       default: "bg-main text-body",
//       primary: "bg-primary text-body hover:text-body",
//       secondary: "bg-body text-main",
//       "secondary-primary": "bg-body text-primary",
//       outline: "bg-transparent border border-current",
//       "primary-outline":
//         "bg-danger-overlay text-body border border-primary hover:bg-primary",
//     },
//     size: {
//       xs: "text-xs py-0.5 px-1",
//       sm: "text-xs lg:text-sm py-1 px-2",
//       md: "text-sm lg:text-base py-2 px-4",
//       lg: "text-base lg:text-lg py-4 px-8",
//     },
//     roundness: {
//       square: "rounded-none",
//       round: "rounded-md",
//       pill: "rounded-full",
//     },
//   },
//   compoundVariants: [
//     {
//       variant: ["default", "primary", "outline", "secondary-primary"],
//       class:
//         "focus:opacity-80 hover:-translate-y-0.5 active:translate-y-0.5 active:scale-95",
//     },
//   ],
//   defaultVariants: {
//     variant: "default",
//     size: "md",
//     roundness: "square",
//   },
// });

// const Button = forwardRef<HTMLButtonElement, ButtonProps>(
//   ({ children, className, variant, size, roundness, ...props }, ref) => {
//     return (
//       <button
//         ref={ref}
//         className={buttonVariants({ className, variant, size, roundness })}
//         {...props}
//       >
//         {children}
//       </button>
//     );
//   }
// );

// Button.displayName = "Button";

// export default Button;
