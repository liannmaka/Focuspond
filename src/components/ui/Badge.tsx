interface BadgeProps {
  title: string;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ title, className }) => {
  return (
    <div className={className}>
      <h2 className="badge">{title}</h2>
    </div>
  );
};

export default Badge;
