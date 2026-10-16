type IconButtonProps = {
  icon: React.ElementType;
  /**
   * Accessible name, and the hover tooltip. Required: an icon-only button with
   * no label is announced as "button" and nothing else, and a bare chart or
   * smile glyph does not tell a sighted reader where it goes either.
   */
  label: string;
  isActive?: boolean;
  onClick?: () => void;
};

export default function IconButton({
  icon: Icon,
  label,
  isActive,
  onClick,
}: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`
        flex items-center justify-center w-10 h-10 cursor-pointer rounded-lg transition-all
        ${isActive ? "bg-dark-accent/10 text-dark-accent" : "text-dark-accent/80 hover:bg-dark-accent/5"}
      `}
    >
      <Icon
        className="w-[18px] h-[18px]"
        strokeWidth={isActive ? 2 : 1.5}
      />
    </button>
  );
}
