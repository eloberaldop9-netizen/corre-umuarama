import React from 'react';
import { Composition } from 'remotion';
import { VideoAnaNovaes, TOTAL_FRAMES, FPS, WIDTH, HEIGHT } from './VideoAnaNovaes';

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
    </>
  );
};
