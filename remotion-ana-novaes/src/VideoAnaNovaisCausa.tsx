import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { Causa1_ACausa } from './scenes/Causa1_ACausa';
import { Causa2_Pilares } from './scenes/Causa2_Pilares';
import { Causa3_Recurso } from './scenes/Causa3_Recurso';
import { Causa4_Lockup } from './scenes/Causa4_Lockup';

export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 30;
export const TOTAL_FRAMES = 705; // ~23.5s

// Timing derivado de FORÇA DE ALINHAMENTO REAL (aeneas + espeak-ng, DTW por
// oração, ancorado nas pausas reais detectadas via ffmpeg silencedetect em
// narracao-causa.mp3) — mesmo método usado (e validado) no vídeo "A Marca".
// Cada palavra da transcrição tem um frame de início real medido no áudio.
export const CAUSA_SCENES = {
  c1: { from: 0, duration: 225 }, // "Ana Novais quer... Autista!" (0–180)
  c2: { from: 178, duration: 280 }, // "Como deputada... apoio às famílias." (181–432)
  c3: { from: 425, duration: 120 }, // "Também pretende... necessárias" (432–513)
  c4: { from: 505, duration: 200 }, // "e ampliar... assistência social." (513–662)
} as const;

export interface CausaAssets {
  retratoFrontal: string | null; // Ana, corpo inteiro, olhar de frente — Cena 1
  avatarPerfil: string | null; // Ana, recorte de rosto (perfil) — assinatura da Cena 4
  cardFrontal: string | null; // Ana, recorte quadrado (frontal) — card da mesa, Cena 2
  cardPerfil: string | null; // Ana, recorte quadrado (perfil) — card da mesa, Cena 2
  teaMente: string | null; // gráfico "mente + infinito" — card da mesa, Cena 2
  teaGlobo: string | null; // gráfico "pessoas ao redor do globo" — card da mesa, Cena 2
  narracao: string | null;
}

export const CAUSA_ASSETS: CausaAssets = {
  retratoFrontal: 'causa-ana-frontal.jpg',
  avatarPerfil: 'causa-avatar-perfil.jpg',
  cardFrontal: 'causa-card-frontal.jpg',
  cardPerfil: 'causa-card-perfil.jpg',
  teaMente: 'causa-tea-mente.png',
  teaGlobo: 'causa-tea-globo.png',
  narracao: 'narracao-causa.mp3',
};

export const VideoAnaNovaisCausa: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      {CAUSA_ASSETS.narracao ? <Audio src={staticFile(`assets/${CAUSA_ASSETS.narracao}`)} volume={1} /> : null}

      <Sequence name="Cena 1 — A Causa" from={CAUSA_SCENES.c1.from} durationInFrames={CAUSA_SCENES.c1.duration}>
        <Causa1_ACausa assets={CAUSA_ASSETS} />
      </Sequence>

      <Sequence name="Cena 2 — Os 4 Pilares" from={CAUSA_SCENES.c2.from} durationInFrames={CAUSA_SCENES.c2.duration}>
        <Causa2_Pilares assets={CAUSA_ASSETS} />
      </Sequence>

      <Sequence name="Cena 3 — O Recurso" from={CAUSA_SCENES.c3.from} durationInFrames={CAUSA_SCENES.c3.duration}>
        <Causa3_Recurso />
      </Sequence>

      <Sequence name="Cena 4 — Lockup Final" from={CAUSA_SCENES.c4.from} durationInFrames={CAUSA_SCENES.c4.duration}>
        <Causa4_Lockup assets={CAUSA_ASSETS} />
      </Sequence>
    </AbsoluteFill>
  );
};
