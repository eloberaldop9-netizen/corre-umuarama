import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { Protecao1_Manchete } from './scenes/Protecao1_Manchete';
import { Protecao2_Dossie } from './scenes/Protecao2_Dossie';
import { Protecao3_Leis } from './scenes/Protecao3_Leis';
import { Protecao4_Rede } from './scenes/Protecao4_Rede';
import { Protecao5_Lockup } from './scenes/Protecao5_Lockup';
import { PROTECAO_SCENES, PROTECAO_TOTAL_FRAMES } from './protecao-timing';

// Vídeo 04 — "Ana Novais — O Dossiê da Proteção"
// Proposta: combate à violência contra crianças e adolescentes.
// Estética: colagem documental (papel jornal, recortes rasgados, fita,
// halftone) nas cores da Ana. Legenda palavra por palavra em TODA a fala +
// letterings hero em cada cena.
export const TOTAL_FRAMES = PROTECAO_TOTAL_FRAMES;

export interface ProtecaoAssets {
  retratoAna: string; // Cena 1 — retrato halftone
  fotoCriancas: string; // Cena 1 — recorte CRIANÇAS
  fotoCaminho: string; // Cena 1 — recorte ADOLESCENTES
  fotoLaco: string; // Cena 2 — PREVENÇÃO
  fotoEscola: string; // Cena 2 — EDUCAÇÃO NAS ESCOLAS
  fotoAtendimento: string; // Cena 2 — ATENDIMENTO
  fotoMente: string; // Cena 2 — PSICOLÓGICO
  fotoMaos: string; // Cena 4 — rede / mãos dadas
  retratoOficial: string; // Cena 5 — fundo do lockup
  /** null até o mp3 da narração chegar. */
  narracao: string | null;
}

export const PROTECAO_ASSETS: ProtecaoAssets = {
  retratoAna: 'causa-frontal-tight.jpg',
  fotoCriancas: 'protecao-criancas.jpg',
  fotoCaminho: 'protecao-caminho.jpg',
  fotoLaco: 'protecao-laco.jpg',
  fotoEscola: 'protecao-escola.jpg',
  fotoAtendimento: 'protecao-atendimento.jpg',
  fotoMente: 'protecao-mente.jpg',
  fotoMaos: 'protecao-maos.jpg',
  retratoOficial: 'combate-retrato-oficial.jpg',
  narracao: null,
};

export const VideoAnaNovaisProtecao: React.FC = () => {
  const A = PROTECAO_ASSETS;
  const S = PROTECAO_SCENES;
  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      {A.narracao ? <Audio src={staticFile(`assets/${A.narracao}`)} /> : null}
      <Sequence name="Cena 1 — A Manchete" from={S.c1.from} durationInFrames={S.c1.duration}>
        <Protecao1_Manchete assets={A} />
      </Sequence>
      <Sequence name="Cena 2 — O Dossiê da Prevenção" from={S.c2.from} durationInFrames={S.c2.duration}>
        <Protecao2_Dossie assets={A} />
      </Sequence>
      <Sequence name="Cena 3 — O Peso da Lei" from={S.c3.from} durationInFrames={S.c3.duration}>
        <Protecao3_Leis />
      </Sequence>
      <Sequence name="Cena 4 — A Rede Integrada" from={S.c4.from} durationInFrames={S.c4.duration}>
        <Protecao4_Rede assets={A} />
      </Sequence>
      <Sequence name="Cena 5 — Lockup" from={S.c5.from} durationInFrames={S.c5.duration}>
        <Protecao5_Lockup assets={A} />
      </Sequence>
    </AbsoluteFill>
  );
};
