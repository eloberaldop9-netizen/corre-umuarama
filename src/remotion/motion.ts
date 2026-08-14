// BRABO Motion O.S. v9.0 primitives — adapted for this project.
import {Easing, interpolate, spring} from 'remotion';
import type React from 'react';

export type Direction = 'left' | 'right' | 'top' | 'bottom';

/** Clamped interpolate — always use this instead of raw interpolate. */
export const ci = (
  frame: number,
  [f0, f1]: [number, number],
  [v0, v1]: [number, number],
  ease?: (t: number) => number,
): number =>
  interpolate(frame, [f0, f1], [v0, v1], {
    easing: ease,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

export const SPRING = {
  text: {damping: 14, mass: 0.8},
  card: {damping: 13, mass: 0.9},
  badge: {damping: 12, mass: 0.7},
  icon: {damping: 10, mass: 0.8},
  morph: {damping: 14, mass: 1.0},
  snappy: {damping: 18, mass: 0.6},
  heavy: {damping: 16, mass: 1.2},
  bouncy: {damping: 8, mass: 0.8},
} as const;

// ---- ENTRADAS ----

export const entryUp = (frame: number, start: number, dur = 22): React.CSSProperties => {
  const p = ci(frame, [start, start + dur], [0, 1], Easing.out(Easing.cubic));
  const y = ci(frame, [start, start + dur], [40, 0], Easing.out(Easing.cubic));
  const bl = ci(frame, [start, start + dur * 0.6], [12, 0]);
  return {opacity: p, transform: `translateY(${y}px)`, filter: `blur(${bl}px)`};
};

export const entrySpringStyle = (
  frame: number,
  fps: number,
  delay: number,
  cfg: {damping: number; mass: number} = SPRING.text,
): React.CSSProperties => {
  const sp = spring({frame, fps, config: cfg, delay});
  const y = interpolate(sp, [0, 1], [50, 0]);
  const bl = ci(frame - delay, [0, 15], [12, 0]);
  const op = ci(frame - delay, [0, 10], [0, 1]);
  return {opacity: op, transform: `translateY(${y}px)`, filter: `blur(${bl}px)`};
};

export const entryBounce = (frame: number, start: number, dur = 18): React.CSSProperties => {
  const p = ci(frame, [start, start + dur], [0, 1]);
  const sc = ci(frame, [start, start + dur], [0.6, 1], Easing.out(Easing.back(1.7)));
  const bl = ci(frame, [start, start + dur * 0.5], [6, 0]);
  return {opacity: p, transform: `scale(${sc})`, filter: `blur(${bl}px)`};
};

export const entry3D = (
  frame: number,
  start: number,
  direction: 'left' | 'right' = 'right',
  dur = 28,
): React.CSSProperties => {
  const op = ci(frame, [start, start + 14], [0, 1]);
  const tx = ci(frame, [start, start + dur], [direction === 'right' ? 1200 : -1200, 0], Easing.out(Easing.exp));
  const ry = ci(frame, [start, start + dur], [direction === 'right' ? 52 : -52, 0], Easing.out(Easing.exp));
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
  dur = 25,
): React.CSSProperties => {
  const p = ci(frame, [start, start + dur], [0, 1], Easing.out(Easing.cubic));
  const bl = ci(frame, [start, start + dur * 0.7], [14, 0]);
  const axis = direction === 'left' || direction === 'right' ? 'X' : 'Y';
  const sign = direction === 'left' || direction === 'top' ? -1 : 1;
  const pos = ci(frame, [start, start + dur], [distance * sign, 0], Easing.out(Easing.cubic));
  return {opacity: p, transform: `translate${axis}(${pos}px)`, filter: `blur(${bl}px)`};
};

export const entryScaleX = (frame: number, start: number, dur = 20): React.CSSProperties => {
  const sc = ci(frame, [start, start + dur], [0, 1], Easing.out(Easing.cubic));
  const op = ci(frame, [start, start + 8], [0, 1]);
  return {opacity: op, transform: `scaleX(${sc})`, transformOrigin: 'left center'};
};

// ---- SAÍDAS (sempre quádruplas: posição + blur + opacity + scale) ----

export const exitUp = (frame: number, start: number, dur = 15): React.CSSProperties => {
  const y = ci(frame, [start, start + dur], [0, -40], Easing.in(Easing.cubic));
  const bl = ci(frame, [start, start + dur * 0.5], [0, 14]);
  const op = ci(frame, [start + dur * 0.3, start + dur], [1, 0]);
  const sc = ci(frame, [start, start + dur], [1, 0.95]);
  return {opacity: op, transform: `translateY(${y}px) scale(${sc})`, filter: `blur(${bl}px)`};
};

export const exitTo = (
  frame: number,
  start: number,
  direction: Direction,
  distance = 1200,
  dur = 16,
): React.CSSProperties => {
  const axis = direction === 'left' || direction === 'right' ? 'X' : 'Y';
  const sign = direction === 'left' || direction === 'top' ? -1 : 1;
  const pos = ci(frame, [start, start + dur], [0, distance * sign], Easing.in(Easing.exp));
  const bl = ci(frame, [start, start + dur], [0, 20]);
  const sc = ci(frame, [start, start + dur], [1, 0.94]);
  const op = ci(frame, [start + dur * 0.35, start + dur], [1, 0]);
  return {opacity: op, transform: `translate${axis}(${pos}px) scale(${sc})`, filter: `blur(${bl}px)`};
};

export const exitExplosive = (
  frame: number,
  start: number,
  direction: Direction = 'left',
  dur = 11,
): React.CSSProperties => {
  const p = ci(frame, [start, start + dur], [0, 1], Easing.in(Easing.exp));
  const axis = direction === 'left' || direction === 'right' ? 'X' : 'Y';
  const sign = direction === 'left' || direction === 'top' ? -1 : 1;
  return {
    opacity: ci(p, [0.4, 1], [1, 0]),
    transform: `translate${axis}(${p * 1500 * sign}px) scale(${1 - p * 0.08})`,
    filter: `blur(${p * 28}px)`,
  };
};

export const mergeStyles = (
  a: React.CSSProperties,
  b: React.CSSProperties,
): React.CSSProperties => {
  const aOp = typeof a.opacity === 'number' ? a.opacity : 1;
  const bOp = typeof b.opacity === 'number' ? b.opacity : 1;
  return {
    opacity: aOp * bOp,
    transform: [a.transform, b.transform].filter(Boolean).join(' ') || undefined,
    filter: [a.filter, b.filter].filter(Boolean).join(' ') || undefined,
  };
};
