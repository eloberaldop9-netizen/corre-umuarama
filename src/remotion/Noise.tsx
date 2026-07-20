import React, {useMemo} from 'react';

export const Noise: React.FC<{
  opacity: number;
  blendMode?: React.CSSProperties['mixBlendMode'];
  baseFrequency?: number;
}> = ({opacity, blendMode = 'overlay', baseFrequency = 0.85}) => {
  const filterId = useMemo(
    () => `noise-${Math.random().toString(36).slice(2)}`,
    [],
  );

  return (
    <svg
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        opacity,
        mixBlendMode: blendMode,
        pointerEvents: 'none',
      }}
    >
      <filter id={filterId}>
        <feTurbulence
          type="fractalNoise"
          baseFrequency={baseFrequency}
          numOctaves={3}
          stitchTiles="stitch"
        />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${filterId})`} />
    </svg>
  );
};
