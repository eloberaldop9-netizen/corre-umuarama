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
export const TOTAL_FRAMES = 822; // 27.4s — casado com a duração real do áudio de narração

// Overlap padrão de 7 frames entre cenas — mesma fórmula da decupagem:
// from[N] = from[N-1] + duration[N-1] - OVERLAP
//
// Durações estendidas em relação à decupagem original (720f/24s) para caber
// a narração gravada (27.4s = 822f). O tempo extra (+102f) foi distribuído
// proporcionalmente ao tamanho de cada trecho falado, como HOLD adicional
// (as entradas/saídas de cada cena mantêm o timing original — só o "respiro"
// do meio cresceu). Ajuste fino ainda pode ser necessário ouvindo o áudio.
const OVERLAP = 7;

export const SCENES = {
  s1: { from: 0, duration: 207 },
  s2: { from: 0 + 207 - OVERLAP, duration: 172 }, // 200
  s3: { from: 200 + 172 - OVERLAP, duration: 172 }, // 365
  s4: { from: 365 + 172 - OVERLAP, duration: 154 }, // 530
  s5: { from: 530 + 154 - OVERLAP, duration: 145 }, // 677 -> ends 822
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
  retratoAna: 'retrato-ana.jpg', // recorte da foto real dela na Câmara Municipal
  mapaUmuarama: null, // segue no placeholder vetorial próprio (AbstractMap em Scene2_Eco.tsx)
  arquivo: [
    'arquivo-banner.jpg', // banner oficial de campanha (Podemos)
    'arquivo-vitoria.jpg', // noite da vitória em 2020 (arco de balões, bandeira)
    'arquivo-camara-predio.jpg', // Ana em frente à Câmara Municipal de Umuarama
  ],
  rua: [
    'rua-1-abraco.jpg', // abraço em visita (cadeira de rodas)
    'rua-2-reuniao.jpg', // reunião com moradores
    'rua-3-abraco-idosa.jpg', // abraço com moradora na rua
  ],
  narracao: 'narracao.mp3',
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
