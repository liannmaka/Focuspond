import Link from "next/link";

type BottomNavItemProps = {
  isActiveRoute: boolean;
  label: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  href: string;
};

export default function BottomNavItem({
  isActiveRoute,
  label,
  Icon,
  href,
}: BottomNavItemProps) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center gap-1 h-full relative active:scale-[0.97] transition-transform duration-150 ease-out tap-target"
    >
      {/* Active indicator for current location */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-linear-to-r from-accent-button to-accent-button/80 shadow-sm transition-opacity duration-200
        ${isActiveRoute ? "opacity-100" : "opacity-0"}
  `}
      />

      <div className="flex flex-col items-center justify-center gap-0.5 font-manrope font-semibold text-dark-accent text-[10px]">
        <div
          className={`p-3 rounded-xl transition-colors duration-200 ${
            isActiveRoute
              ? "bg-linear-to-r from-accent-button/8 to-accent-button/4"
              : ""
          }`}
        >
          <Icon
            className="w-5 h-5"
            strokeWidth={1.57}
          />
        </div>
        <span>{label}</span>
      </div>
    </Link>
  );
}
