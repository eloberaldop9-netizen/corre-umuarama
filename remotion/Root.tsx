import React from 'react';
import { Composition } from 'remotion';
import { UaiCienciaIntro } from './UaiCienciaIntro';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="UaiCienciaIntro"
        component={UaiCienciaIntro}
        durationInFrames={120}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
