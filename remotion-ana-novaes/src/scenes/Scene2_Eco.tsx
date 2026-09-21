import React from 'react';
import { AbsoluteFill, Easing, useCurrentFrame } from 'remotion';
import { ci, countUp, formatPtBrInt } from '../lib/motion';
import { PaperBackground, RadarPulse, HalftoneOverlay } from '../lib/Background';
import { COLOR, FONT } from '../lib/palette';

// Cena 2 — O Eco (Mapa e Número) | frames locais 0–200 (6.7s)
// Transcrição real (forced alignment real sobre o áudio — "2.373" é falado
// entre os frames 19 e 77, 58 frames / 1.93s, bem mais devagar que o
// estimado antes):
// "2.373"@19–77 "votos,"@77 | "ecoou"@114 "em"@126 "cada"@126 "bairro"@136 "e"@144 "cada"@148 "lar."@154–167
// Câmera: Pan Horizontal sutil
export const Scene2_Eco: React.FC = () => {
  const frame = useCurrentFrame();

  const panX = ci(frame, [0, 200], [-40, 22], Easing.inOut(Easing.quad));
  const bgFadeIn = ci(frame, [0, 20], [0, 1], Easing.out(Easing.quad));
  const mapOp = ci(frame, [0, 25], [0, 0.15], Easing.out(Easing.quad));

  // Número — contagem real, sem tremor. Duração da contagem casada com o
  // tempo real que leva pra falar "dois mil, trezentos e setenta e três" (58 frames).
  const numberValue = countUp(frame, 19, 58, 2373);
  const numberOp = ci(frame, [19, 33], [0, 1], Easing.out(Easing.cubic));
  const numberBlur = ci(frame, [19, 37], [12, 0], Easing.out(Easing.cubic));

  const votosOp = ci(frame, [77, 92], [0, 1], Easing.out(Easing.cubic));
  const votosY = ci(frame, [77, 92], [24, 0], Easing.out(Easing.cubic));

  const splatterP = ci(frame, [19, 45], [0, 1], Easing.out(Easing.exp));
  const splatterScale = splatterP < 0.5 ? interp(splatterP, 0, 0.5, 0, 1.1) : interp(splatterP, 0.5, 1, 1.1, 1);
  const splatterOp = splatterP < 0.6 ? interp(splatterP, 0, 0.6, 0, 1) : interp(splatterP, 0.6, 1, 1, 0);

  const exitLower = ci(frame, [182, 200], [0, 1], Easing.in(Easing.exp));
  const exitNum = ci(frame, [186, 200], [0, 1], Easing.in(Easing.exp));
  const exitMap = ci(frame, [190, 200], [0, 1], Easing.in(Easing.exp));

  const rowA = [
    { text: 'ECOOU', delay: 114 },
    { text: 'EM', delay: 126 },
    { text: 'CADA', delay: 126 },
    { text: 'BAIRRO', delay: 136 },
  ];
  const rowB = [
    { text: 'E', delay: 144 },
    { text: 'CADA', delay: 148 },
    { text: 'LAR', delay: 154 },
  ];

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: bgFadeIn }}>
        <PaperBackground />
        <HalftoneOverlay opacity={0.035} />
      </AbsoluteFill>

      <AbsoluteFill style={{ transform: `translateX(${panX}px)`, opacity: bgFadeIn }}>
        <AbsoluteFill
          style={{
            opacity: mapOp * (1 - exitMap),
            transform: `rotateZ(${exitMap * -35}deg) scale(${1 - exitMap * 0.5})`,
          }}
        >
          <AbstractMap />
          <RadarPulse frame={frame} />
        </AbsoluteFill>

        <div
          style={{
            position: 'absolute',
            top: '36%',
            left: '50%',
            width: 620,
            height: 620,
            marginLeft: -310,
            marginTop: -310,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${COLOR.purple}2E 0%, transparent 70%)`,
            transform: `scale(${splatterScale})`,
            opacity: splatterOp,
          }}
        />

        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', paddingBottom: 90 }}>
          <div
            style={{
              fontFamily: FONT.sans,
              fontWeight: 900,
              fontSize: 208,
              letterSpacing: -3,
              color: COLOR.textDark,
              textShadow: '0 6px 18px rgba(27,19,48,0.22)',
              transform: `scale(${1 - exitNum * 0.85})`,
              filter: `blur(${numberBlur + exitNum * 30}px)`,
              opacity: numberOp * (1 - exitNum),
            }}
          >
            {formatPtBrInt(numberValue)}
          </div>
          <div
            style={{
              fontFamily: FONT.sans,
              fontWeight: 700,
              fontSize: 54,
              letterSpacing: -1,
              color: COLOR.accent,
              marginTop: -6,
              opacity: votosOp * (1 - exitLower),
              transform: `translateY(${votosY - exitLower * 30}px) scale(${1 - exitLower * 0.9})`,
              filter: `blur(${exitLower * 16}px)`,
            }}
          >
            votos
          </div>

          <div
            style={{
              marginTop: 28,
              opacity: 1 - exitLower,
              transform: `scale(${1 - exitLower * 0.9})`,
              filter: `blur(${exitLower * 16}px)`,
            }}
          >
            <Row words={rowA} size={28} color={COLOR.textDark} />
            <Row words={rowB} size={28} color={COLOR.textDark} />
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Row: React.FC<{ words: { text: string; delay: number }[]; size: number; color: string }> = ({
  words,
  size,
  color,
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
      {words.map((w, i) => {
        const op = ci(frame, [w.delay, w.delay + 16], [0, 1], Easing.out(Easing.cubic));
        const y = ci(frame, [w.delay, w.delay + 16], [16, 0], Easing.out(Easing.cubic));
        const bl = ci(frame, [w.delay, w.delay + 10], [8, 0]);
        return (
          <span
            key={i}
            style={{
              fontFamily: FONT.sans,
              fontWeight: 600,
              fontSize: size,
              letterSpacing: 1,
              color,
              opacity: op,
              transform: `translateY(${y}px)`,
              filter: `blur(${bl}px)`,
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};

const interp = (v: number, a: number, b: number, c: number, d: number) => {
  const t = Math.max(0, Math.min(1, (v - a) / (b - a)));
  return c + (d - c) * t;
};

/** Placeholder de mapa vetorizado de Umuarama — malha de ruas estilizada e determinística. */
const AbstractMap: React.FC = () => (
  <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
    <g stroke={COLOR.textDark} strokeWidth={2} fill="none" opacity={1}>
      {Array.from({ length: 9 }).map((_, i) => (
        <line key={`h${i}`} x1={0} y1={140 + i * 210} x2={1080} y2={80 + i * 210} />
      ))}
      {Array.from({ length: 7 }).map((_, i) => (
        <line key={`v${i}`} x1={90 + i * 160} y1={0} x2={160 + i * 160} y2={1920} />
      ))}
      <path d="M0,960 C300,860 700,1100 1080,960" strokeWidth={4} />
    </g>
  </svg>
);
