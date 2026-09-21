import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { Scene1_Manchete } from './scenes/Scene1_Manchete';
import { Scene2_Eco } from './scenes/Scene2_Eco';
import { Scene3_Arquivo } from './scenes/Scene3_Arquivo';
import { Scene4_Compromisso } from './scenes/Scene4_Compromisso';
import { Scene5_Assinatura } from './scenes/Scene5_Assinatura';

export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 30;
export const TOTAL_FRAMES = 720; // ~24s

// Overlap padrão de 7 frames entre cenas — mesma fórmula da decupagem:
// from[N] = from[N-1] + duration[N-1] - OVERLAP
const OVERLAP = 7;

export const SCENES = {
  s1: { from: 0, duration: 180 },
  s2: { from: 0 + 180 - OVERLAP, duration: 157 }, // 173
  s3: { from: 173 + 157 - OVERLAP, duration: 157 }, // 323
  s4: { from: 323 + 157 - OVERLAP, duration: 127 }, // 473
  s5: { from: 473 + 127 - OVERLAP, duration: 127 }, // 593
} as const;

/**
 * Assets do vídeo. Enquanto um campo estiver `null`, a cena correspondente
 * renderiza um placeholder no lugar certo (posição, proporção, sombra) — o
 * vídeo já pode ser visto e ajustado no Remotion Studio antes de recebermos
 * os arquivos finais.
 *
 * Para ativar um asset: coloque o arquivo em `public/assets/<nome>` e
 * preencha o campo correspondente abaixo com o nome do arquivo.
 */
export interface AnaNovaesAssets {
  retratoAna: string | null;
  mapaUmuarama: string | null;
  arquivo: [string | null, string | null, string | null];
  rua: [string | null, string | null, string | null];
  narracao: string | null;
}

export const ASSETS: AnaNovaesAssets = {
  retratoAna: null, // ex: 'retrato-ana.png'
  mapaUmuarama: null, // ex: 'mapa-umuarama.svg' (opcional — há placeholder vetorial próprio)
  arquivo: [null, null, null], // ex: ['arquivo-1.jpg', 'arquivo-2.jpg', 'arquivo-3.jpg']
  rua: [null, null, null], // ex: ['rua-1.jpg', 'rua-2.jpg', 'rua-3.jpg']
  narracao: null, // ex: 'narracao.mp3'
};

export const VideoAnaNovaes: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      {ASSETS.narracao ? <Audio src={staticFile(`assets/${ASSETS.narracao}`)} /> : null}

      <Sequence name="Cena 1 — A Manchete Histórica" from={SCENES.s1.from} durationInFrames={SCENES.s1.duration}>
        <Scene1_Manchete assets={ASSETS} />
      </Sequence>

      <Sequence name="Cena 2 — O Eco (Mapa e Número)" from={SCENES.s2.from} durationInFrames={SCENES.s2.duration}>
        <Scene2_Eco />
      </Sequence>

      <Sequence name="Cena 3 — O Arquivo Investigativo" from={SCENES.s3.from} durationInFrames={SCENES.s3.duration}>
        <Scene3_Arquivo assets={ASSETS} />
      </Sequence>

      <Sequence name="Cena 4 — O Compromisso (Rua)" from={SCENES.s4.from} durationInFrames={SCENES.s4.duration}>
        <Scene4_Compromisso assets={ASSETS} />
      </Sequence>

      <Sequence name="Cena 5 — A Assinatura (Lockup Final)" from={SCENES.s5.from} durationInFrames={SCENES.s5.duration}>
        <Scene5_Assinatura />
      </Sequence>
    </AbsoluteFill>
  );
};
