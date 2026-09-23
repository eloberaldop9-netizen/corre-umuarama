import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { Jovens1_Oportunidades } from './scenes/Jovens1_Oportunidades';
import { Jovens2_Qualificacao } from './scenes/Jovens2_Qualificacao';
import { Jovens3_Empreendedorismo } from './scenes/Jovens3_Empreendedorismo';
import { Jovens4_Negocios } from './scenes/Jovens4_Negocios';
import { Jovens5_Selo } from './scenes/Jovens5_Selo';
import { JOVENS_ASSETS, JOVENS_SCENES, JOVENS_TOTAL_FRAMES } from './jovens-timing';

// Vídeo 06 — "Ana Novais — Capacitação para Jovens e Primeiro Emprego".
// Mesma gramática dos vídeos 03/05 aprovados: Montserrat única, Hero
// Letterings ancorados na fala, Easing.out(cubic) sem springs, fotos
// inteiras, terço inferior livre para a legenda.
export const TOTAL_FRAMES = JOVENS_TOTAL_FRAMES;

export const VideoAnaNovaisJovens: React.FC = () => {
  const S = JOVENS_SCENES;
  const A = JOVENS_ASSETS;
  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      <Audio src={staticFile(`assets/${A.narracao}`)} />
      <Sequence name="Cena 1 — Oportunidades" from={S.c1.from} durationInFrames={S.c1.duration}><Jovens1_Oportunidades assets={A} /></Sequence>
      <Sequence name="Cena 2 — Qualificação" from={S.c2.from} durationInFrames={S.c2.duration}><Jovens2_Qualificacao /></Sequence>
      <Sequence name="Cena 3 — Empreendedorismo" from={S.c3.from} durationInFrames={S.c3.duration}><Jovens3_Empreendedorismo /></Sequence>
      <Sequence name="Cena 4 — Novos Negócios" from={S.c4.from} durationInFrames={S.c4.duration}><Jovens4_Negocios /></Sequence>
      <Sequence name="Cena 5 — O Selo" from={S.c5.from} durationInFrames={S.c5.duration}><Jovens5_Selo /></Sequence>
    </AbsoluteFill>
  );
};
