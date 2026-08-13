import React from 'react';
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import { BackgroundBase } from '../components/BackgroundBase';
import { SeigaihaPattern } from '../components/SeigaihaPattern';
import { SakuraPetals } from '../components/SakuraPetals';
import { AnimatedText } from '../components/AnimatedText';
import { FilmGrain } from '../components/FilmGrain';
import { BRAND, FONTS, SAFE_AREA } from '../config/brand';
import { TEXTS } from '../config/texts';
import { ci } from '../lib/animation';

/** Cena 4 — Cultura (0:08–0:11). Padrão Seigaiha surge; encadeamento das 3 palavras-chave. */
export const Scene04Cultura: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const patternOpacity = ci(frame, [0, 40], [0, 0.07], Easing.out(Easing.cubic));
  const headlineExit = 44;

  const chainStart = 48;
  const lineProgress = ci(frame, [chainStart, chainStart + 20], [0, 1], Easing.out(Easing.cubic));
  const chainExit = ci(frame, [80, 84], [0, 1], Easing.in(Easing.cubic));

  return (
    <AbsoluteFill>
      <BackgroundBase color={BRAND.red} glow="rgba(255,255,255,0.07)" />
      <SeigaihaPattern color={BRAND.offWhite} opacity={patternOpacity} scale={1.3} />
      <SakuraPetals frame={frame} fps={30} width={width} height={height} count={12} seed={15} intensity={0.9} fadeInEnd={16} />

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
            text={TEXTS.scene4.headline}
            delay={12}
            exitStart={headlineExit}
            exitDirection="left"
            stagger={2}
            wordDur={28}
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
            text={TEXTS.scene4.sub}
            delay={30}
            exitStart={headlineExit + 4}
            exitDirection="left"
            stagger={3}
            wordDur={24}
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

      {/* Encadeamento PROPÓSITO / TRADIÇÃO / CULTURA */}
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 1 - chainExit,
          transform: `translateY(${chainExit * -40}px) scale(${1 - chainExit * 0.04})`,
          filter: `blur(${chainExit * 14}px)`,
        }}
      >
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26 }}>
          <svg
            width={6}
            height={140}
            style={{ position: 'absolute', left: '50%', top: 6, transform: 'translateX(-50%)' }}
          >
            <line
              x1={3}
              y1={0}
              x2={3}
              y2={140}
              stroke={BRAND.offWhite}
              strokeWidth={2}
              strokeOpacity={0.6}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - lineProgress}
            />
          </svg>
          {TEXTS.scene4.chain.map((word, i) => {
            const wStart = chainStart + i * 8;
            const p = ci(frame, [wStart, wStart + 12], [0, 1], Easing.out(Easing.cubic));
            const isLast = i === TEXTS.scene4.chain.length - 1;
            return (
              <div
                key={word}
                style={{
                  opacity: p,
                  transform: `translateY(${(1 - p) * 16}px) scale(${isLast ? 1.15 : 1})`,
                  fontFamily: FONTS.display,
                  fontWeight: isLast ? 800 : 600,
                  fontSize: isLast ? 46 : 34,
                  letterSpacing: '0.06em',
                  color: isLast ? BRAND.offWhite : 'rgba(248,242,241,0.55)',
                }}
              >
                {word}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      <FilmGrain frame={frame} opacity={0.035} />
    </AbsoluteFill>
  );
};
