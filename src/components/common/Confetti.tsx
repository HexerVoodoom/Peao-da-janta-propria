import { useEffect, useState } from 'react';

const COLORS = ['#FFD700', '#FF2D78', '#00BFFF', '#00FF88', '#FF6B00', '#FFF176', '#B44FFF'];

interface Piece {
  id: number;
  left: number;
  width: number;
  height: number;
  color: string;
  dur: number;
  delay: number;
  rotate: number;
}

export default function Confetti() {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    const newPieces: Piece[] = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      width: 6 + Math.random() * 8,
      height: 8 + Math.random() * 12,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      dur: 1.8 + Math.random() * 1.5,
      delay: Math.random() * 0.8,
      rotate: Math.random() * 360,
    }));
    setPieces(newPieces);

    const timer = setTimeout(() => setPieces([]), 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}vw`,
            width: p.width,
            height: p.height,
            background: p.color,
            transform: `rotate(${p.rotate}deg)`,
            '--fall-dur': `${p.dur}s`,
            '--fall-delay': `${p.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </>
  );
}
