import React from 'react';
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import { BackgroundBase } from '../components/BackgroundBase';
import { SeigaihaPattern } from '../components/SeigaihaPattern';
import { SakuraPetals } from '../components/SakuraPetals';
import { AnimatedText } from '../components/AnimatedText';
import { BrushCircle } from '../components/BrushCircle';
import { FilmGrain } from '../components/FilmGrain';
import { BRAND, FONTS, SAFE_AREA } from '../config/brand';
import { TEXTS } from '../config/texts';
import { ci } from '../lib/animation';

/** Cena 2 — Propósito (0:02–0:05). Câmera se aproxima, o círculo é desenhado. */
export const Scene02Proposito: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const camScale = ci(frame, [0, 90], [1, 1.07], Easing.inOut(Easing.cubic));
  const circleProgress = ci(frame, [0, 68], [0.12, 1], Easing.out(Easing.cubic));
  const exitStart = 72;

  return (
    <AbsoluteFill>
      <BackgroundBase color={BRAND.offWhite} glow="rgba(215,25,32,0.06)" />
      <SeigaihaPattern color={BRAND.black} opacity={0.045} />

      <AbsoluteFill style={{ transform: `scale(${camScale})` }}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <BrushCircle progress={circleProgress} size={860} color={BRAND.red} strokeWidth={24} seed={11} rotate={-70} />
        </AbsoluteFill>

        <SakuraPetals frame={frame} fps={30} width={width} height={height} count={9} seed={4} intensity={0.6} fadeInEnd={30} />

        <AbsoluteFill
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingLeft: SAFE_AREA.left,
            paddingRight: SAFE_AREA.right,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <AnimatedText
              text={TEXTS.scene2.headline}
              delay={10}
              exitStart={exitStart}
              exitDirection="top"
              stagger={2}
              wordDur={30}
              style={{
                fontFamily: FONTS.display,
                fontWeight: 900,
                fontSize: 128,
                textTransform: 'uppercase',
                letterSpacing: '-0.01em',
                color: BRAND.red,
                textAlign: 'center',
              }}
            />
            <AnimatedText
              text={TEXTS.scene2.sub}
              delay={30}
              exitStart={exitStart + 4}
              exitDirection="top"
              stagger={3}
              wordDur={24}
              style={{
                fontFamily: FONTS.body,
                fontWeight: 400,
                fontSize: 34,
                color: BRAND.black,
                textAlign: 'center',
                marginTop: 14,
              }}
            />
          </div>
        </AbsoluteFill>
      </AbsoluteFill>

      <FilmGrain frame={frame} opacity={0.03} />
    </AbsoluteFill>
  );
};
