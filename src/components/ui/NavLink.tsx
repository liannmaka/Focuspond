import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { ComponentProps, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./Button";

type NavLinkProps = Omit<ComponentProps<typeof Link>, "className"> &
  VariantProps<typeof linkVariants> & {
    className?: string;
    activeLink?: boolean;
  };

/**
 * `default` delegates to `buttonVariants` so the nav CTA and <Button> can't
 * drift apart — they used to be two hand-maintained copies of the same recipe.
 * `link` is the bare inline-nav treatment.
 */
const linkVariants = cva("font-sora inline-flex items-center", {
  variants: {
    variant: {
      default: cn(buttonVariants({ variant: "primary" }), "tracking-wider"),
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
  ({ variant, size, className, children, href, activeLink, ...rest }, ref) => {
    return (
      <Link
        ref={ref}
        href={href}
        aria-current={activeLink ? "page" : undefined}
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
