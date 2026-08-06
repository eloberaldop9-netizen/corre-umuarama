import React from 'react';
import { Composition } from 'remotion';
import { UaiCienciaIntro } from './UaiCienciaIntro';
import { UaiTofuReveal, DURATION as UAI_TOFU_DURATION } from './UaiTofuReveal';
import { UaiSoyToProduct, DURATION as UAI_SOY_DURATION } from './UaiSoyToProduct';
import { UaiTofuMantra, DURATION as UAI_MANTRA_DURATION, FPS as UAI_MANTRA_FPS } from './UaiTofuMantra';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="UaiTofuReveal"
        component={UaiTofuReveal}
        durationInFrames={UAI_TOFU_DURATION}
        fps={60}
        width={1080}
        height={1920}
      />
      <Composition
        id="UaiSoyToProduct"
        component={UaiSoyToProduct}
        durationInFrames={UAI_SOY_DURATION}
        fps={60}
        width={1080}
        height={1920}
      />
      <Composition
        id="UaiTofuMantra"
        component={UaiTofuMantra}
        durationInFrames={UAI_MANTRA_DURATION}
        fps={UAI_MANTRA_FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="UaiCienciaIntro"
        component={UaiCienciaIntro}
        durationInFrames={120}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ subtitle: 'com Dr. Éric Slywitch' }}
      />
      <Composition
        id="UaiCienciaIntroEntrevista"
        component={UaiCienciaIntro}
        durationInFrames={120}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ subtitle: 'Entrevista com Dr. Eric' }}
      />
    </>
  );
};
