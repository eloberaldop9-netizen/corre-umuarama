import React from 'react';
import { Easing, Img, staticFile } from 'remotion';
import { ci } from './motion';

/** Polígono de borda rasgada irregular (determinístico por seed). */
export const tornPolygon = (seed: number) => {
  const r = (n: number) => {
    const v = Math.sin(seed * 12.9898 + n * 78.233) * 43758.5453;
    return v - Math.floor(v);
  };
  const N = 16;
  const pts: string[] = [];
  for (let i = 0; i <= N; i++) pts.push(`${(i / N) * 100}% ${r(i) * 5}%`);
  for (let i = 1; i <= N; i++) pts.push(`${100 - r(i + 30) * 4}% ${(i / N) * 100}%`);
  for (let i = 1; i <= N; i++) pts.push(`${100 - (i / N) * 100}% ${100 - r(i + 60) * 5}%`);
  for (let i = 1; i < N; i++) pts.push(`${r(i + 90) * 4}% ${100 - (i / N) * 100}%`);
  return `polygon(${pts.join(',')})`;
};

/** Foto de jornal rasgada (P&B + retícula) que assenta no frame `at`. */
export const TornPhoto: React.FC<{
  frame: number; at: number; file: string; w: number; h: number; pos: string; seed: number; rot: number; opacity?: number; shadow?: string;
}> = ({ frame, at, file, w, h, pos, seed, rot, opacity = 1, shadow = 'drop-shadow(0 30px 40px rgba(45,22,67,0.25))' }) => {
  const p = ci(frame, [at, at + 24], [0, 1], Easing.out(Easing.cubic));
  return (
    <div style={{ opacity: opacity * p, transform: `translateY(${50 * (1 - p)}px) rotate(${rot}deg)`, filter: `blur(${12 * (1 - p)}px) ${shadow}` }}>
      <div style={{ position: 'relative', width: w, height: h, clipPath: tornPolygon(seed), background: '#E6E2DA', padding: 12 }}>
        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
          <Img src={staticFile(`assets/${file}`)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, filter: 'grayscale(1) contrast(1.3)' }} />
          <div style={{ position: 'absolute', inset: 0, mixBlendMode: 'multiply', opacity: 0.3, backgroundImage: 'radial-gradient(rgba(0,0,0,1) 1.2px, transparent 1.8px)', backgroundSize: '6px 6px' }} />
        </div>
      </div>
    </div>
  );
};
