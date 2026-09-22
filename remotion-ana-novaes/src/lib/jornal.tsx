// Kit "jornal limpo" do Vídeo 04 — página de jornal minimalista:
// papel off-white, manchete em serifa, foto P&B como recorte de matéria,
// marca-texto amarelo e acentos roxos da identidade da Ana.
import React from 'react';
import { AbsoluteFill, Easing } from 'remotion';
import { ci } from './motion';
import { NoiseOverlay, HalftoneOverlay } from './Background';
import { AssetImage } from './AssetImage';

export const J = {
  paper: '#F4F1EC',
  ink: '#1A1426',
  inkSoft: '#4A4458',
  purple: '#5B2E8C',
  purpleDeep: '#3B1F73',
  marker: '#F0C93D',
  serif: "'Playfair Display', Georgia, serif",
  sans: "'Montserrat', 'Helvetica Neue', Arial, sans-serif",
  track: -1,
} as const;

/** Fundo de papel de jornal — limpo, só textura sutil. */
export const JornalBg: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: J.paper }}>
    <div
      style={{
        position: 'absolute', inset: 0, opacity: 0.35, mixBlendMode: 'multiply',
        backgroundImage: `repeating-linear-gradient(115deg, rgba(0,0,0,0.03) 0px, transparent 2px, transparent 6px),
          repeating-linear-gradient(25deg, rgba(0,0,0,0.02) 0px, transparent 3px, transparent 9px)`,
      }}
    />
    <NoiseOverlay opacity={0.03} />
    <HalftoneOverlay opacity={0.025} />
    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 45%, transparent 60%, rgba(26,20,38,0.10) 100%)' }} />
  </AbsoluteFill>
);

/** Foto de matéria: P&B com retícula leve, margem branca fina e sombra curta. */
export const Clipping: React.FC<{
  file: string;
  width: number;
  height: number;
  objectPosition?: string;
  style?: React.CSSProperties;
  caption?: string;
}> = ({ file, width, height, objectPosition = '50% 50%', style, caption }) => (
  <div style={{ position: 'absolute', width, ...style }}>
    <div style={{ width, height, background: '#FFFFFF', padding: 10, boxShadow: '0 14px 34px rgba(26,20,38,0.22)', boxSizing: 'border-box' }}>
      <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
        <AssetImage
          file={file}
          label=""
          style={{ width: '100%', height: '100%', objectPosition, filter: 'grayscale(1) contrast(1.12) brightness(1.03)' }}
        />
        <div
          style={{
            position: 'absolute', inset: 0, mixBlendMode: 'multiply', opacity: 0.18,
            backgroundImage: 'radial-gradient(rgba(0,0,0,1) 1px, transparent 1.6px)', backgroundSize: '5px 5px',
          }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(91,46,140,0.12)', mixBlendMode: 'multiply' }} />
      </div>
    </div>
    {caption ? (
      <div style={{ marginTop: 10, fontFamily: J.serif, fontStyle: 'italic', fontWeight: 700, fontSize: 24, letterSpacing: J.track, color: J.inkSoft }}>
        {caption}
      </div>
    ) : null}
  </div>
);

/** Texto com marca-texto amarelo que "passa" da esquerda pra direita a partir de `at`. */
export const Marked: React.FC<{ frame: number; at: number; dur?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  frame,
  at,
  dur = 14,
  children,
  style,
}) => {
  const p = ci(frame, [at, at + dur], [0, 100], Easing.out(Easing.cubic));
  return (
    <span
      style={{
        backgroundImage: `linear-gradient(${J.marker}, ${J.marker})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: `${p}% 46%`,
        backgroundPosition: '0 85%',
        padding: '0 6px',
        boxDecorationBreak: 'clone',
        WebkitBoxDecorationBreak: 'clone',
        ...style,
      }}
    >
      {children}
    </span>
  );
};

/** Filete de jornal que se desenha. */
export const Rule: React.FC<{ frame: number; at: number; thick?: number; color?: string; origin?: 'left' | 'right' | 'center' }> = ({
  frame,
  at,
  thick = 3,
  color = J.ink,
  origin = 'left',
}) => (
  <div
    style={{
      height: thick,
      background: color,
      transform: `scaleX(${ci(frame, [at, at + 18], [0, 1], Easing.inOut(Easing.cubic))})`,
      transformOrigin: origin,
    }}
  />
);

/** Entrada de recorte: assenta na página (leve escala + rotação + foco). */
export const clipIn = (frame: number, at: number, rot = 0): React.CSSProperties => {
  const p = ci(frame, [at, at + 20], [0, 1], Easing.out(Easing.cubic));
  return {
    opacity: ci(frame, [at, at + 10], [0, 1]),
    transform: `translateY(${(1 - p) * 40}px) scale(${1.06 - 0.06 * p}) rotate(${rot * p}deg)`,
    filter: `blur(${(1 - p) * 12}px)`,
  };
};

/** Saída quádrupla padrão (posição + blur + opacity + scale), subindo. */
export const outUp = (frame: number, at: number, dur = 16, dist = 120): React.CSSProperties => {
  const p = ci(frame, [at, at + dur], [0, 1], Easing.in(Easing.exp));
  return {
    opacity: ci(p, [0.35, 1], [1, 0]),
    transform: `translateY(${-dist * p}px) scale(${1 - 0.05 * p})`,
    filter: `blur(${18 * p}px)`,
  };
};
