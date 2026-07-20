import React from 'react';
import {Composition} from 'remotion';
import {JarbasCugulaTriade} from './JarbasCugulaTriade';
import {OQueDizALei} from './OQueDizALei';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="JarbasCugulaTriade"
        component={JarbasCugulaTriade}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="OQueDizALei"
        component={OQueDizALei}
        durationInFrames={90}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
