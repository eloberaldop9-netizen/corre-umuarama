import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { Combate1_Postura } from './scenes/Combate1_Postura';
import { Combate2a_Deputada } from './scenes/Combate2a_Deputada';
import { Combate2b_Recursos } from './scenes/Combate2b_Recursos';
import { Combate2c_Protecao } from './scenes/Combate2c_Protecao';
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
      <Sequence name="Cena 2a — A Deputada" from={S.c2a.from} durationInFrames={S.c2a.duration}>
        <Combate2a_Deputada assets={A} />
      </Sequence>
      <Sequence name="Cena 2b — Os Recursos" from={S.c2b.from} durationInFrames={S.c2b.duration}>
        <Combate2b_Recursos />
      </Sequence>
      <Sequence name="Cena 2c — A Rede de Proteção" from={S.c2c.from} durationInFrames={S.c2c.duration}>
        <Combate2c_Protecao />
      </Sequence>
      <Sequence name="Cena 3 — A Colagem" from={S.c3.from} durationInFrames={S.c3.duration}>
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
