import clsx from "clsx";
import Link from "next/link";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "outline" | "ghost";
type Size = "xs" | "sm" | "md" | "lg";

interface ButtonProps {
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
}

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
    "inline-flex items-center justify-center gap-2 rounded-lg transition-all font-sora tracking-wider";

  const variants: Record<Variant, string> = {
    primary: "bg-accent-button text-white shadow-md",
    outline:
      "border border-dark-accent bg-transparent hover:bg-light-background",
    ghost: "bg-transparent",
  };

  const sizes: Record<Size, string> = {
    xs: "px-3 py-1.5 text-xs",
    sm: "px-3.5 py-2 text-sm",
    md: "px-5 py-3 text-base",
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
        className={combinedClass}
        aria-label={ariaLabel}
      >
        {content}
      </Link>
    );
  }
  return (
    <button
      type={type}
      className={combinedClass}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading}
      onClick={onClick}
    >
      {content}
    </button>
  );
};

export default Button;
