import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { Educacao1_Compromisso } from './scenes/Educacao1_Compromisso';
import { Educacao2_Recursos } from './scenes/Educacao2_Recursos';
import { Educacao3_Ecossistema } from './scenes/Educacao3_Ecossistema';
import { Educacao4_Selo } from './scenes/Educacao4_Selo';
import { EDUCACAO_ASSETS, EDUCACAO_SCENES, EDUCACAO_TOTAL_FRAMES } from './educacao-timing';

// Vídeo 08 — "Ana Novais — Educação".
// Mesma gramática dos vídeos aprovados: Montserrat única, Hero Letterings
// ancorados na fala, Easing.out(cubic) sem springs, fotos inteiras,
// composições grandes e centralizadas na margem de segurança do Reels,
// saídas suaves só depois da leitura.
export const TOTAL_FRAMES = EDUCACAO_TOTAL_FRAMES;

export const VideoAnaNovaisEducacao: React.FC = () => {
  const S = EDUCACAO_SCENES;
  const A = EDUCACAO_ASSETS;
  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      <Audio src={staticFile(`assets/${A.narracao}`)} />
      <Sequence name="Cena 1 — O Compromisso Público" from={S.c1.from} durationInFrames={S.c1.duration}><Educacao1_Compromisso assets={A} /></Sequence>
      <Sequence name="Cena 2 — A Estrutura Federal" from={S.c2.from} durationInFrames={S.c2.duration}><Educacao2_Recursos /></Sequence>
      <Sequence name="Cena 3 — O Ecossistema Inclusivo" from={S.c3.from} durationInFrames={S.c3.duration}><Educacao3_Ecossistema assets={A} /></Sequence>
      <Sequence name="Cena 4 — O Selo" from={S.c4.from} durationInFrames={S.c4.duration}><Educacao4_Selo /></Sequence>
    </AbsoluteFill>
  );
};
