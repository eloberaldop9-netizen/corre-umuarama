import React from 'react';
import { AbsoluteFill, random } from 'remotion';

interface FilmGrainProps {
  frame: number;
  opacity?: number;
}

/** Grain cinematográfico discreto, com leve variação por frame (2%–4%). */
export const FilmGrain: React.FC<FilmGrainProps> = ({ frame, opacity = 0.035 }) => {
  const dx = Math.floor(random(`grain-x-${frame}`) * 200);
  const dy = Math.floor(random(`grain-y-${frame}`) * 200);

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'overlay', opacity }}>
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        <filter id="filmGrain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} stitchTiles="stitch" seed={Math.floor(random(`seed-${frame}`) * 100)} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect
          width="120%"
          height="120%"
          x={-dx}
          y={-dy}
          filter="url(#filmGrain)"
        />
      </svg>
    </AbsoluteFill>
  );
};
