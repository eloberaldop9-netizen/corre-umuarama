import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { Combate1_Postura } from './scenes/Combate1_Postura';
import { Combate2_Rede } from './scenes/Combate2_Rede';
import { Combate3_Panico } from './scenes/Combate3_Panico';
import { Combate4_Recomeco } from './scenes/Combate4_Recomeco';
import { Combate5_Lockup } from './scenes/Combate5_Lockup';

export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 30;

import { COMBATE_ASSETS, COMBATE_SCENES, TOTAL_FRAMES } from './combate-timing';

export { TOTAL_FRAMES };
export type { CombateAssets } from './combate-timing';

export const VideoAnaNovaisCombate: React.FC = () => {
  const S = COMBATE_SCENES;
  const A = COMBATE_ASSETS;
  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      <Audio src={staticFile(`assets/${A.narracao}`)} />
      <Sequence name="Cena 1 — A Postura" from={S.c1.from} durationInFrames={S.c1.duration}>
        <Combate1_Postura assets={A} />
      </Sequence>
      <Sequence name="Cena 2 — A Rede" from={S.c2.from} durationInFrames={S.c2.duration}>
        <Combate2_Rede assets={A} />
      </Sequence>
      <Sequence name="Cena 3 — O Mecanismo" from={S.c3.from} durationInFrames={S.c3.duration}>
        <Combate3_Panico assets={A} />
      </Sequence>
      <Sequence name="Cena 4 — O Recomeço" from={S.c4.from} durationInFrames={S.c4.duration}>
        <Combate4_Recomeco assets={A} />
      </Sequence>
      <Sequence name="Cena 5 — O Selo" from={S.c5.from} durationInFrames={S.c5.duration}>
        <Combate5_Lockup />
      </Sequence>
    </AbsoluteFill>
  );
};
