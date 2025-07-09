interface BadgeProps {
  title: string;
}

const Badge: React.FC<BadgeProps> = ({ title }) => {
  return (
    <div className="text-center">
      <h2 className="inline-block px-4 py-1 text-sm font-sora bg-[#ffe5b4]/30 text-[#8b5e3c] mb-8 font-semibold rounded-full">
        {title}
      </h2>
    </div>
  );
};

export default Badge;
