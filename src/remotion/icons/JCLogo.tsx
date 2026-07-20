import React from 'react';
import {COLORS} from '../colors';

export const JCLogoJ: React.FC<{size: number}> = ({size}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 160 160"
    style={{position: 'absolute', inset: 0, overflow: 'visible'}}
  >
    <path
      d="M101 26 L101 96 C101 124 82 135 61 135 C44 135 31 126 31 111"
      fill="none"
      stroke={COLORS.textPrimary}
      strokeWidth={20}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const JCLogoC: React.FC<{size: number}> = ({size}) => {
  const gradId = 'jc-flag-grad';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      style={{position: 'absolute', inset: 0, overflow: 'visible'}}
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={COLORS.accent} />
          <stop offset="100%" stopColor="#E8590C" />
        </linearGradient>
      </defs>
      <path
        d="M58 97 A34 34 0 1 0 92 131"
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth={20}
        strokeLinecap="round"
      />
      <rect
        x={62}
        y={12}
        width={34}
        height={15}
        rx={2}
        fill={`url(#${gradId})`}
        transform="skewX(-18)"
      />
    </svg>
  );
};
