// Corte Editorial (Vídeo 03 v2) — primitivas de texto "adultas": nada pula,
// nada quica. Toda entrada é Easing.out(Easing.cubic) + desfoque + expansão
// de tracking; toda saída é Easing.in(Easing.exp). Zero springs.
import { Easing } from 'remotion';
import type { CSSProperties } from 'react';
import { ci } from './motion';

export const ED = {
  void: '#2D1643',
  deskPurple: '#3A1254',
  paper: '#F4EEF8',
  yellow: '#FCE300',
  alert: '#E63946',
  textDark: '#1A0D26',
  brandCore: '#7A4B94',
  lilac: '#B084C1',
  sans: "'Montserrat', 'Helvetica Neue', Arial, sans-serif",
  serif: "'Playfair Display', Georgia, serif",
} as const;

/** Revelação editorial: desfoque + tracking que se expande + opacidade (+ leve subida). */
export const edIn = (
  frame: number,
  at: number,
  { dur = 26, blur = 15, y = 20, trackFrom = -6, trackTo = -1 }: { dur?: number; blur?: number; y?: number; trackFrom?: number; trackTo?: number } = {}
): CSSProperties => {
  const p = ci(frame, [at, at + dur], [0, 1], Easing.out(Easing.cubic));
  return {
    opacity: ci(frame, [at, at + dur * 0.7], [0, 1], Easing.out(Easing.cubic)),
    filter: `blur(${blur * (1 - p)}px)`,
    transform: `translateY(${y * (1 - p)}px)`,
    letterSpacing: trackFrom + (trackTo - trackFrom) * p,
  };
};

/** Queda de papel na mesa: sobe/assenta com peso, sem quique. */
export const landIn = (frame: number, at: number, rot: number, dur = 30): CSSProperties => {
  const p = ci(frame, [at, at + dur], [0, 1], Easing.out(Easing.cubic));
  return {
    opacity: ci(frame, [at, at + 12], [0, 1]),
    filter: `blur(${10 * (1 - p)}px)`,
    transform: `translateY(${100 * (1 - p)}px) rotate(${rot}deg)`,
  };
};

/** Progresso de saída (Easing.in exp). */
export const outP = (frame: number, at: number, dur = 22) => ci(frame, [at, at + dur], [0, 1], Easing.in(Easing.exp));

export const HEAVY_SHADOW = '0 40px 80px rgba(0,0,0,0.6)';
