import React from 'react';
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import { BackgroundBase } from '../components/BackgroundBase';
import { SakuraPetals } from '../components/SakuraPetals';
import { AnimatedText } from '../components/AnimatedText';
import { BrushCircle } from '../components/BrushCircle';
import { FilmGrain } from '../components/FilmGrain';
import { BRAND, FONTS, SAFE_AREA } from '../config/brand';
import { TEXTS } from '../config/texts';
import { ci } from '../lib/animation';

// Cada palavra só começa a entrar depois que a anterior terminou de sair
// por completo — nunca simultâneas, para não haver sobreposição/fantasma.
// Hold mais longo (10f) entre entrada e saída para dar tempo de leitura.
const BEAT_WORDS = [
  { start: 48, outStart: 68, outEnd: 76 },
  { start: 80, outStart: 100, outEnd: 108 },
  { start: 112, outStart: 132, outEnd: 138 },
];

/** Cena 5 — Build-up (0:11–0:14). Palavras entram no ritmo, círculo domina o centro. */
export const Scene05Geracoes: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const circleProgress = ci(frame, [0, 130], [0.65, 0.98], Easing.out(Easing.cubic));
  const circleRotate = -70 + frame * 0.35;
  const leadExitStart = 28;

  return (
    <AbsoluteFill>
      <BackgroundBase color={BRAND.black} glow="rgba(215,25,32,0.16)" />

      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <BrushCircle progress={circleProgress} size={900} color={BRAND.red} strokeWidth={26} seed={21} rotate={circleRotate} />
      </AbsoluteFill>

      <SakuraPetals frame={frame} fps={30} width={width} height={height} count={20} seed={22} intensity={1.6} fadeInEnd={10} />

      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingLeft: SAFE_AREA.left,
          paddingRight: SAFE_AREA.right,
        }}
      >
        <AnimatedText
          text={TEXTS.scene5.lead}
          delay={2}
          exitStart={leadExitStart}
          exitDirection="top"
          stagger={2}
          wordDur={14}
          style={{
            fontFamily: FONTS.display,
            fontWeight: 600,
            fontSize: 46,
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: BRAND.offWhite,
            textAlign: 'center',
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        {TEXTS.scene5.words.map((word, i) => {
          const { start, outStart, outEnd } = BEAT_WORDS[i];
          const inDur = 10;
          const p = ci(frame, [start, start + inDur], [0, 1], Easing.out(Easing.back(1.9)));
          const outP = ci(frame, [outStart, outEnd], [0, 1], Easing.in(Easing.exp));
          const scale = p * (1 - outP * 0.1);
          const blur = ci(frame, [start, start + inDur * 0.6], [10, 0]) + outP * 16;
          const opacity = p * (1 - outP);
          if (opacity <= 0.001) return null;
          return (
            <div
              key={word}
              style={{
                position: 'absolute',
                opacity,
                transform: `scale(${scale})`,
                filter: `blur(${blur}px)`,
                fontFamily: FONTS.display,
                fontWeight: 900,
                fontSize: 104,
                textTransform: 'uppercase',
                letterSpacing: '-0.01em',
                color: BRAND.offWhite,
                textAlign: 'center',
                paddingLeft: SAFE_AREA.left,
                paddingRight: SAFE_AREA.right,
              }}
            >
              {word}
            </div>
          );
        })}
      </AbsoluteFill>

      <FilmGrain frame={frame} opacity={0.04} />
    </AbsoluteFill>
  );
};
