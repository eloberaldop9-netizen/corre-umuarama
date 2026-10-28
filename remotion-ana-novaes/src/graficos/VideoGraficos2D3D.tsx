import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { Scene1 } from './scenes/Scene1';
import { Scene2 } from './scenes/Scene2';
import { Scene3 } from './scenes/Scene3';
import { Scene4 } from './scenes/Scene4';
import { Grain } from './Grain';

// Gráficos 2D vs 3D na Comunicação — 60s vertical (1080×1920 @ 30fps).
// Mapa de cenas da decupagem: overlap de 7 frames entre todas as cenas.
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 30;
export const TOTAL_FRAMES = 1800;

export const OVERLAP = 7;

export const SCENES = {
  c1: { from: 0, duration: 300 }, // 0–300     O Nascimento do Volume
  c2: { from: 293, duration: 457 }, // 293–750   O Dinamismo do 2D
  c3: { from: 743, duration: 607 }, // 743–1350  A Profundidade do 3D
  c4: { from: 1343, duration: 457 }, // 1343–1800 Comunicação de Outro Nível
} as const;

export const VideoGraficos2D3D: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#000' }}>
    <Sequence name="Cena 1 — O Nascimento do Volume" from={SCENES.c1.from} durationInFrames={SCENES.c1.duration}>
      <Scene1 />
    </Sequence>
    <Sequence name="Cena 2 — O Dinamismo do 2D" from={SCENES.c2.from} durationInFrames={SCENES.c2.duration}>
      <Scene2 />
    </Sequence>
    <Sequence name="Cena 3 — A Profundidade do 3D" from={SCENES.c3.from} durationInFrames={SCENES.c3.duration}>
      <Scene3 />
    </Sequence>
    <Sequence name="Cena 4 — Comunicação de Outro Nível" from={SCENES.c4.from} durationInFrames={SCENES.c4.duration}>
      <Scene4 />
    </Sequence>
    <Grain />
  </AbsoluteFill>
);
