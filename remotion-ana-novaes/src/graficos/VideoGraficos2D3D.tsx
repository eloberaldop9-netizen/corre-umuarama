import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { CineA } from './scenes/CineA';
import { CineB } from './scenes/CineB';
import { CineC } from './scenes/CineC';
import { CineD } from './scenes/CineD';
import { Grain } from './Grain';

// Gráficos 2D e 3D na Comunicação — 60s vertical (1080×1920 @ 30fps).
// Mapa de cenas do Pensamento de Vídeo: overlap de 7 frames entre todas.
// from[N] = from[N-1] + duration[N-1] - OVERLAP
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 30;
export const TOTAL_FRAMES = 1800;
export const OVERLAP = 7;

const C1 = { from: 0, duration: 300 }; //                       0–300     O Nascimento da Massa
const C2 = { from: C1.from + C1.duration - OVERLAP, duration: 457 }; // 293–750   A Força do 2D
const C3 = { from: C2.from + C2.duration - OVERLAP, duration: 607 }; // 743–1350  A Profundidade do 3D
const C4 = { from: C3.from + C3.duration - OVERLAP, duration: 457 }; // 1343–1800 Comunicação de Outro Nível

export const SCENES = { c1: C1, c2: C2, c3: C3, c4: C4 } as const;

if (C4.from + C4.duration !== TOTAL_FRAMES) {
  throw new Error(`Mapa de cenas soma ${C4.from + C4.duration} frames, esperado ${TOTAL_FRAMES}.`);
}

// Ordem de empilhamento ditada pelas transições (JSX posterior = camada acima):
//   C1 → C2  Z-Dive Estouro    — o cromo vira azul POR CIMA da C2 e entrega
//   C2 → C3  Destrutivo X      — as lâminas da C2 rasgam e revelam a C3 POR BAIXO
//   C3 → C4  Blockout Híbrido  — a UI da C4 desliza POR CIMA da massa da C3
export const VideoGraficos2D3D: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#000' }}>
    <Sequence name="Cena 3 — A Profundidade do 3D" from={C3.from} durationInFrames={C3.duration}>
      <CineC />
    </Sequence>
    <Sequence name="Cena 2 — A Força do 2D" from={C2.from} durationInFrames={C2.duration}>
      <CineB />
    </Sequence>
    <Sequence name="Cena 1 — O Nascimento da Massa" from={C1.from} durationInFrames={C1.duration}>
      <CineA />
    </Sequence>
    <Sequence name="Cena 4 — Comunicação de Outro Nível" from={C4.from} durationInFrames={C4.duration}>
      <CineD />
    </Sequence>
    <Grain opacity={0.04} />
  </AbsoluteFill>
);
