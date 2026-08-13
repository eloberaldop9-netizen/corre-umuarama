import React from 'react';
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import { BackgroundBase } from '../components/BackgroundBase';
import { SeigaihaPattern } from '../components/SeigaihaPattern';
import { SakuraPetals } from '../components/SakuraPetals';
import { LogoReveal } from '../components/LogoReveal';
import { AnimatedText } from '../components/AnimatedText';
import { FilmGrain } from '../components/FilmGrain';
import { BRAND, FONTS, SAFE_AREA } from '../config/brand';
import { TEXTS } from '../config/texts';
import { ci } from '../lib/animation';

/** Cena 8 — Data / Encerramento (0:20–0:22). Composição final, tela segura para leitura. */
export const Scene08Date: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const breathe = 1 + Math.sin(frame * 0.045) * 0.012;

  return (
    <AbsoluteFill>
      <BackgroundBase color={BRAND.offWhite} glow="rgba(215,25,32,0.08)" />
      <SeigaihaPattern color={BRAND.black} opacity={0.05} />
      <SakuraPetals frame={frame} fps={30} width={width} height={height} count={8} seed={51} intensity={0.35} fadeInEnd={10} />

      <AbsoluteFill
        style={{
          alignItems: 'center',
          paddingTop: SAFE_AREA.top,
          paddingLeft: SAFE_AREA.left,
          paddingRight: SAFE_AREA.right,
        }}
      >
        <div style={{ opacity: ci(frame, [0, 16], [0, 1], Easing.out(Easing.cubic)) }}>
          <LogoReveal frame={frame} start={0} negative={false} scale={0.32} instant />
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', transform: `scale(${breathe})` }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <AnimatedText
            text={TEXTS.scene8.dateLine1}
            delay={8}
            stagger={3}
            wordDur={22}
            style={{
              fontFamily: FONTS.display,
              fontWeight: 900,
              fontSize: 138,
              color: BRAND.red,
              letterSpacing: '-0.01em',
            }}
          />
          <AnimatedText
            text={TEXTS.scene8.dateLine2}
            delay={18}
            stagger={3}
            wordDur={22}
            style={{
              fontFamily: FONTS.display,
              fontWeight: 800,
              fontSize: 84,
              textTransform: 'uppercase',
              color: BRAND.black,
              letterSpacing: '0.02em',
              marginTop: 4,
            }}
          />
          <AnimatedText
            text={TEXTS.scene8.dateLine3}
            delay={26}
            stagger={3}
            wordDur={22}
            style={{
              fontFamily: FONTS.display,
              fontWeight: 600,
              fontSize: 46,
              color: BRAND.taupe,
              letterSpacing: '0.16em',
              marginTop: 10,
            }}
          />

          <div
            style={{
              width: 64,
              height: 2,
              background: BRAND.red,
              opacity: ci(frame, [38, 50], [0, 1]),
              marginTop: 28,
              marginBottom: 22,
            }}
          />

          <AnimatedText
            text={TEXTS.scene8.place}
            delay={44}
            stagger={2}
            wordDur={18}
            style={{
              fontFamily: FONTS.body,
              fontWeight: 500,
              fontSize: 28,
              letterSpacing: '0.3em',
              color: BRAND.black,
            }}
          />
          <AnimatedText
            text={TEXTS.scene8.cta}
            delay={52}
            stagger={2}
            wordDur={18}
            style={{
              fontFamily: FONTS.body,
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: 30,
              color: BRAND.taupe,
              marginTop: 16,
            }}
          />
        </div>
      </AbsoluteFill>

      <FilmGrain frame={frame} opacity={0.03} />
    </AbsoluteFill>
  );
};
