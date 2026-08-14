import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {SCENE_STARTS, SCENE_DURATIONS} from './constants';
import {fontsCss} from './fonts';
import {Scene1Alerta} from './scenes/Scene1Alerta';
import {Scene2Problema} from './scenes/Scene2Problema';
import {Scene3Teste} from './scenes/Scene3Teste';
import {Scene4Conclusao} from './scenes/Scene4Conclusao';
import {Scene5V10Net} from './scenes/Scene5V10Net';
import {Scene6Cta} from './scenes/Scene6Cta';

const scenes = [
  {key: 'scene1Alerta', Component: Scene1Alerta},
  {key: 'scene2Problema', Component: Scene2Problema},
  {key: 'scene3Teste', Component: Scene3Teste},
  {key: 'scene4Conclusao', Component: Scene4Conclusao},
  {key: 'scene5V10Net', Component: Scene5V10Net},
  {key: 'scene6Cta', Component: Scene6Cta},
] as const;

export const AlertaIptvVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000000'}}>
      <style dangerouslySetInnerHTML={{__html: fontsCss}} />
      <Audio src={staticFile('video/alerta-voiceover.mp3')} />

      {[...scenes].reverse().map(({key, Component}, reversedIndex) => {
        const zIndex = (reversedIndex + 1) * 10;
        return (
          <Sequence
            key={key}
            from={SCENE_STARTS[key]}
            durationInFrames={SCENE_DURATIONS[key]}
            style={{zIndex}}
          >
            <Component />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
