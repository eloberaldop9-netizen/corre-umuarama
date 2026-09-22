// Kit de colagem documental — "O Dossiê da Proteção" (Vídeo 04).
// Recortes com borda rasgada, fita adesiva, retícula halftone e textura de
// papel jornal. Tudo determinístico (sem Math.random) para renders
// reprodutíveis.
import React from 'react';
import { Img, staticFile } from 'remotion';
import { COLOR_PROTECAO } from './palette-protecao';

const pseudo = (seed: number, n: number) => {
  const v = Math.sin(seed * 12.9898 + n * 78.233) * 43758.5453;
  return v - Math.floor(v);
};

/** Polígono de papel rasgado nos 4 lados. `amp` em % do lado. */
export const tornPolygon = (seed = 1, amp = 1.6, steps = 18): string => {
  const pts: string[] = [];
  const j = (n: number) => pseudo(seed, n) * amp;
  for (let i = 0; i <= steps; i++) pts.push(`${(i / steps) * 100}% ${j(i)}%`);
  for (let i = 1; i <= steps; i++) pts.push(`${100 - j(i + 40)}% ${(i / steps) * 100}%`);
  for (let i = 1; i <= steps; i++) pts.push(`${100 - (i / steps) * 100}% ${100 - j(i + 80)}%`);
  for (let i = 1; i < steps; i++) pts.push(`${j(i + 120)}% ${100 - (i / steps) * 100}%`);
  return `polygon(${pts.join(', ')})`;
};

/** Textura de papel jornal: colunas de "texto" impresso + fibras. */
export const NewsprintTexture: React.FC<{ opacity?: number; tint?: string; style?: React.CSSProperties }> = ({
  opacity = 0.35,
  tint = 'rgba(17,17,17,0.55)',
  style,
}) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      opacity,
      backgroundImage: `repeating-linear-gradient(180deg, ${tint} 0px, ${tint} 2px, transparent 2px, transparent 9px),
        repeating-linear-gradient(90deg, transparent 0px, transparent 150px, rgba(255,255,255,1) 150px, rgba(255,255,255,1) 172px)`,
      mixBlendMode: 'multiply',
      ...style,
    }}
  />
);

/** Retícula de impressão (halftone). */
export const HalftoneDots: React.FC<{ size?: number; opacity?: number; color?: string; phase?: number }> = ({
  size = 7,
  opacity = 0.35,
  color = 'rgba(17,17,17,1)',
  phase = 0,
}) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      backgroundImage: `radial-gradient(${color} 1.1px, transparent 1.7px)`,
      backgroundSize: `${size}px ${size}px`,
      backgroundPosition: `${phase}px ${phase}px`,
      opacity,
      mixBlendMode: 'multiply',
      pointerEvents: 'none',
    }}
  />
);

interface CutoutProps {
  file: string;
  width: number;
  height: number;
  seed?: number;
  /** Borda de papel branco em volta da foto (px). */
  border?: number;
  borderColor?: string;
  halftone?: boolean;
  /** P&B com contraste de jornal. */
  mono?: boolean;
  tint?: string;
  objectPosition?: string;
  shadow?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

/** Foto recortada à mão: borda rasgada + margem de papel + sombra dura. */
export const Cutout: React.FC<CutoutProps> = ({
  file,
  width,
  height,
  seed = 1,
  border = 14,
  borderColor = COLOR_PROTECAO.paper,
  halftone = true,
  mono = false,
  tint,
  objectPosition = '50% 50%',
  shadow = 'drop-shadow(0 18px 26px rgba(0,0,0,0.55))',
  style,
  children,
}) => (
  <div style={{ position: 'absolute', width, height, filter: shadow, ...style }}>
    <div style={{ position: 'absolute', inset: 0, background: borderColor, clipPath: tornPolygon(seed, 1.8) }}>
      <NewsprintTexture opacity={0.08} />
    </div>
    <div style={{ position: 'absolute', inset: border, clipPath: tornPolygon(seed + 7, 1.2), overflow: 'hidden' }}>
      <Img
        src={staticFile(`assets/${file}`)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition,
          filter: mono ? 'grayscale(1) contrast(1.25) brightness(1.05)' : 'contrast(1.08)',
        }}
      />
      {tint ? <div style={{ position: 'absolute', inset: 0, background: tint, mixBlendMode: 'multiply' }} /> : null}
      {halftone ? <HalftoneDots opacity={0.22} size={6} /> : null}
      {children}
    </div>
  </div>
);

/** Fita adesiva translúcida com pontas serrilhadas. */
export const Tape: React.FC<{
  width?: number;
  height?: number;
  color?: string;
  rotate?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  seed?: number;
}> = ({ width = 200, height = 54, color = 'rgba(252,227,0,0.82)', rotate = -4, style, children, seed = 3 }) => {
  const teeth = 6;
  const l: string[] = [];
  const r: string[] = [];
  for (let i = 0; i <= teeth; i++) {
    const y = (i / teeth) * 100;
    l.push(`${i % 2 ? 2.5 + pseudo(seed, i) * 2 : 0}% ${y}%`);
    r.unshift(`${100 - (i % 2 ? 2.5 + pseudo(seed, i + 9) * 2 : 0)}% ${y}%`);
  }
  return (
    <div
      style={{
        position: 'absolute',
        width,
        height,
        background: color,
        transform: `rotate(${rotate}deg)`,
        clipPath: `polygon(${[...l, ...r].join(', ')})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Poeira gráfica subindo (fundos roxos). */
export const Dust: React.FC<{ frame: number; count?: number; opacity?: number }> = ({ frame, count = 26, opacity = 0.22 }) => (
  <div style={{ position: 'absolute', inset: 0, opacity, pointerEvents: 'none' }}>
    {Array.from({ length: count }, (_, i) => {
      const x = (i * 137.5) % 100;
      const y = ((((i * 71) % 100) - frame * (0.12 + (i % 5) * 0.03)) % 100 + 100) % 100;
      const s = 2 + (i % 3) * 1.5;
      return (
        <div
          key={i}
          style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, width: s, height: s, borderRadius: '50%', background: '#FFFFFF' }}
        />
      );
    })}
  </div>
);

/** Grão de filme / papel (fractal noise). */
export const Grain: React.FC<{ opacity?: number; blend?: React.CSSProperties['mixBlendMode'] }> = ({
  opacity = 0.14,
  blend = 'overlay',
}) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      opacity,
      mixBlendMode: blend,
      pointerEvents: 'none',
      backgroundImage:
        "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
    }}
  />
);
