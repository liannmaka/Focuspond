import clsx from "clsx";

type CardProps = React.PropsWithChildren<
  React.HTMLAttributes<HTMLDivElement>
> & {
  shadow?: boolean;
  bordered?: boolean;
  rounded?: boolean;
};

const Card = ({
  children,
  shadow = true,
  bordered = false,
  rounded = true,
  ...rest
}: CardProps) => {
  return (
    <div
      className={clsx(
        "p-4 transition duration-300",
        shadow && "shadow-md",
        bordered && "border border-gray-200",
        rounded && "rounded-2xl"
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Card;
