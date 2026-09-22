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
export const TOTAL_FRAMES = 839; // ~28.0s (narração real 25.4s + fade final)

// Timing derivado de FORÇA DE ALINHAMENTO REAL (aeneas + espeak-ng, DTW por
// oração, ancorado nas pausas reais detectadas via ffmpeg silencedetect em
// narracao-combate.mp3) — mesmo método validado nos vídeos "A Marca" e "A
// Causa". O mapa de cenas da diretriz original assumia ~23s; a narração real
// tem 25,39s e as pausas entre orações são bem mais curtas que o previsto,
// então os overlaps de 7 frames (padrão pedido na diretriz) caem exatamente
// nas pausas reais entre frases — não é estimativa, é onde o silêncio real
// está.
export const COMBATE_SCENES = {
  c1: { from: 0, duration: 122 }, // "Ana Novais quer... as mulheres" (0–115)
  c2: { from: 115, duration: 250 }, // "Como deputada federal... Patrulhas Maria da Penha" (122–356)
  c3: { from: 358, duration: 160 }, // "e maior acesso... botão do pânico" (365–510)
  c4: { from: 511, duration: 155 }, // "Por isso... capacitação profissional" (518–626)
  c5: { from: 659, duration: 180 }, // Lockup final — fala continua fora de quadro de legenda
} as const;

export interface CombateAssets {
  retratoStopX: string | null; // Ana, jaqueta vermelha, mão com X — Cena 1 (aguardando envio)
  fotoPatrulha: string | null; // Patrulha Maria da Penha — Cena 2
  fotoAcolhimento: string | null; // acolhimento / atendimento institucional — Cena 2
  fotoPanico: string | null; // celular com app "Botão do Pânico" — Cena 3
  fotoCapacitacao: string | null; // sala de aula / capacitação profissional — Cena 4
  narracao: string | null;
}

export const COMBATE_ASSETS: CombateAssets = {
  retratoStopX: null,
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
