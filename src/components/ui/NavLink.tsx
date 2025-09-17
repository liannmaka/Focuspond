import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { ComponentProps, forwardRef } from "react";
import { cn } from "lib/utils";

type NavLinkProps = Omit<ComponentProps<typeof Link>, "className"> &
  VariantProps<typeof linkVariants> & {
    className?: string;
    activeLink?: boolean;
  };

const linkVariants = cva("font-sora inline-flex items-center", {
  variants: {
    variant: {
      default:
        "bg-accent-button text-white shadow-md transition-transform duration-300 hover:-translate-y-0.5 tracking-wider justify-center rounded-lg",
      link: "group",
    },
    size: {
      sm: "px-4 py-2.5 text-sm",
      md: "px-5 py-3 text-sm lg:text-base",
      lg: "px-6 py-3 text-base",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ variant, size, className, children, href, ...rest }, ref) => {
    return (
      <Link
        ref={ref}
        href={href}
        className={cn(linkVariants({ variant, size }), className)}
        {...rest}
      >
        {children}
      </Link>
    );
  }
);

NavLink.displayName = "NavLink";

export { NavLink, linkVariants };
