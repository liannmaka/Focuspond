import clsx from "clsx";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  shadow?: boolean;
  bordered?: boolean;
  rounded?: boolean;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  shadow = true,
  bordered = false,
  rounded = true,
  className,
  ...props
}) => {
  return (
    <div
      className={clsx(
        "p-4 transition duration-300",
        shadow && "shadow-md",
        bordered && "border border-gray-200",
        rounded && "rounded-2xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
