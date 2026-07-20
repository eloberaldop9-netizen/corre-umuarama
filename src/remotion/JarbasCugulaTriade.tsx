import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {Scene1Saude} from './scenes/Scene1Saude';
import {Scene2Seguranca} from './scenes/Scene2Seguranca';
import {Scene3Sossego} from './scenes/Scene3Sossego';
import {Scene4Logo} from './scenes/Scene4Logo';
import {useMontserratFont} from './fonts';

export const JarbasCugulaTriade: React.FC = () => {
  useMontserratFont();

  return (
    <AbsoluteFill style={{backgroundColor: '#000000'}}>
      <Sequence from={0} durationInFrames={90}>
        <Scene1Saude />
      </Sequence>
      <Sequence from={83} durationInFrames={87}>
        <Scene2Seguranca />
      </Sequence>
      <Sequence from={163} durationInFrames={87}>
        <Scene3Sossego />
      </Sequence>
      <Sequence from={243} durationInFrames={57}>
        <Scene4Logo />
      </Sequence>
    </AbsoluteFill>
  );
};
