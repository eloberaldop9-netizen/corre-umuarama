import React from 'react';
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import { BackgroundBase } from '../components/BackgroundBase';
import { CrossCameraPetal, SakuraPetals } from '../components/SakuraPetals';
import { AnimatedText } from '../components/AnimatedText';
import { SakuraBranch } from '../components/SakuraBranch';
import { FilmGrain } from '../components/FilmGrain';
import { BRAND, FONTS, SAFE_AREA } from '../config/brand';
import { TEXTS } from '../config/texts';
import { ci } from '../lib/animation';

/** Cena 3 — Tradição (0:05–0:08). Match cut para vermelho, galho cresce por máscara. */
export const Scene03Tradicao: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const exitStart = 72;
  const flash = ci(frame, [0, 6], [0.9, 0]);

  return (
    <AbsoluteFill>
      <BackgroundBase color={BRAND.red} glow="rgba(255,255,255,0.08)" />

      <SakuraBranch frame={frame} start={6} corner="top-right" width={380} />
      <SakuraPetals frame={frame} fps={30} width={width} height={height} count={10} seed={9} intensity={0.7} fadeInEnd={20} />

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
            text={TEXTS.scene3.headline}
            delay={18}
            exitStart={exitStart}
            exitDirection="right"
            stagger={2}
            wordDur={32}
            style={{
              fontFamily: FONTS.display,
              fontWeight: 900,
              fontSize: 122,
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              color: BRAND.offWhite,
              textAlign: 'center',
            }}
          />
          <AnimatedText
            text={TEXTS.scene3.sub}
            delay={38}
            exitStart={exitStart + 4}
            exitDirection="right"
            stagger={3}
            wordDur={26}
            style={{
              fontFamily: FONTS.body,
              fontWeight: 400,
              fontSize: 34,
              color: 'rgba(248,242,241,0.85)',
              textAlign: 'center',
              marginTop: 14,
            }}
          />
        </div>
      </AbsoluteFill>

      <CrossCameraPetal frame={frame} start={0} dur={14} width={width} height={height} fromLeft={false} />

      {/* Flash sutil de contraste no match-cut de entrada */}
      <AbsoluteFill style={{ backgroundColor: BRAND.offWhite, opacity: flash, pointerEvents: 'none' }} />

      <FilmGrain frame={frame} opacity={0.035} />
    </AbsoluteFill>
  );
};
