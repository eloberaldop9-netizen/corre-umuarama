import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { COLOR } from './palette';

const NOISE_SVG =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/** Parte 6.1 da skill — Base + Gradiente radial + Noise. Nunca cor morta. */
export const NoiseOverlay: React.FC<{ opacity?: number; blend?: React.CSSProperties['mixBlendMode'] }> = ({
  opacity = 0.03,
  blend = 'overlay',
}) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      backgroundImage: NOISE_SVG,
      opacity,
      mixBlendMode: blend,
    }}
  />
);

/** Cenas 1 e 5 — Void preto profundo, autoridade absoluta. */
export const VoidBackground: React.FC<{ glowOpacity?: number }> = ({ glowOpacity = 0.15 }) => (
  <AbsoluteFill>
    <div style={{ position: 'absolute', inset: 0, backgroundColor: COLOR.void }} />
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(circle at 50% 30%, rgba(91,46,140,${glowOpacity}), transparent 70%)`,
      }}
    />
    <NoiseOverlay opacity={0.08} />
    <HalftoneOverlay opacity={0.025} dark />
    <DustParticles />
  </AbsoluteFill>
);

/** Cenas 2 e 3 — papel jornal / documental, off-white amassado. */
export const PaperBackground: React.FC<{ dark?: boolean }> = ({ dark = false }) => (
  <AbsoluteFill>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: dark ? '#1A1A1C' : COLOR.paper,
      }}
    />
    {/* Textura de papel amassado simulada via gradientes cruzados (placeholder até termos foto de textura real) */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `repeating-linear-gradient(115deg, rgba(0,0,0,0.035) 0px, transparent 2px, transparent 6px),
          repeating-linear-gradient(25deg, rgba(0,0,0,0.025) 0px, transparent 3px, transparent 9px)`,
        mixBlendMode: 'multiply',
        opacity: dark ? 0.5 : 0.4,
      }}
    />
    <NoiseOverlay opacity={dark ? 0.12 : 0.02} />
  </AbsoluteFill>
);

/** Cena 4 — preto cinematográfico com light leaks orgânicos. */
export const CinematicBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const leakX = Math.sin(frame * 0.015) * 12;
  const leakY = Math.cos(frame * 0.012) * 8;
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', inset: 0, backgroundColor: COLOR.cinematic }} />
      <div
        style={{
          position: 'absolute',
          inset: -200,
          background: `radial-gradient(circle at ${20 + leakX}% ${30 + leakY}%, rgba(232,178,61,0.55), transparent 55%),
            radial-gradient(circle at ${85 - leakX}% ${75 - leakY}%, rgba(216,140,40,0.35), transparent 50%)`,
          filter: 'blur(90px)',
          mixBlendMode: 'screen',
        }}
      />
      <NoiseOverlay opacity={0.04} />
      <HalftoneOverlay opacity={0.03} dark />
    </AbsoluteFill>
  );
};

/** Pó / partículas flutuando devagar para cima — presente no void das cenas 1 e 5. */
export const DustParticles: React.FC<{ count?: number }> = ({ count = 28 }) => {
  const frame = useCurrentFrame();
  const seeds = React.useMemo(
    () => Array.from({ length: count }, (_, i) => ({
      x: (i * 137.5) % 100,
      startY: (i * 71) % 100,
      size: 1 + (i % 3),
      speed: 0.15 + (i % 5) * 0.03,
    })),
    [count]
  );
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 0.15 }}>
      {seeds.map((s, i) => {
        const y = (s.startY - frame * s.speed) % 100;
        const yWrapped = ((y % 100) + 100) % 100;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${s.x}%`,
              top: `${yWrapped}%`,
              width: s.size,
              height: s.size,
              borderRadius: '50%',
              background: '#FFFFFF',
            }}
          />
        );
      })}
    </div>
  );
};

/** Textura de meio-tom (halftone) — toque de revista/jornal impresso. */
export const HalftoneOverlay: React.FC<{ opacity?: number; dark?: boolean }> = ({
  opacity = 0.05,
  dark = false,
}) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      backgroundImage: `radial-gradient(${dark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)'} 1px, transparent 1.4px)`,
      backgroundSize: '6px 6px',
      opacity,
      mixBlendMode: dark ? 'overlay' : 'multiply',
    }}
  />
);

/** Clip-path de borda rasgada (efeito "recorte de jornal") — determinístico por seed. */
export const tornEdgeClipPath = (seed = 0, side: 'top' | 'bottom' = 'top'): string => {
  const steps = 16;
  const points: string[] = [];
  const pseudo = (n: number) => {
    const v = Math.sin(seed * 12.9898 + n * 78.233) * 43758.5453;
    return v - Math.floor(v);
  };
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * 100;
    const y = 1.5 + pseudo(i) * 3.5;
    points.push(`${x}% ${side === 'top' ? y : 100 - y}%`);
  }
  if (side === 'top') {
    points.push('100% 100%', '0% 100%');
  } else {
    points.push('100% 0%', '0% 0%');
  }
  return `polygon(${points.join(', ')})`;
};

/** Fita adesiva (washi tape) — toque de colagem/recorte de revista. */
export const TapeStrip: React.FC<{
  top: number;
  left: number;
  width?: number;
  rotate?: number;
  color?: string;
}> = ({ top, left, width = 120, rotate = -6, color = 'rgba(240,201,61,0.55)' }) => (
  <div
    style={{
      position: 'absolute',
      top,
      left,
      width,
      height: 34,
      background: color,
      transform: `rotate(${rotate}deg)`,
      boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
      zIndex: 50,
    }}
  />
);

/** Anel de radar pulsante — Cena 2, sobre o mapa. */
export const RadarPulse: React.FC<{ frame: number; loopFrames?: number; color?: string }> = ({
  frame,
  loopFrames = 45,
  color = COLOR.purple,
}) => {
  const local = frame % loopFrames;
  const progress = local / loopFrames;
  const scale = 0.2 + progress * 2;
  const opacity = 0.8 * (1 - progress);
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 520,
        height: 520,
        marginLeft: -260,
        marginTop: -260,
        borderRadius: '50%',
        border: `2px solid ${color}`,
        transform: `scale(${scale})`,
        opacity,
      }}
    />
  );
};
