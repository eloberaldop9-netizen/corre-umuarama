import React from 'react';
import { Composition } from 'remotion';
import { VideoAnaNovaes, TOTAL_FRAMES, FPS, WIDTH, HEIGHT } from './VideoAnaNovaes';
import { VideoAnaNovaisCausa, TOTAL_FRAMES as CAUSA_TOTAL_FRAMES } from './VideoAnaNovaisCausa';
import { VideoAnaNovaisCombate, TOTAL_FRAMES as COMBATE_TOTAL_FRAMES } from './VideoAnaNovaisCombate';

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
    </>
  );
};
