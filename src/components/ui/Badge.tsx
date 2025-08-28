type BadgeProps = {
  title: string;
  className?: string;
};

const Badge = ({ title, className }: BadgeProps) => {
  return (
    <div className={className}>
      <h2 className="badge">{title}</h2>
    </div>
  );
};

export default Badge;
