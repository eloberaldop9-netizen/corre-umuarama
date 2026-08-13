import React from 'react';
import { AbsoluteFill } from 'remotion';

interface BackgroundBaseProps {
  color: string;
  glow?: string;
  grainOpacity?: number;
}

/**
 * Fundo em 3 camadas (cor + glow radial + ruído). Muda de cena para cena em
 * corte seco — nunca anima em posição (Mandamento 8).
 */
export const BackgroundBase: React.FC<BackgroundBaseProps> = ({
  color,
  glow = 'rgba(255,255,255,0.05)',
  grainOpacity = 0.025,
}) => {
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', inset: 0, backgroundColor: color }} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 70% 55% at 50% 38%, ${glow} 0%, transparent 72%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          opacity: grainOpacity,
          mixBlendMode: 'overlay',
        }}
      />
    </AbsoluteFill>
  );
};
