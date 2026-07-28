import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  /** Rendered box in px. The droplet keeps the original 1024 framing. */
  size?: number;
  /** Set when the logo is the only thing naming the brand (e.g. a bare link). */
  title?: string;
};

/**
 * The FocusPond droplet.
 *
 * This was a 565 KB component: a base64 PNG (468×648) embedded in an <svg> and
 * shipped inside every JS bundle that imported it — for a mark that renders at
 * 50px. It is a flat two-colour shape, so it is drawn here as real geometry:
 * ~1 KB, crisp at any size, and `currentColor` so it follows the theme instead
 * of staying the old walnut brown.
 *
 * One path, two subpaths, `evenodd` — which makes the crescent a genuine hole
 * rather than a shape filled with an assumed background colour.
 *
 * Geometry is authored in the original 468×648 space and translated to
 * (278, 190) inside a 1024 viewBox, matching where the old raster sat, so no
 * call site shifts.
 */
const BrandLogo = ({ className, size = 50, title }: BrandLogoProps) => (
  <svg
    viewBox="0 0 1024 1024"
    width={size}
    height={size}
    className={cn("text-accent", className)}
    role={title ? "img" : "presentation"}
    aria-label={title}
    aria-hidden={title ? undefined : true}
  >
    {title && <title>{title}</title>}
    <g transform="translate(278 190)">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M234 6 L47.2 273.4 A228 228 0 1 0 420.8 273.4 Z M330 258 C385 315 408 365 404 418 C400 480 365 530 307 553 C350 500 358 450 352 400 C346 340 340 295 330 258 Z"
      />
    </g>
  </svg>
);

export default BrandLogo;
