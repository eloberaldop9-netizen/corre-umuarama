import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { Idosos1_Cuidado } from './scenes/Idosos1_Cuidado';
import { Idosos2_Deputada } from './scenes/Idosos2_Deputada';
import { Idosos3_Trincheira } from './scenes/Idosos3_Trincheira';
import { Idosos4_Leis } from './scenes/Idosos4_Leis';
import { Idosos5_Programa } from './scenes/Idosos5_Programa';
import { Idosos6_Lista } from './scenes/Idosos6_Lista';
import { Idosos7_Selo } from './scenes/Idosos7_Selo';
import { IDOSOS_ASSETS, IDOSOS_SCENES, IDOSOS_TOTAL_FRAMES } from './idosos-timing';

// Vídeo 05 — "Ana Novais — Cuidado e Proteção" (idosos, Centros-Dia).
// Mesma gramática do vídeo 03 aprovado: Montserrat única, Hero Letterings
// ancorados na fala, Easing.out(cubic) sem springs, fotos inteiras,
// terço inferior livre para a legenda.
export const TOTAL_FRAMES = IDOSOS_TOTAL_FRAMES;

export const VideoAnaNovaisIdosos: React.FC = () => {
  const S = IDOSOS_SCENES;
  const A = IDOSOS_ASSETS;
  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      <Audio src={staticFile(`assets/${A.narracao}`)} />
      <Sequence name="Cena 1 — O Cuidado" from={S.c1.from} durationInFrames={S.c1.duration}><Idosos1_Cuidado assets={A} /></Sequence>
      <Sequence name="Cena 2 — A Deputada" from={S.c2.from} durationInFrames={S.c2.duration}><Idosos2_Deputada assets={A} /></Sequence>
      <Sequence name="Cena 3 — A Trincheira" from={S.c3.from} durationInFrames={S.c3.duration}><Idosos3_Trincheira assets={A} /></Sequence>
      <Sequence name="Cena 4 — As Leis" from={S.c4.from} durationInFrames={S.c4.duration}><Idosos4_Leis assets={A} /></Sequence>
      <Sequence name="Cena 5 — Programa Federal" from={S.c5.from} durationInFrames={S.c5.duration}><Idosos5_Programa /></Sequence>
      <Sequence name="Cena 6 — A Entrega" from={S.c6.from} durationInFrames={S.c6.duration}><Idosos6_Lista /></Sequence>
      <Sequence name="Cena 7 — O Selo" from={S.c7.from} durationInFrames={S.c7.duration}><Idosos7_Selo /></Sequence>
    </AbsoluteFill>
  );
};
