import { useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';

export interface WheelItem {
  id: string;
  name: string;
  emoji: string;
  weight: number;
}

export interface SpinWheelRef {
  spin: (winnerId: string) => void;
}

interface Props {
  items: WheelItem[];
  onResult: (item: WheelItem) => void;
  size?: number;
}

const COLORS = [
  '#e63946', '#e76f51', '#f4a261', '#e9c46a',
  '#2a9d8f', '#264653', '#6a4c93', '#1982c4',
  '#ff595e', '#ff924c', '#ffca3a', '#8ac926',
  '#6a4c93', '#1982c4', '#e76f51', '#2a9d8f',
  '#c9184a', '#f77f00', '#fcbf49', '#57cc99',
];

const SpinWheel = forwardRef<SpinWheelRef, Props>(({ items, onResult, size = 300 }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);
  const rafRef = useRef<number>(0);
  const isSpinningRef = useRef(false);

  const draw = useCallback((rotation: number) => {
    const canvas = canvasRef.current;
    if (!canvas || items.length === 0) return;
    const ctx = canvas.getContext('2d')!;
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const r = Math.min(cx, cy) - 8;

    ctx.clearRect(0, 0, w, h);

    const totalWeight = items.reduce((s, i) => s + i.weight, 0);

    // Rotate canvas around center
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-cx, -cy);

    let startAngle = -Math.PI / 2; // Start at top (12 o'clock)

    items.forEach((item, idx) => {
      const sliceAngle = (item.weight / totalWeight) * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;
      const midAngle = startAngle + sliceAngle / 2;
      const color = COLORS[idx % COLORS.length];

      // Segment
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();

      // Segment border
      ctx.strokeStyle = 'rgba(0,0,0,0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Text
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(midAngle);

      const n = items.length;
      const emojiSize = Math.max(10, Math.min(22, r / Math.max(n * 0.35, 3)));
      const textSize = Math.max(7, Math.min(14, r / Math.max(n * 0.5, 5)));
      const textDist = r * 0.62;

      // Emoji
      ctx.font = `${emojiSize}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#fff';
      ctx.fillText(item.emoji, textDist, -textSize * 0.4);

      // Name
      ctx.font = `bold ${textSize}px 'Boogaloo', sans-serif`;
      ctx.fillStyle = '#fff';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 3;
      const maxLen = n <= 8 ? 12 : n <= 14 ? 8 : 5;
      const name = item.name.length > maxLen ? item.name.slice(0, maxLen - 1) + '…' : item.name;
      ctx.fillText(name, textDist, emojiSize * 0.7);
      ctx.shadowBlur = 0;

      ctx.restore();
      startAngle = endAngle;
    });

    ctx.restore();

    // Outer gold ring
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 5;
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 12;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Inner ring decoration
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.18, 0, 2 * Math.PI);
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 0.18);
    grad.addColorStop(0, '#FFF9C4');
    grad.addColorStop(0.5, '#FFD700');
    grad.addColorStop(1, '#B8860B');
    ctx.fillStyle = grad;
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 16;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Star in center
    ctx.font = `${r * 0.16}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⭐', cx, cy);

    // Pointer (triangle outside, at top)
    const px = cx;
    const py = cy - r - 6;
    ctx.beginPath();
    ctx.moveTo(px, py + 26);
    ctx.lineTo(px - 12, py + 4);
    ctx.lineTo(px + 12, py + 4);
    ctx.closePath();
    ctx.fillStyle = '#FFD700';
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#1a0a00';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }, [items]);

  useEffect(() => {
    draw(rotationRef.current);
  }, [draw]);

  const spin = useCallback((winnerId: string) => {
    if (isSpinningRef.current || items.length === 0) return;

    const winnerIdx = items.findIndex((i) => i.id === winnerId);
    if (winnerIdx === -1) return;

    isSpinningRef.current = true;

    const totalWeight = items.reduce((s, i) => s + i.weight, 0);

    // Calculate midAngle of winner (degrees, clockwise from top)
    let cumWeight = 0;
    for (let i = 0; i < winnerIdx; i++) cumWeight += items[i].weight;
    const winnerStartDeg = (cumWeight / totalWeight) * 360;
    const winnerEndDeg = ((cumWeight + items[winnerIdx].weight) / totalWeight) * 360;
    const winnerMidDeg = (winnerStartDeg + winnerEndDeg) / 2;

    // targetRotation: after rotation R, the item at winnerMidDeg lands at top (0)
    // We need: (winnerMidDeg + R) % 360 === 0  →  R = (360 - winnerMidDeg) % 360
    const currentMod = rotationRef.current % 360;
    const desired = (360 - winnerMidDeg + 360) % 360;
    const extraRots = (Math.floor(Math.random() * 3) + 5) * 360;
    const diff = (desired - currentMod + 360) % 360;
    const targetRotation = rotationRef.current + extraRots + diff;

    const duration = 4500 + Math.random() * 1500;
    const startRotation = rotationRef.current;
    const startTime = performance.now();

    const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOut(progress);
      const cur = startRotation + (targetRotation - startRotation) * eased;
      rotationRef.current = cur;
      draw(cur);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        isSpinningRef.current = false;
        onResult(items[winnerIdx]);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
  }, [items, draw, onResult]);

  useImperativeHandle(ref, () => ({ spin }), [spin]);

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{ display: 'block', maxWidth: '100%' }}
    />
  );
});

SpinWheel.displayName = 'SpinWheel';
export default SpinWheel;
