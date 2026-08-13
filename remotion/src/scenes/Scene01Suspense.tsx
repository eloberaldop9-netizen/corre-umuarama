import React from 'react';
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import { BackgroundBase } from '../components/BackgroundBase';
import { SeigaihaPattern } from '../components/SeigaihaPattern';
import { CrossCameraPetal } from '../components/SakuraPetals';
import { AnimatedText } from '../components/AnimatedText';
import { BrushCircle } from '../components/BrushCircle';
import { FilmGrain } from '../components/FilmGrain';
import { BRAND, FONTS, SAFE_AREA } from '../config/brand';
import { TEXTS } from '../config/texts';
import { ci } from '../lib/animation';

/** Cena 1 — Suspense (0:00–0:02). Tela quase limpa, pétala atravessa o quadro. */
export const Scene01Suspense: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const circleProgress = ci(frame, [4, 66], [0, 0.22], Easing.out(Easing.cubic));

  return (
    <AbsoluteFill>
      <BackgroundBase color={BRAND.offWhite} glow="rgba(215,25,32,0.05)" />
      <SeigaihaPattern color={BRAND.black} opacity={0.04} />

      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <BrushCircle progress={circleProgress} size={760} color={BRAND.red} strokeWidth={22} seed={3} />
      </AbsoluteFill>

      <CrossCameraPetal frame={frame} start={2} dur={18} width={width} height={height} fromLeft />

      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingLeft: SAFE_AREA.left,
          paddingRight: SAFE_AREA.right,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <AnimatedText
            text={TEXTS.scene1.line1}
            delay={8}
            exitStart={54}
            exitDirection="top"
            mode="mask"
            stagger={4}
            wordDur={20}
            style={{
              fontFamily: FONTS.display,
              fontWeight: 700,
              fontSize: 58,
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              color: BRAND.black,
              textAlign: 'center',
            }}
          />
          <AnimatedText
            text={TEXTS.scene1.line2}
            delay={30}
            exitStart={64}
            exitDirection="top"
            mode="mask"
            stagger={3}
            wordDur={16}
            style={{
              fontFamily: FONTS.display,
              fontWeight: 700,
              fontSize: 58,
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              color: BRAND.red,
              textAlign: 'center',
            }}
          />
        </div>
      </AbsoluteFill>

      <FilmGrain frame={frame} opacity={0.03} />
    </AbsoluteFill>
  );
};
