type IconButtonProps = {
  icon: React.ElementType;
  isActive?: boolean;
  onClick?: () => void;
};

export default function IconButton({
  icon: Icon,
  isActive,
  onClick,
}: IconButtonProps) {
  return (
    <button
      onClick={onClick}
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
