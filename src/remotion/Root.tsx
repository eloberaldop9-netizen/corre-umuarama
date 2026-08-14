import React from 'react';
import {Composition} from 'remotion';
import {AlertaIptvVideo} from './AlertaIptvVideo';
import {DURATION_IN_FRAMES, FPS, HEIGHT, WIDTH} from './constants';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="AlertaIptv"
      component={AlertaIptvVideo}
      durationInFrames={DURATION_IN_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
