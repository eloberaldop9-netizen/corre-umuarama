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
export const TOTAL_FRAMES = 919; // ~30.6s (narração real 25.4s + fade final)

// Timing v2 — recalculado com a TRANSCRIÇÃO CORRETA E COMPLETA fornecida pela
// usuária (a v1 tinha ~20 palavras inteiras faltando no meio da Cena 2, o que
// desalinhou tudo a partir dali). Força de alinhamento real (aeneas +
// espeak-ng, DTW por oração — a Cena 2 precisou ser sub-dividida em 3 blocos
// menores pois uma oração de 20 palavras contínuas quebrava o DTW de uma vez
// só), ancorado nas pausas reais via ffmpeg silencedetect em
// narracao-combate.mp3. As pausas entre orações são curtas (7-9 frames), por
// isso todo overlap entre cenas é o padrão de 7 frames.
export const COMBATE_SCENES = {
  c1: { from: 0, duration: 122 }, // "Ana Novais quer... as mulheres" (6–115)
  c2: { from: 115, duration: 324 }, // "Como deputada federal... mecanismos de proteção," (122–438)
  c3: { from: 432, duration: 79 }, // "como o botão do pânico!" (446–510)
  c4: { from: 504, duration: 272 }, // "Por isso... em situação de violência!" (518–761)
  c5: { from: 769, duration: 150 }, // Lockup final — sem fala (narração termina em 761)
} as const;

export interface CombateAssets {
  retratoStopX: string | null; // Ana, jaqueta vermelha, mão com X — Cena 1
  fotoPatrulha: string | null; // Patrulha Maria da Penha — Cena 2
  fotoAcolhimento: string | null; // acolhimento / atendimento institucional — Cena 2
  fotoPanico: string | null; // celular com app "Botão do Pânico" — Cena 3
  fotoCapacitacao: string | null; // sala de aula / capacitação profissional — Cena 4
  retratoOficial: string | null; // retrato institucional (câmara ao fundo) — Cena 5, fundo do lockup
  narracao: string | null;
}

export const COMBATE_ASSETS: CombateAssets = {
  retratoStopX: 'combate-stopx.jpg',
  retratoOficial: 'combate-retrato-oficial.jpg',
  fotoPatrulha: 'combate-patrulha.jpg',
  fotoAcolhimento: 'combate-acolhimento.jpg',
  fotoPanico: 'combate-panico.jpg',
  fotoCapacitacao: 'combate-capacitacao.jpg',
  narracao: 'narracao-combate.mp3',
};

export const VideoAnaNovaisCombate: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      {COMBATE_ASSETS.narracao ? <Audio src={staticFile(`assets/${COMBATE_ASSETS.narracao}`)} volume={1} /> : null}

      <Sequence name="Cena 1 — A Postura" from={COMBATE_SCENES.c1.from} durationInFrames={COMBATE_SCENES.c1.duration}>
        <Combate1_Postura assets={COMBATE_ASSETS} />
      </Sequence>

      <Sequence name="Cena 2 — A Rede de Proteção" from={COMBATE_SCENES.c2.from} durationInFrames={COMBATE_SCENES.c2.duration}>
        <Combate2_Rede assets={COMBATE_ASSETS} />
      </Sequence>

      <Sequence name="Cena 3 — O Mecanismo" from={COMBATE_SCENES.c3.from} durationInFrames={COMBATE_SCENES.c3.duration}>
        <Combate3_Panico assets={COMBATE_ASSETS} />
      </Sequence>

      <Sequence name="Cena 4 — O Recomeço" from={COMBATE_SCENES.c4.from} durationInFrames={COMBATE_SCENES.c4.duration}>
        <Combate4_Recomeco assets={COMBATE_ASSETS} />
      </Sequence>

      <Sequence name="Cena 5 — Lockup Institucional" from={COMBATE_SCENES.c5.from} durationInFrames={COMBATE_SCENES.c5.duration}>
        <Combate5_Lockup assets={COMBATE_ASSETS} />
      </Sequence>
    </AbsoluteFill>
  );
};
