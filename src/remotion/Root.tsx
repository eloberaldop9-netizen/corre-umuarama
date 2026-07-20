import React from 'react';
import {Composition} from 'remotion';
import {JarbasCugulaTriade} from './JarbasCugulaTriade';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="JarbasCugulaTriade"
      component={JarbasCugulaTriade}
      durationInFrames={300}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
