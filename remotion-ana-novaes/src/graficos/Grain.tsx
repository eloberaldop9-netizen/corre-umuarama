import React from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';

// Camada de textura noise (Motion O.S. 6.1): grão de filme que muda a cada 2
// frames (seed determinística), sobre o vídeo inteiro.
const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.05 }) => {
  const frame = useCurrentFrame();
  const step = Math.floor(frame / 2);
  const x = Math.round(random(`grain-x-${step}`) * 256);
  const y = Math.round(random(`grain-y-${step}`) * 256);
  return (
    <AbsoluteFill
      style={{
        backgroundImage: NOISE_SVG,
        backgroundSize: '256px 256px',
        backgroundPosition: `${x}px ${y}px`,
        opacity,
        mixBlendMode: 'overlay',
        pointerEvents: 'none',
      }}
    />
  );
};
