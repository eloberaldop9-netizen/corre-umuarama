import React, { useMemo } from 'react';

interface BrushCircleProps {
  progress: number; // 0..1 — quanto do traço já foi desenhado
  size?: number;
  color?: string;
  strokeWidth?: number;
  seed?: number;
  rotate?: number; // graus, ponto de partida do traço
  style?: React.CSSProperties;
}

/**
 * Ensō — círculo japonês, revelado via pathLength/strokeDashoffset (o traço
 * participa da animação em vez de ser um asset estático colado sobre o
 * vídeo). Geometria perfeitamente circular — sem jitter/wobble — apenas o
 * segundo traço levemente deslocado por baixo dá a textura de pincel.
 */
export const BrushCircle: React.FC<BrushCircleProps> = ({
  progress,
  size = 640,
  color = '#F8F2F1',
  strokeWidth = 26,
  seed = 7,
  rotate = -92,
  style,
}) => {
  const path = useMemo(() => {
    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 - strokeWidth;
    const points = 64;
    const coords: [number, number][] = [];
    for (let i = 0; i <= points; i++) {
      const t = (i / points) * Math.PI * 2;
      coords.push([cx + Math.cos(t) * r, cy + Math.sin(t) * r]);
    }
    return `M ${coords[0][0]} ${coords[0][1]} ` + coords.slice(1).map(([x, y]) => `L ${x} ${y}`).join(' ');
  }, [size, strokeWidth]);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ transform: `rotate(${rotate}deg)`, overflow: 'visible', ...style }}
    >
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - Math.max(0, Math.min(1, progress))}
        opacity={0.94}
      />
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth * 0.42}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - Math.max(0, Math.min(1, progress))}
        opacity={0.5}
        transform={`translate(${strokeWidth * 0.18}, ${-strokeWidth * 0.1})`}
      />
    </svg>
  );
};
