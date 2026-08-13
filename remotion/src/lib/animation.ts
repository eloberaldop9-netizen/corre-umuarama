import { Easing, interpolate, spring } from 'remotion';
import type { CSSProperties } from 'react';

/** Clamped interpolate — usar sempre em vez de interpolate cru. */
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

/** Clamped interpolate com múltiplos pontos (ex.: pulso 0→1→0). */
export const ciMulti = (
  frame: number,
  input: number[],
  output: number[],
  ease?: (t: number) => number
): number =>
  interpolate(frame, input, output, {
    easing: ease,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

export const SPRING = {
  text: { damping: 16, mass: 0.8 },
  card: { damping: 15, mass: 0.9 },
  petal: { damping: 12, mass: 0.6 },
  reveal: { damping: 18, mass: 1.1 },
  snappy: { damping: 20, mass: 0.6 },
} as const;

/** Entrada padrão: sobe + desfoca ao chegar (aterrissagem). */
export const entryUp = (
  frame: number,
  start: number,
  dur = 26,
  distance = 46
): CSSProperties => {
  const p = ci(frame, [start, start + dur], [0, 1], Easing.out(Easing.cubic));
  const y = ci(frame, [start, start + dur], [distance, 0], Easing.out(Easing.cubic));
  const bl = ci(frame, [start, start + dur * 0.6], [12, 0]);
  return { opacity: p, transform: `translateY(${y}px)`, filter: `blur(${bl}px)` };
};

/** Saída quadrupla: posição + blur + opacity + scale — nunca fade puro. */
export const exitTo = (
  frame: number,
  start: number,
  direction: 'left' | 'right' | 'top' | 'bottom',
  dur = 16,
  distance = 900
): CSSProperties => {
  const axis = direction === 'left' || direction === 'right' ? 'X' : 'Y';
  const sign = direction === 'left' || direction === 'top' ? -1 : 1;
  const p = ci(frame, [start, start + dur], [0, 1], Easing.in(Easing.exp));
  const pos = interpolate(p, [0, 1], [0, distance * sign]);
  const bl = interpolate(p, [0, 1], [0, 18]);
  const sc = interpolate(p, [0, 1], [1, 0.95]);
  const op = ci(p, [0.35, 1], [1, 0]);
  return { opacity: op, transform: `translate${axis}(${pos}px) scale(${sc})`, filter: `blur(${bl}px)` };
};

export const mergeStyles = (...styles: CSSProperties[]): CSSProperties => {
  let opacity = 1;
  const transforms: string[] = [];
  const filters: string[] = [];
  const rest: CSSProperties = {};
  for (const s of styles) {
    if (typeof s.opacity === 'number') opacity *= s.opacity;
    if (s.transform) transforms.push(String(s.transform));
    if (s.filter) filters.push(String(s.filter));
    for (const key of Object.keys(s)) {
      if (key === 'opacity' || key === 'transform' || key === 'filter') continue;
      (rest as Record<string, unknown>)[key] = (s as Record<string, unknown>)[key];
    }
  }
  return {
    ...rest,
    opacity,
    transform: transforms.length ? transforms.join(' ') : undefined,
    filter: filters.length ? filters.join(' ') : undefined,
  };
};

export const springUp = (
  frame: number,
  fps: number,
  delay: number,
  distance = 50,
  config: { damping: number; mass: number } = SPRING.text
): CSSProperties => {
  const sp = spring({ frame, fps, config, delay });
  const y = interpolate(sp, [0, 1], [distance, 0]);
  const bl = ci(frame - delay, [0, 16], [10, 0]);
  const op = ci(frame - delay, [0, 10], [0, 1]);
  return { opacity: op, transform: `translateY(${y}px)`, filter: `blur(${bl}px)` };
};

/** Gera N pseudo-aleatórios estáveis a partir de uma seed (sem depender de Math.random no render). */
export const seeded = (seed: number): number => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};
