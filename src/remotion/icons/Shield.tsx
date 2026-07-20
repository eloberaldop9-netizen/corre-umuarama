import React from 'react';
import {COLORS} from '../colors';

export const Shield: React.FC<{
  size: number;
  borderDraw: number;
  coreScale: number;
  coreOpacity: number;
  color?: string;
}> = ({size, borderDraw, coreScale, coreOpacity, color = COLORS.accent}) => {
  const dash = 70;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{overflow: 'visible'}}
    >
      <path
        d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={dash}
        strokeDashoffset={dash * (1 - borderDraw)}
      />
      <g
        style={{
          transform: `scale(${coreScale})`,
          transformOrigin: '12px 12.5px',
          opacity: coreOpacity,
        }}
      >
        <path
          d="m9 12 2 2 4-4"
          stroke={color}
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};
