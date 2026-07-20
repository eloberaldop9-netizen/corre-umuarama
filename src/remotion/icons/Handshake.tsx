import React from 'react';
import {COLORS} from '../colors';

const PATHS = [
  'm11 17 2 2a1 1 0 1 0 3-3',
  'm14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4',
  'm21 3 1 11h-2',
  'M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3',
  'M3 4h8',
];

export const Handshake: React.FC<{
  size: number;
  draw: number;
  opacity: number;
  glow: number;
  color?: string;
}> = ({size, draw, opacity, glow, color = COLORS.accent}) => {
  const dash = 45;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{
        overflow: 'visible',
        opacity,
        filter: `drop-shadow(0 0 ${glow}px rgba(211,84,0,0.55))`,
      }}
    >
      {PATHS.map((d, i) => (
        <path
          key={i}
          d={d}
          stroke={color}
          strokeWidth={1.7}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={dash}
          strokeDashoffset={dash * (1 - draw)}
        />
      ))}
    </svg>
  );
};
