import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {SCENE_STARTS, SCENE_DURATIONS} from './constants';
import {Scene1Alerta} from './scenes/Scene1Alerta';
import {Scene2Homem} from './scenes/Scene2Homem';
import {Scene3Familia} from './scenes/Scene3Familia';
import {Scene4Solucao} from './scenes/Scene4Solucao';

export const AlertaIptvVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000000'}}>
      <Audio src={staticFile('video/alerta-voiceover.mp3')} />

      <Sequence
        from={SCENE_STARTS.scene4}
        durationInFrames={SCENE_DURATIONS.scene4}
        style={{zIndex: 10}}
      >
        <Scene4Solucao />
      </Sequence>

      <Sequence
        from={SCENE_STARTS.scene3}
        durationInFrames={SCENE_DURATIONS.scene3}
        style={{zIndex: 20}}
      >
        <Scene3Familia />
      </Sequence>

      <Sequence
        from={SCENE_STARTS.scene2}
        durationInFrames={SCENE_DURATIONS.scene2}
        style={{zIndex: 30}}
      >
        <Scene2Homem />
      </Sequence>

      <Sequence
        from={SCENE_STARTS.scene1}
        durationInFrames={SCENE_DURATIONS.scene1}
        style={{zIndex: 40}}
      >
        <Scene1Alerta />
      </Sequence>
    </AbsoluteFill>
  );
};
