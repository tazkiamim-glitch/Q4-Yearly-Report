interface TopBuntingProps {
  className?: string;
}

export const TopBunting = ({ className = '' }: TopBuntingProps) => {
  const colors = ['#FDE68A', '#C7D2FE', '#FBCFE8', '#A7F3D0', '#FECACA'];
  const triangleCount = 14;
  const step = 72; // px in viewBox units
  const startX = 0;
  const ropeY = 6;
  const dropY = 70;

  return (
    <div className={`fixed top-0 left-0 w-full pointer-events-none z-10 ${className}`}>
      <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-full">
        {/* Rope */}
        <line x1="0" y1={ropeY} x2="1000" y2={ropeY} stroke="#E5E7EB" strokeWidth="3" />
        {/* Flags */}
        {Array.from({ length: triangleCount }).map((_, i) => {
          const x = startX + i * step;
          const mid = x + step / 2;
          const color = colors[i % colors.length];
          return (
            <polygon
              key={i}
              points={`${x},${ropeY} ${x + step},${ropeY} ${mid},${dropY}`}
              fill={color}
              stroke="rgba(0,0,0,0.06)"
              strokeWidth="1"
            />
          );
        })}
      </svg>
    </div>
  );
};



