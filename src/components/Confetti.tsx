import { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  left: string;
  delay: string;
  duration: string;
  color: string;
  size: string;
}

export const Confetti = () => {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const colors = ['#CF278D', '#354894', '#EFAD1E', '#EE3D5E'];
    const pieces = Array.from({ length: 60 }, (_, i) => {
      const size = 0.15 + Math.random() * 0.2;
      return {
        id: i,
        left: `${Math.random() * 95}%`,
        delay: `${Math.random() * 2}s`,
        duration: `${3 + Math.random() * 2}s`,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: `${size}rem`,
      };
    });
    setConfetti(pieces);
  }, []);

  return (
    <>
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="confetti rounded-sm"
          style={{
            left: piece.left,
            top: '-2rem',
            zIndex: 30,
            animationDelay: piece.delay,
            animationDuration: piece.duration,
            backgroundColor: piece.color,
            position: 'absolute',
            animationName: 'fall',
            width: piece.size,
            height: piece.size,
          }}
        />
      ))}
    </>
  );
}; 