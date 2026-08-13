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
import { ci, ciMulti } from '../lib/animation';

/** Cena 6 — Revelação do conceito (0:14–0:17). O traço fecha; silêncio; IKIGAI. */
export const Scene06Ikigai: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const circleProgress = ci(frame, [0, 14], [0.9, 1], Easing.out(Easing.cubic));
  const impactFlash = ciMulti(frame, [12, 15, 22], [0, 0.85, 0]);
  const petalsFade = 1 - ci(frame, [0, 14], [0, 1]);

  const revealStart = 16;
  const circleFade = 1 - ci(frame, [revealStart, revealStart + 18], [0, 1]);
  const textExit = 82;

  return (
    <AbsoluteFill>
      <BackgroundBase color={BRAND.offWhite} glow="rgba(215,25,32,0.07)" />
      <SeigaihaPattern color={BRAND.black} opacity={0.045} />

      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: petalsFade }}>
        <SakuraPetals frame={frame} fps={30} width={width} height={height} count={16} seed={30} intensity={0.4} fadeInEnd={1} fadeOutStart={0} fadeOutEnd={14} />
      </AbsoluteFill>

      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: circleFade }}>
        <BrushCircle progress={circleProgress} size={860} color={BRAND.red} strokeWidth={26} seed={35} rotate={-70 + frame * 0.35} />
      </AbsoluteFill>

      <AbsoluteFill style={{ backgroundColor: BRAND.offWhite, opacity: impactFlash, pointerEvents: 'none' }} />

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
            text={TEXTS.scene6.headline}
            delay={revealStart}
            exitStart={textExit}
            exitDirection="top"
            stagger={2}
            wordDur={28}
            style={{
              fontFamily: FONTS.display,
              fontWeight: 900,
              fontSize: 148,
              textTransform: 'uppercase',
              letterSpacing: '0.01em',
              color: BRAND.red,
              textAlign: 'center',
            }}
          />
          {TEXTS.scene6.sub.split('\n').map((line, i) => (
            <AnimatedText
              key={line}
              text={line}
              delay={revealStart + 18 + i * 7}
              exitStart={textExit + 2}
              exitDirection="top"
              stagger={2}
              wordDur={18}
              style={{
                fontFamily: FONTS.body,
                fontWeight: 500,
                fontSize: 34,
                color: BRAND.black,
                textAlign: 'center',
                marginTop: i === 0 ? 20 : 2,
              }}
            />
          ))}
          <AnimatedText
            text={TEXTS.scene6.japanese}
            delay={revealStart + 34}
            exitStart={textExit + 4}
            exitDirection="top"
            stagger={1}
            wordDur={16}
            style={{
              fontFamily: FONTS.japanese,
              fontWeight: 400,
              fontSize: 28,
              color: BRAND.taupe,
              textAlign: 'center',
              marginTop: 22,
            }}
          />
        </div>
      </AbsoluteFill>

      <FilmGrain frame={frame} opacity={0.03} />
    </AbsoluteFill>
  );
};
