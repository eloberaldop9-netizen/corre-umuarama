import React from 'react';
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import { BackgroundBase } from '../components/BackgroundBase';
import { SeigaihaPattern } from '../components/SeigaihaPattern';
import { SakuraPetals } from '../components/SakuraPetals';
import { LogoReveal } from '../components/LogoReveal';
import { FilmGrain } from '../components/FilmGrain';
import { BRAND } from '../config/brand';
import { ciMulti } from '../lib/animation';

/** Cena 7 — Grande Reveal (0:17–0:20). O lockup oficial entra como protagonista. */
export const Scene07Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const flash = ciMulti(frame, [0, 3, 10], [0, 0.6, 0]);
  const glowPulse = 0.5 + Math.sin(frame * 0.05) * 0.06;

  return (
    <AbsoluteFill>
      <BackgroundBase color={BRAND.offWhite} glow={`rgba(215,25,32,${glowPulse * 0.14})`} />
      <SeigaihaPattern color={BRAND.black} opacity={0.045} />
      <SakuraPetals frame={frame} fps={30} width={width} height={height} count={10} seed={44} intensity={0.5} fadeInEnd={20} />

      <AbsoluteFill style={{ backgroundColor: BRAND.offWhite, opacity: flash, pointerEvents: 'none' }} />

      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <LogoReveal frame={frame} start={6} negative={false} scale={1} />
      </AbsoluteFill>

      <FilmGrain frame={frame} opacity={0.03} />
    </AbsoluteFill>
  );
};
