import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { Feminino1_Sonho } from './scenes/Feminino1_Sonho';
import { Feminino2_Deputada } from './scenes/Feminino2_Deputada';
import { Feminino3_Infra } from './scenes/Feminino3_Infra';
import { Feminino4_Mercado } from './scenes/Feminino4_Mercado';
import { Feminino5_Selo } from './scenes/Feminino5_Selo';
import { FEMININO_ASSETS, FEMININO_SCENES, FEMININO_TOTAL_FRAMES } from './feminino-timing';

// Vídeo 07 — "Ana Novais — Fomento ao Empreendedorismo Feminino".
// Mesma gramática dos vídeos aprovados: Montserrat única, Hero Letterings
// ancorados na fala, Easing.out(cubic) sem springs, fotos inteiras,
// composições grandes e centralizadas na margem de segurança do Reels,
// saídas suaves só depois da leitura.
export const TOTAL_FRAMES = FEMININO_TOTAL_FRAMES;

export const VideoAnaNovaisFeminino: React.FC = () => {
  const S = FEMININO_SCENES;
  const A = FEMININO_ASSETS;
  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      <Audio src={staticFile(`assets/${A.narracao}`)} />
      <Sequence name="Cena 1 — O Sonho e o Negócio" from={S.c1.from} durationInFrames={S.c1.duration}><Feminino1_Sonho assets={A} /></Sequence>
      <Sequence name="Cena 2 — A Deputada e o Programa" from={S.c2.from} durationInFrames={S.c2.duration}><Feminino2_Deputada assets={A} /></Sequence>
      <Sequence name="Cena 3 — A Infraestrutura" from={S.c3.from} durationInFrames={S.c3.duration}><Feminino3_Infra /></Sequence>
      <Sequence name="Cena 4 — O Mercado" from={S.c4.from} durationInFrames={S.c4.duration}><Feminino4_Mercado assets={A} /></Sequence>
      <Sequence name="Cena 5 — O Selo" from={S.c5.from} durationInFrames={S.c5.duration}><Feminino5_Selo /></Sequence>
    </AbsoluteFill>
  );
};
