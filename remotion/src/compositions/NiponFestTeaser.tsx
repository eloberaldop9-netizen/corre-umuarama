import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { Scene01Suspense } from '../scenes/Scene01Suspense';
import { Scene02Proposito } from '../scenes/Scene02Proposito';
import { Scene03Tradicao } from '../scenes/Scene03Tradicao';
import { Scene04Cultura } from '../scenes/Scene04Cultura';
import { Scene05Geracoes } from '../scenes/Scene05Geracoes';
import { Scene06Ikigai } from '../scenes/Scene06Ikigai';
import { Scene07Reveal } from '../scenes/Scene07Reveal';
import { Scene08Date } from '../scenes/Scene08Date';
import { SCENE_DURATIONS, SCENE_OVERLAP } from '../config/brand';

const SCENES = [
  Scene01Suspense,
  Scene02Proposito,
  Scene03Tradicao,
  Scene04Cultura,
  Scene05Geracoes,
  Scene06Ikigai,
  Scene07Reveal,
  Scene08Date,
];

/** Calcula o frame inicial de cada cena aplicando o overlap entre elas. */
const getSceneStarts = (): number[] => {
  const starts: number[] = [0];
  for (let i = 1; i < SCENE_DURATIONS.length; i++) {
    starts.push(starts[i - 1] + SCENE_DURATIONS[i - 1] - SCENE_OVERLAP);
  }
  return starts;
};

/**
 * ACEU Nipon Fest 2026 — "Vem Aí".
 * Orquestra as 8 cenas em Sequences com overlap para evitar frames vazios.
 * Cada cena é autocontida e recebe frame local via useCurrentFrame().
 */
export const NiponFestTeaser: React.FC = () => {
  const starts = getSceneStarts();

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {SCENES.map((SceneComponent, i) => (
        <Sequence key={SceneComponent.displayName ?? i} from={starts[i]} durationInFrames={SCENE_DURATIONS[i]}>
          <SceneComponent />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
