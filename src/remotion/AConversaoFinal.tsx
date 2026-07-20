import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {Scene1Gancho} from './scenes/Scene1Gancho';
import {Scene2Instagram} from './scenes/Scene2Instagram';
import {useMontserratFont} from './fonts';

export const AConversaoFinal: React.FC = () => {
  useMontserratFont();

  return (
    <AbsoluteFill style={{backgroundColor: '#000000'}}>
      <Sequence from={0} durationInFrames={80}>
        <Scene1Gancho />
      </Sequence>
      <Sequence from={73} durationInFrames={107}>
        <Scene2Instagram />
      </Sequence>
    </AbsoluteFill>
  );
};
