import React, { useMemo } from 'react';
import { seeded } from '../lib/animation';

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
 * Ensō — círculo japonês desenhado à mão livre. Construído como um path
 * levemente irregular (raio com jitter por ponto) para simular imperfeição
 * de pincel, revelado via pathLength/strokeDashoffset — participa da
 * animação em vez de ser um asset estático colado sobre o vídeo.
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
    const baseR = size / 2 - strokeWidth;
    const points = 64;
    const coords: [number, number][] = [];
    for (let i = 0; i <= points; i++) {
      const t = (i / points) * Math.PI * 2;
      const jitter = (seeded(seed + i * 0.37) - 0.5) * strokeWidth * 0.5;
      const wobble = Math.sin(t * 3 + seed) * strokeWidth * 0.12;
      const r = baseR + jitter + wobble;
      coords.push([cx + Math.cos(t) * r, cy + Math.sin(t) * r]);
    }
    return `M ${coords[0][0]} ${coords[0][1]} ` + coords.slice(1).map(([x, y]) => `L ${x} ${y}`).join(' ');
  }, [size, strokeWidth, seed]);

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
