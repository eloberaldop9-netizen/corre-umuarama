import React from 'react';
import { AbsoluteFill } from 'remotion';
import { NoiseOverlay } from './Background';
import { ED } from './editorial';

/** Papel amassado roxo (mesa editorial das Cenas 2a/2b/2c do vídeo 03). `shift` = pan da camada lenta. */
export const PaperPurple: React.FC<{ shift?: number }> = ({ shift = 0 }) => (
  <AbsoluteFill style={{ backgroundColor: ED.deskPurple }}>
    <AbsoluteFill style={{ transform: `translateX(${shift}px) scale(1.15)` }}>
      <AbsoluteFill
        style={{
          mixBlendMode: 'multiply', opacity: 0.6,
          backgroundImage: `radial-gradient(ellipse at 20% 25%, rgba(255,255,255,0.16), transparent 40%),
            radial-gradient(ellipse at 78% 72%, rgba(0,0,0,0.4), transparent 45%),
            repeating-linear-gradient(118deg, rgba(0,0,0,0.10) 0 2px, transparent 2px 40px),
            repeating-linear-gradient(28deg, rgba(255,255,255,0.05) 0 2px, transparent 2px 56px)`,
        }}
      />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(176,132,193,0.22), transparent 70%)' }} />
    </AbsoluteFill>
    <NoiseOverlay opacity={0.07} />
  </AbsoluteFill>
);
