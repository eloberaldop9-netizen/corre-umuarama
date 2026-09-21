import React from 'react';
import { AbsoluteFill, Easing, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ci, SPRING } from '../lib/motion';
import { PaperBackground, RadarPulse } from '../lib/Background';
import { COLOR, FONT } from '../lib/palette';

// Cena 2 — O Eco (Mapa e Número) | frames locais 0–172 (5.7s, ajustado à narração)
// Câmera: Pan Horizontal — x: -300 → +150 em [0,172], Easing.inOut(quad)
export const Scene2_Eco: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const panX = ci(frame, [0, 172], [-75, 37.5], Easing.inOut(Easing.quad));

  // Entradas (0–45)
  const mapOp = ci(frame, [0, 25], [0, 0.15], Easing.out(Easing.quad));

  const numSp = spring({ frame, fps, config: SPRING.overshootViolent, delay: 10 });
  const numScale = ci(numSp, [0, 1], [4, 1]);
  const numBlur = ci(frame - 10, [0, 20], [30, 0]);

  const votosOp = ci(frame, [22, 40], [0, 1], Easing.out(Easing.cubic));
  const votosY = ci(frame, [22, 40], [60, 0], Easing.out(Easing.cubic));

  const ecoouSp = spring({ frame, fps, config: SPRING.text, delay: 30 });
  const ecoouY = ci(ecoouSp, [0, 1], [20, 0]);
  const bairroSp = spring({ frame, fps, config: SPRING.text, delay: 34 });
  const bairroY = ci(bairroSp, [0, 1], [20, 0]);

  // Splatter de tinta (frame 12, dura 15f)
  const splatterP = ci(frame, [12, 27], [0, 1], Easing.out(Easing.exp));
  const splatterScale = splatterP < 0.5 ? interpolate2(splatterP, 0, 0.5, 0, 1.2) : interpolate2(splatterP, 0.5, 1, 1.2, 1);
  const splatterOp = splatterP < 0.6 ? interpolate2(splatterP, 0, 0.6, 0, 1) : interpolate2(splatterP, 0.6, 1, 1, 0);

  // Hold — jitter (handheld na mesa)
  const jitterX = Math.sin(frame * 0.6) * 1.5;
  const jitterY = Math.cos(frame * 0.5) * 1.5;

  // Saída — Colapso gravitacional (140–172)
  const exitEcoou = ci(frame, [140, 170], [0, 1], Easing.in(Easing.exp));
  const exitVotos = ci(frame, [143, 173], [0, 1], Easing.in(Easing.exp));
  const exitNum = ci(frame, [149, 172], [0, 1], Easing.in(Easing.exp));
  const exitMap = ci(frame, [153, 172], [0, 1], Easing.in(Easing.exp));

  return (
    <AbsoluteFill>
      <PaperBackground />

      <AbsoluteFill style={{ transform: `translateX(${panX}px)` }}>
        {/* Mapa vetorizado (placeholder abstrato) + radar */}
        <AbsoluteFill
          style={{
            opacity: mapOp * (1 - exitMap),
            transform: `rotateZ(${exitMap * -60}deg) scale(${1 - exitMap * 0.7})`,
          }}
        >
          <AbstractMap />
          <RadarPulse frame={frame} />
        </AbsoluteFill>

        {/* Splatter de tinta ao redor do número */}
        <div
          style={{
            position: 'absolute',
            top: '38%',
            left: '50%',
            width: 700,
            height: 700,
            marginLeft: -350,
            marginTop: -350,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${COLOR.purple}33 0%, transparent 70%)`,
            transform: `scale(${splatterScale})`,
            opacity: splatterOp,
          }}
        />

        {/* Número hero */}
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: 120,
          }}
        >
          <div
            style={{
              fontFamily: FONT.sans,
              fontWeight: 900,
              fontSize: 240,
              letterSpacing: -8,
              color: COLOR.textDark,
              textShadow: `8px 8px 0 ${COLOR.purple}`,
              transform: `scale(${numScale * (1 - exitNum * 0.9)}) rotateZ(${exitNum * -15}deg) translate(${jitterX}px, ${jitterY}px)`,
              filter: `blur(${numBlur + exitNum * 40}px)`,
              opacity: 1 - exitNum,
            }}
          >
            2.373
          </div>
          <div
            style={{
              fontFamily: FONT.sans,
              fontWeight: 700,
              fontSize: 70,
              letterSpacing: -2,
              color: COLOR.accent,
              marginTop: -10,
              opacity: votosOp * (1 - exitVotos),
              transform: `translateY(${votosY - exitVotos * 40}px) scale(${1 - exitVotos * 0.9})`,
              filter: `blur(${exitVotos * 20}px)`,
            }}
          >
            votos
          </div>
          <div
            style={{
              marginTop: 34,
              textAlign: 'center',
              opacity: (1 - exitEcoou),
              transform: `scale(${1 - exitEcoou * 0.9})`,
              filter: `blur(${exitEcoou * 20}px)`,
            }}
          >
            <div
              style={{
                fontFamily: FONT.serif,
                fontWeight: 400,
                fontSize: 40,
                letterSpacing: 4,
                color: COLOR.textDark,
                transform: `translateY(${ecoouY}px)`,
              }}
            >
              ECOOU EM
            </div>
            <div
              style={{
                fontFamily: FONT.serif,
                fontWeight: 400,
                fontSize: 40,
                letterSpacing: 4,
                color: COLOR.textDark,
                transform: `translateY(${bairroY}px)`,
              }}
            >
              CADA BAIRRO
            </div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const interpolate2 = (v: number, a: number, b: number, c: number, d: number) => {
  const t = Math.max(0, Math.min(1, (v - a) / (b - a)));
  return c + (d - c) * t;
};

/** Placeholder de mapa vetorizado de Umuarama — malha de ruas estilizada e determinística. */
const AbstractMap: React.FC = () => (
  <svg
    viewBox="0 0 1080 1920"
    width="100%"
    height="100%"
    style={{ position: 'absolute', inset: 0 }}
  >
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
