import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';

export type SfxName =
  | 'impact'
  | 'whoosh-up'
  | 'whoosh-down'
  | 'click'
  | 'chime'
  | 'glitch'
  | 'pop'
  | 'stamp'
  | 'ding';

/** Drops a synthesized sound effect at a specific local frame in the current scene. */
export const Sfx: React.FC<{name: SfxName; from: number; volume?: number}> = ({
  name,
  from,
  volume = 0.5,
}) => (
  <Sequence from={from} layout="none">
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={volume} />
  </Sequence>
);
