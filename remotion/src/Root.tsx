import React from 'react';
import { Composition, Folder } from 'remotion';
import { NiponFestTeaser } from './compositions/NiponFestTeaser';
import { VIDEO } from './config/brand';
import { ensureFontsLoaded } from './lib/fonts';

ensureFontsLoaded();

export const Root: React.FC = () => {
  return (
    <>
      <Folder name="NiponFest2026">
        <Composition
          id="NiponFestTeaser"
          component={NiponFestTeaser}
          durationInFrames={VIDEO.durationInFrames}
          fps={VIDEO.fps}
          width={VIDEO.width}
          height={VIDEO.height}
        />
      </Folder>
    </>
  );
};
