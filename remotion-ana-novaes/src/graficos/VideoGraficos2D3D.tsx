import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { CineA } from './scenes/CineA';
import { CineB } from './scenes/CineB';
import { CineC } from './scenes/CineC';
import { CineD } from './scenes/CineD';
import { Grain } from './Grain';

// Gráficos 2D e 3D na Comunicação — 60s vertical (1080×1920 @ 30fps).
// Mapa de cenas do Pensamento de Vídeo: overlap de 7 frames entre todas.
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 30;
export const TOTAL_FRAMES = 1800;
export const OVERLAP = 7;

export const SCENES = {
  c1: { from: 0, duration: 300 }, // 0–300     O Nascimento da Massa
  c2: { from: 300 - OVERLAP, duration: 457 }, // 293–750   A Força do 2D
  c3: { from: 750 - OVERLAP, duration: 607 }, // 743–1350  A Profundidade do 3D
  c4: { from: 1350 - OVERLAP, duration: 457 }, // 1343–1800 Comunicação de Outro Nível
} as const;

export const VideoGraficos2D3D: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#000' }}>
    <Sequence name="Cena 1 — O Nascimento da Massa" from={SCENES.c1.from} durationInFrames={SCENES.c1.duration}>
      <CineA />
    </Sequence>
    <Sequence name="Cena 2 — A Força do 2D" from={SCENES.c2.from} durationInFrames={SCENES.c2.duration}>
      <CineB />
    </Sequence>
    <Sequence name="Cena 3 — A Profundidade do 3D" from={SCENES.c3.from} durationInFrames={SCENES.c3.duration}>
      <CineC />
    </Sequence>
    <Sequence name="Cena 4 — Comunicação de Outro Nível" from={SCENES.c4.from} durationInFrames={SCENES.c4.duration}>
      <CineD />
    </Sequence>
    <Grain opacity={0.04} />
  </AbsoluteFill>
);
