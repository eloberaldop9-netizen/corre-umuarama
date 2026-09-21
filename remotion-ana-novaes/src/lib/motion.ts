// BRABO Motion O.S. v9.0 — Motor Executável (Parte 5 e 7 da skill)
// Primitivas de entrada, saída e springs validados. Toda animação do projeto
// passa por aqui — nunca duplicar lógica de easing/blur/opacity nas cenas.

import { Easing, interpolate, spring } from 'remotion';
import type { CSSProperties } from 'react';

export type Direction = 'left' | 'right' | 'top' | 'bottom';

/** Clamped interpolate — SEMPRE usar em vez de interpolate cru. */
export const ci = (
  frame: number,
  [f0, f1]: [number, number],
  [v0, v1]: [number, number],
  ease?: (t: number) => number
): number =>
  interpolate(frame, [f0, f1], [v0, v1], {
    easing: ease,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

// ─────────────────────────────────────────────────────────────────────────
// SPRING CONFIGS VALIDADOS (Parte 7)
// ─────────────────────────────────────────────────────────────────────────
export const SPRING = {
  text: { damping: 14, mass: 0.8 },
  card: { damping: 13, mass: 0.9 },
  badge: { damping: 12, mass: 0.7, stiffness: 120 },
  icon: { damping: 10, mass: 0.8, stiffness: 120 },
  morph: { damping: 14, mass: 1.0 },
  snappy: { damping: 18, mass: 0.6, stiffness: 200 },
  heavy: { damping: 16, mass: 1.2 },
  bouncy: { damping: 8, mass: 0.8, stiffness: 150 },
  // Configs específicas pedidas na decupagem do vídeo Ana Novaes:
  overshootViolent: { damping: 8, mass: 1.5, stiffness: 90 },
} as const;

// ─────────────────────────────────────────────────────────────────────────
// PRIMITIVAS DE ENTRADA
// ─────────────────────────────────────────────────────────────────────────

export const entryUp = (frame: number, start: number, dur = 22): CSSProperties => {
  const p = ci(frame, [start, start + dur], [0, 1], Easing.out(Easing.cubic));
  const y = ci(frame, [start, start + dur], [40, 0], Easing.out(Easing.cubic));
  const bl = ci(frame, [start, start + dur * 0.6], [12, 0]);
  return { opacity: p, transform: `translateY(${y}px)`, filter: `blur(${bl}px)` };
};

export const entrySpring = (
  frame: number,
  fps: number,
  delay: number,
  cfg: Parameters<typeof spring>[0]['config'] = SPRING.text
): CSSProperties => {
  const sp = spring({ frame, fps, config: cfg, delay });
  const y = interpolate(sp, [0, 1], [50, 0]);
  const bl = ci(frame - delay, [0, 15], [12, 0]);
  const op = ci(frame - delay, [0, 10], [0, 1]);
  return { opacity: op, transform: `translateY(${y}px)`, filter: `blur(${bl}px)` };
};

export const entryBounce = (frame: number, start: number, dur = 18): CSSProperties => {
  const p = ci(frame, [start, start + dur], [0, 1]);
  const sc = ci(frame, [start, start + dur], [0.6, 1], Easing.out(Easing.back(1.7)));
  const bl = ci(frame, [start, start + dur * 0.5], [6, 0]);
  return { opacity: p, transform: `scale(${sc})`, filter: `blur(${bl}px)` };
};

export const entry3D = (
  frame: number,
  start: number,
  direction: 'left' | 'right' = 'right',
  dur = 28
): CSSProperties => {
  const tx = ci(frame, [start, start + dur], [direction === 'right' ? 1200 : -1200, 0], Easing.out(Easing.exp));
  const ry = ci(frame, [start, start + dur], [direction === 'right' ? 52 : -52, 0], Easing.out(Easing.exp));
  const op = ci(frame, [start, start + 14], [0, 1]);
  return {
    opacity: op,
    transform: `perspective(1400px) rotateY(${ry}deg) translateX(${tx}px)`,
  };
};

export const entryFrom = (
  frame: number,
  start: number,
  direction: Direction,
  distance = 400,
  dur = 25
): CSSProperties => {
  const p = ci(frame, [start, start + dur], [0, 1], Easing.out(Easing.cubic));
  const bl = ci(frame, [start, start + dur * 0.7], [14, 0]);
  const axis = direction === 'left' || direction === 'right' ? 'X' : 'Y';
  const sign = direction === 'left' || direction === 'top' ? -1 : 1;
  const pos = ci(frame, [start, start + dur], [distance * sign, 0], Easing.out(Easing.cubic));
  return { opacity: p, transform: `translate${axis}(${pos}px)`, filter: `blur(${bl}px)` };
};

export const entryScaleX = (frame: number, start: number, dur = 20): CSSProperties => {
  const sc = ci(frame, [start, start + dur], [0, 1], Easing.out(Easing.cubic));
  const op = ci(frame, [start, start + 8], [0, 1]);
  return { opacity: op, transform: `scaleX(${sc})`, transformOrigin: 'left center' };
};

/** Entrada tipo "carimbo": overshoot violento em scale, usada nos números hero. */
export const entryStamp = (
  frame: number,
  fps: number,
  delay: number,
  fromScale = 4
): CSSProperties => {
  const sp = spring({ frame, fps, config: SPRING.overshootViolent, delay });
  const sc = interpolate(sp, [0, 1], [fromScale, 1]);
  const bl = ci(frame - delay, [0, 20], [30, 0]);
  const op = ci(frame - delay, [0, 8], [0, 1]);
  return { opacity: op, transform: `scale(${sc})`, filter: `blur(${bl}px)` };
};

// ─────────────────────────────────────────────────────────────────────────
// PRIMITIVAS DE SAÍDA (Saída Quadrupla SEMPRE: posição + blur + opacity + scale)
// ─────────────────────────────────────────────────────────────────────────

export const exitUp = (frame: number, start: number, dur = 15): CSSProperties => {
  const y = ci(frame, [start, start + dur], [0, -40], Easing.in(Easing.cubic));
  const bl = ci(frame, [start, start + dur * 0.5], [0, 14]);
  const op = ci(frame, [start + dur * 0.3, start + dur], [1, 0]);
  const sc = ci(frame, [start, start + dur], [1, 0.95]);
  return { opacity: op, transform: `translateY(${y}px) scale(${sc})`, filter: `blur(${bl}px)` };
};

export const exitTo = (
  frame: number,
  start: number,
  direction: Direction,
  distance = 1200,
  dur = 16
): CSSProperties => {
  const axis = direction === 'left' || direction === 'right' ? 'X' : 'Y';
  const sign = direction === 'left' || direction === 'top' ? -1 : 1;
  const pos = ci(frame, [start, start + dur], [0, distance * sign], Easing.in(Easing.exp));
  const bl = ci(frame, [start, start + dur], [0, 20]);
  const sc = ci(frame, [start, start + dur], [1, 0.94]);
  const op = ci(frame, [start + dur * 0.35, start + dur], [1, 0]);
  return { opacity: op, transform: `translate${axis}(${pos}px) scale(${sc})`, filter: `blur(${bl}px)` };
};

export const exitExplosive = (
  frame: number,
  start: number,
  direction: Direction = 'left',
  dur = 11
): CSSProperties => {
  const p = ci(frame, [start, start + dur], [0, 1], Easing.in(Easing.exp));
  const axis = direction === 'left' || direction === 'right' ? 'X' : 'Y';
  const sign = direction === 'left' || direction === 'top' ? -1 : 1;
  return {
    opacity: ci(p, [0.4, 1], [1, 0]),
    transform: `translate${axis}(${p * 1500 * sign}px) scale(${1 - p * 0.08})`,
    filter: `blur(${p * 28}px)`,
  };
};

/** Saída "engole a tela": scale explode até cobrir tudo (usada no rasga da Cena 1). */
export const exitDevour = (frame: number, start: number, dur = 15, toScale = 30): CSSProperties => {
  const sc = ci(frame, [start, start + dur], [1, toScale], Easing.in(Easing.exp));
  const op = ci(frame, [start, start + dur], [1, 0]);
  return { opacity: op, transform: `scale(${sc})` };
};

/** Saída "suga para o centro": colapso gravitacional (usada na Cena 2). */
export const exitCollapse = (
  frame: number,
  start: number,
  dur = 20,
  rotateZ = -15
): CSSProperties => {
  const sc = ci(frame, [start, start + dur], [1, 0.1], Easing.in(Easing.exp));
  const bl = ci(frame, [start, start + dur], [0, 40]);
  const op = ci(frame, [start, start + dur], [1, 0]);
  const rz = ci(frame, [start, start + dur], [0, rotateZ], Easing.in(Easing.exp));
  return { opacity: op, transform: `scale(${sc}) rotateZ(${rz}deg)`, filter: `blur(${bl}px)` };
};

/** Saída "vira a mesa": flip 3D no eixo X (usada na Cena 3). */
export const exitFlipX = (frame: number, start: number, dur = 22): CSSProperties => {
  const rx = ci(frame, [start, start + dur], [0, 90], Easing.in(Easing.exp));
  const y = ci(frame, [start, start + dur], [0, 1200], Easing.in(Easing.exp));
  const bl = ci(frame, [start, start + dur], [0, 40]);
  const op = ci(frame, [start + dur * 0.5, start + dur], [1, 0]);
  return {
    opacity: op,
    transform: `perspective(1200px) rotateX(${rx}deg) translateY(${y}px)`,
    filter: `blur(${bl}px)`,
  };
};

/** Saída "derrete": blur + brightness afundando no preto (usada na Cena 4). */
export const exitMelt = (frame: number, start: number, dur = 22): CSSProperties => {
  const bl = ci(frame, [start, start + dur], [0, 50]);
  const br = ci(frame, [start, start + dur], [1, 0]);
  const sc = ci(frame, [start, start + dur], [1, 1.1]);
  const op = ci(frame, [start + dur * 0.4, start + dur], [1, 0]);
  return {
    opacity: op,
    transform: `scale(${sc})`,
    filter: `blur(${bl}px) brightness(${br})`,
  };
};

// Helpers para composição manual de saídas custom
export const ep = (frame: number, start: number, end: number) =>
  ci(frame, [start, end], [0, 1], Easing.in(Easing.exp));
export const gx = (p: number, dist = 1200) => interpolate(p, [0, 1], [0, -dist]);
export const gy = (p: number, dist = 400) => interpolate(p, [0, 1], [0, -dist]);
export const go = (p: number) => ci(p, [0.35, 0.85], [1, 0]);
export const gb = (p: number, max = 18) => interpolate(p, [0, 1], [0, max]);
export const gs = (p: number, min = 0.93) => interpolate(p, [0, 1], [1, min]);

// ─────────────────────────────────────────────────────────────────────────
// COMBINADOR DE ESTILOS
// ─────────────────────────────────────────────────────────────────────────
export const mergeStyles = (...styles: CSSProperties[]): CSSProperties => {
  let opacity = 1;
  const transforms: string[] = [];
  const filters: string[] = [];
  const rest: CSSProperties = {};
  for (const s of styles) {
    if (typeof s.opacity === 'number') opacity *= s.opacity;
    if (s.transform) transforms.push(s.transform);
    if (s.filter) filters.push(s.filter as string);
    Object.assign(rest, s, { opacity: undefined, transform: undefined, filter: undefined });
  }
  return {
    ...rest,
    opacity,
    transform: transforms.length ? transforms.join(' ') : undefined,
    filter: filters.length ? filters.join(' ') : undefined,
  };
};

// ─────────────────────────────────────────────────────────────────────────
// HANDHELD SHAKE — determinístico (sin/cos), nunca Math.random (Mandamento p/ renders reprodutíveis)
// ─────────────────────────────────────────────────────────────────────────
export const handheldShake = (frame: number, intensity = 1): CSSProperties => {
  const x = (Math.sin(frame * 0.17) * 6 + Math.sin(frame * 0.41) * 2) * intensity;
  const y = (Math.cos(frame * 0.13) * 4 + Math.cos(frame * 0.37) * 1.5) * intensity;
  const rot = (Math.sin(frame * 0.1) + Math.cos(frame * 0.15)) * 0.5 * intensity;
  return { transform: `translate(${x}px, ${y}px) rotate(${rot}deg)` };
};
