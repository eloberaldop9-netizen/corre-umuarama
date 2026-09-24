import React from 'react';
import { Composition } from 'remotion';
import { VideoAnaNovaes, TOTAL_FRAMES, FPS, WIDTH, HEIGHT } from './VideoAnaNovaes';
import { VideoAnaNovaisCausa, TOTAL_FRAMES as CAUSA_TOTAL_FRAMES } from './VideoAnaNovaisCausa';
import { VideoAnaNovaisCombate, TOTAL_FRAMES as COMBATE_TOTAL_FRAMES } from './VideoAnaNovaisCombate';
import { VideoAnaNovaisIdosos, TOTAL_FRAMES as IDOSOS_TOTAL_FRAMES } from './VideoAnaNovaisIdosos';
import { VideoAnaNovaisEducacao, TOTAL_FRAMES as EDUCACAO_TOTAL_FRAMES } from './VideoAnaNovaisEducacao';
import { VideoAnaNovaisFeminino, TOTAL_FRAMES as FEMININO_TOTAL_FRAMES } from './VideoAnaNovaisFeminino';
import { VideoAnaNovaisJovens, TOTAL_FRAMES as JOVENS_TOTAL_FRAMES } from './VideoAnaNovaisJovens';
import { VideoAnaNovaisProtecao, TOTAL_FRAMES as PROTECAO_TOTAL_FRAMES } from './VideoAnaNovaisProtecao';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AnaNovaes-AMarca"
        component={VideoAnaNovaes}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="AnaNovais-ACausa"
        component={VideoAnaNovaisCausa}
        durationInFrames={CAUSA_TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="AnaNovais-Combate"
        component={VideoAnaNovaisCombate}
        durationInFrames={COMBATE_TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="AnaNovais-Protecao"
        component={VideoAnaNovaisProtecao}
        durationInFrames={PROTECAO_TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="AnaNovais-Idosos"
        component={VideoAnaNovaisIdosos}
        durationInFrames={IDOSOS_TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="AnaNovais-Jovens"
        component={VideoAnaNovaisJovens}
        durationInFrames={JOVENS_TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="AnaNovais-Feminino"
        component={VideoAnaNovaisFeminino}
        durationInFrames={FEMININO_TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="AnaNovais-Educacao"
        component={VideoAnaNovaisEducacao}
        durationInFrames={EDUCACAO_TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
