import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { Protecao1_Combate } from './scenes/Protecao1_Combate';
import { Protecao2_Propostas } from './scenes/Protecao2_Propostas';
import { Protecao3_Leis } from './scenes/Protecao3_Leis';
import { Protecao4_Rede } from './scenes/Protecao4_Rede';
import { PROTECAO_SCENES, PROTECAO_TOTAL_FRAMES } from './protecao-timing';

// Vídeo 04 — "Ana Novais — Proteção à Infância"
// Proposta: combate à violência contra crianças e adolescentes.
// Base visual: o vídeo aprovado "A Causa" (v7) — minimalista, só os
// letterings-chave na tela (sem legenda corrida), 4 cenas, fade final.
export const TOTAL_FRAMES = PROTECAO_TOTAL_FRAMES;

export interface ProtecaoAssets {
  retratoAna: string; // Cena 1 — retrato emoldurado
  fotoMaos: string; // Cena 2 — PREVENÇÃO
  fotoEscola: string; // Cena 2 — EDUCAÇÃO
  fotoAtendimento: string; // Cena 2 — ATENDIMENTO
  fotoAcolhimento: string; // Cena 2 — APOIO ÀS VÍTIMAS
  fundoCamara: string; // Cenas 3 e 4 — fundo escuro
  /** null até o mp3 da narração chegar. */
  narracao: string | null;
}

export const PROTECAO_ASSETS: ProtecaoAssets = {
  retratoAna: 'combate-retrato-oficial.jpg',
  fotoMaos: 'protecao-maos.jpg',
  fotoEscola: 'protecao-escola.jpg',
  fotoAtendimento: 'protecao-atendimento.jpg',
  fotoAcolhimento: 'combate-acolhimento.jpg',
  fundoCamara: 'arquivo-camara-predio.jpg',
  narracao: null,
};

export const VideoAnaNovaisProtecao: React.FC = () => {
  const A = PROTECAO_ASSETS;
  const S = PROTECAO_SCENES;
  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      {A.narracao ? <Audio src={staticFile(`assets/${A.narracao}`)} /> : null}
      <Sequence name="Cena 1 — O Combate" from={S.c1.from} durationInFrames={S.c1.duration}>
        <Protecao1_Combate assets={A} />
      </Sequence>
      <Sequence name="Cena 2 — As Propostas" from={S.c2.from} durationInFrames={S.c2.duration}>
        <Protecao2_Propostas assets={A} />
      </Sequence>
      <Sequence name="Cena 3 — As Leis" from={S.c3.from} durationInFrames={S.c3.duration}>
        <Protecao3_Leis assets={A} />
      </Sequence>
      <Sequence name="Cena 4 — A Rede Integrada" from={S.c4.from} durationInFrames={S.c4.duration}>
        <Protecao4_Rede assets={A} />
      </Sequence>
    </AbsoluteFill>
  );
};
