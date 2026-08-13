import React from 'react';
import { AbsoluteFill, interpolate } from 'remotion';
import { ci, seeded } from '../lib/animation';
import { BRAND } from '../config/brand';

const PetalShape: React.FC<{ size: number; color: string; opacity: number }> = ({
  size,
  color,
  opacity,
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block' }}>
    <path
      d="M50 6 C 68 6 78 26 74 46 C 71 62 60 78 50 94 C 40 78 29 62 26 46 C 22 26 32 6 50 6 Z"
      fill={color}
      opacity={opacity}
    />
    <path d="M50 6 C 46 30 46 68 50 94" stroke={color} strokeOpacity={0.35} strokeWidth={1.5} fill="none" />
  </svg>
);

interface SakuraPetalsProps {
  frame: number;
  fps: number;
  count?: number;
  seed?: number;
  width: number;
  height: number;
  intensity?: number; // multiplica velocidade/amplitude — usar mais alto em builds de energia
  fadeInEnd?: number;
  fadeOutStart?: number;
  fadeOutEnd?: number;
}

/**
 * Campo de pétalas com parallax em 3 profundidades e leve física (queda +
 * deriva senoidal + rotação). Cada camada tem escala/blur/velocidade
 * distintos para dar profundidade real, não um loop genérico de partículas.
 */
export const SakuraPetals: React.FC<SakuraPetalsProps> = ({
  frame,
  fps,
  count = 14,
  seed = 1,
  width,
  height,
  intensity = 1,
  fadeInEnd = 20,
  fadeOutStart = 999999,
  fadeOutEnd = 1000000,
}) => {
  const layers = [
    { depth: 'near', scale: [46, 64], blur: 3.5, speedY: 34, ampX: 60, opacity: 0.85, share: 0.25 },
    { depth: 'mid', scale: [26, 38], blur: 0, speedY: 22, ampX: 40, opacity: 0.9, share: 0.4 },
    { depth: 'far', scale: [14, 20], blur: 2.5, speedY: 13, ampX: 24, opacity: 0.55, share: 0.35 },
  ] as const;

  const globalFade =
    ci(frame, [0, fadeInEnd], [0, 1]) * (1 - ci(frame, [fadeOutStart, fadeOutEnd], [0, 1]));

  const petals: React.ReactNode[] = [];
  let idx = 0;
  for (const layer of layers) {
    const layerCount = Math.round(count * layer.share);
    for (let i = 0; i < layerCount; i++) {
      const s = seed * 97 + idx * 13.37;
      const sizeT = seeded(s + 1);
      const size = layer.scale[0] + sizeT * (layer.scale[1] - layer.scale[0]);
      const startX = seeded(s + 2) * width;
      const startYOffset = seeded(s + 3) * height;
      const speed = (layer.speedY * (0.7 + seeded(s + 4) * 0.6)) / fps * intensity;
      const t = frame;
      const y = ((startYOffset + t * speed) % (height + 160)) - 80;
      const freq = 0.012 + seeded(s + 5) * 0.01;
      const x = startX + Math.sin(t * freq + s) * layer.ampX;
      const rot = t * (0.8 + seeded(s + 6) * 1.4) * (seeded(s + 7) > 0.5 ? 1 : -1) + s * 40;
      const sway = Math.sin(t * 0.05 + s) * 8;

      petals.push(
        <div
          key={idx}
          style={{
            position: 'absolute',
            left: x,
            top: y,
            opacity: layer.opacity * globalFade,
            filter: layer.blur ? `blur(${layer.blur}px)` : undefined,
            transform: `translate(-50%, -50%) rotate(${rot + sway}deg)`,
          }}
        >
          <PetalShape size={size} color={BRAND.red} opacity={0.92} />
        </div>
      );
      idx++;
    }
  }

  return <AbsoluteFill style={{ pointerEvents: 'none' }}>{petals}</AbsoluteFill>;
};

interface CrossCameraPetalProps {
  frame: number;
  start: number;
  dur?: number;
  width: number;
  height: number;
  fromLeft?: boolean;
}

/**
 * Uma única pétala grande que atravessa a lente em alta velocidade,
 * usada como transição/gatilho de corte entre cenas (não decoração).
 */
export const CrossCameraPetal: React.FC<CrossCameraPetalProps> = ({
  frame,
  start,
  dur = 16,
  width,
  height,
  fromLeft = true,
}) => {
  const p = ci(frame, [start, start + dur], [0, 1]);
  if (p <= 0 || p >= 1) return null;
  const x = fromLeft
    ? ci(p, [0, 1], [-width * 0.25, width * 1.25])
    : ci(p, [0, 1], [width * 1.25, -width * 0.25]);
  const y = height * 0.42 + Math.sin(p * Math.PI) * -height * 0.14;
  const size = interpolate(p, [0, 0.5, 1], [260, 520, 260], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const blur = interpolate(p, [0, 0.15, 0.85, 1], [26, 4, 4, 26], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const rot = p * 260;

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          left: x,
          top: y,
          transform: `translate(-50%, -50%) rotate(${rot}deg)`,
          filter: `blur(${blur}px)`,
        }}
      >
        <PetalShape size={size} color={BRAND.red} opacity={0.96} />
      </div>
    </AbsoluteFill>
  );
};
