import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex h-fit cursor-pointer items-center justify-center gap-2 rounded-lg font-sora font-medium transition-[background-color,transform,box-shadow] duration-200 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // The accent carries dark ink — white on apricot fails AA (3.39:1).
        primary:
          "bg-accent text-accent-ink shadow-e1 hover:bg-accent-hover hover:-translate-y-px active:translate-y-0 active:scale-[0.98]",
        secondary:
          "border border-line bg-surface-raised text-ink hover:bg-surface-sunken",
        outline:
          "border border-line-strong bg-transparent text-ink hover:bg-ambient-soft",
        ghost:
          "bg-transparent text-ink-muted hover:bg-ambient-soft hover:text-ink",
      },
      size: {
        xs: "px-3 py-1.5 text-xs",
        sm: "px-4 py-2.5 text-sm",
        md: "px-5 py-3 text-sm lg:text-base",
        lg: "px-6 py-3 text-base",
      },
      roundness: {
        round: "rounded-lg",
        pill: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      roundness: "round",
    },
  }
);

type ButtonProps = VariantProps<typeof buttonVariants> & {
  href?: string;
  className?: string;
  children: React.ReactNode;
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
  variant,
  size,
  roundness,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  type = "button",
  ariaLabel,
  onClick,
}) => {
  const classes = cn(
    buttonVariants({ variant, size, roundness }),
    (disabled || loading) && "pointer-events-none opacity-50",
    className
  );

  const content = (
    <>
      {loading && (
        <Loader2
          className="size-4 animate-spin"
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
        className={classes}
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
      className={classes}
    >
      {content}
    </button>
  );
};

export default Button;
