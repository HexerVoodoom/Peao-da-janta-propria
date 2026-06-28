import { useMemo } from 'react';

interface Star {
  id: number;
  top: number;
  left: number;
  size: number;
  dur: number;
  delay: number;
}

export default function StarField() {
  const stars = useMemo<Star[]>(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: 1 + Math.random() * 2.5,
        dur: 1.5 + Math.random() * 3,
        delay: Math.random() * 3,
      })),
    []
  );

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
      {stars.map((s) => (
        <div
          key={s.id}
          className="star"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            '--dur': `${s.dur}s`,
            '--delay': `${s.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
