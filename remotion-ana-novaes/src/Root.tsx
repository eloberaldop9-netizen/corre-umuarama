import React from 'react';
import { Composition } from 'remotion';
import { VideoAnaNovaes, TOTAL_FRAMES, FPS, WIDTH, HEIGHT } from './VideoAnaNovaes';
import { VideoAnaNovaisCausa, TOTAL_FRAMES as CAUSA_TOTAL_FRAMES } from './VideoAnaNovaisCausa';
import { VideoAnaNovaisCombate, TOTAL_FRAMES as COMBATE_TOTAL_FRAMES } from './VideoAnaNovaisCombate';
import {
  VideoGraficos2D3D,
  TOTAL_FRAMES as GRAFICOS_TOTAL_FRAMES,
  FPS as GRAFICOS_FPS,
  WIDTH as GRAFICOS_WIDTH,
  HEIGHT as GRAFICOS_HEIGHT,
  SCENES,
} from './graficos/VideoGraficos2D3D';
import { CineA } from './graficos/scenes/CineA';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AnaNovaes-AMarca"
        component={VideoAnaNovaes}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="AnaNovais-ACausa"
        component={VideoAnaNovaisCausa}
        durationInFrames={CAUSA_TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="AnaNovais-Combate"
        component={VideoAnaNovaisCombate}
        durationInFrames={COMBATE_TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="Graficos2D-vs-3D"
        component={VideoGraficos2D3D}
        durationInFrames={GRAFICOS_TOTAL_FRAMES}
        fps={GRAFICOS_FPS}
        width={GRAFICOS_WIDTH}
        height={GRAFICOS_HEIGHT}
      />
      {/* Cenas isoladas do Gráficos 2D vs 3D — revisão cena a cena */}
      <Composition
        id="Graficos-Cena1"
        component={CineA}
        durationInFrames={SCENES.c1.duration}
        fps={GRAFICOS_FPS}
        width={GRAFICOS_WIDTH}
        height={GRAFICOS_HEIGHT}
      />
    </>
  );
};
