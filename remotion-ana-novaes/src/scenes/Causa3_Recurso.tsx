import React from 'react';
import { AbsoluteFill, Easing, useCurrentFrame } from 'remotion';
import { ci } from '../lib/motion';
import { NoiseOverlay } from '../lib/Background';
import { COLOR_CAUSA } from '../lib/palette-causa';
import { FONT } from '../lib/palette';

// Cena 3 — O Recurso (Impacto Tipográfico) | frames locais 0–120 (4.0s)
// Transcrição real (forced alignment real): "defender"@12 "mais"@22 "recursos"@33
// "para"@46 "terapias"@55 "necessárias"@67 (fala termina ~88)
const AMARELO = '#F0C800';

export const Causa3_Recurso: React.FC = () => {
  const frame = useCurrentFrame();

  const bgOp = ci(frame, [0, 18], [0, 1], Easing.out(Easing.quad));
  const panY = ci(frame, [0, 120], [-40, 40], Easing.inOut(Easing.cubic));

  const graphOp = ci(frame, [0, 20], [0, 0.25], Easing.out(Easing.cubic));
  const graphY = ci(frame, [0, 20], [60, 0], Easing.out(Easing.cubic));

  // Saída — SUCÇÃO PARA O CENTRO (colapso, stagger +2f por elemento)
  const collapse = (index: number) => {
    const start = 95 + index * 2;
    const p = ci(frame, [start, start + 22], [0, 1], Easing.in(Easing.exp));
    return {
      scale: interp(p, 1, 0),
      rotate: interp(p, 0, -15),
      blur: interp(p, 0, 30),
      opacity: interp(p, 1, 0),
    };
  };

  const defenderOp = ci(frame, [12, 26], [0, 1], Easing.out(Easing.cubic));
  const defenderBlur = ci(frame, [12, 30], [15, 0]);

  const maisOp = ci(frame, [22, 30], [0, 1]);
  const maisScale = ci(frame, [22, 38], [3, 1], Easing.out(Easing.cubic));
  const maisBlur = ci(frame, [22, 42], [20, 0], Easing.out(Easing.cubic));

  const recursosOp = ci(frame, [33, 41], [0, 1]);
  const recursosScale = ci(frame, [33, 49], [3, 1], Easing.out(Easing.cubic));
  const recursosBlur = ci(frame, [33, 53], [20, 0], Easing.out(Easing.cubic));

  const subtitleOp = ci(frame, [46, 60], [0, 1], Easing.out(Easing.cubic));
  const subtitleY = ci(frame, [46, 60], [40, 0], Easing.out(Easing.cubic));

  const c0 = collapse(0);
  const c1 = collapse(1);
  const c2 = collapse(2);
  const c3 = collapse(3);

  return (
    <AbsoluteFill style={{ opacity: bgOp, backgroundColor: COLOR_CAUSA.void }}>
      <NoiseOverlay opacity={0.06} />

      {/* Gráfico vetor de ascensão */}
      <AbsoluteFill style={{ opacity: graphOp, transform: `translateY(${graphY}px)` }}>
        <svg width="100%" height="100%" viewBox="0 0 1080 1920" style={{ position: 'absolute', inset: 0 }}>
          {/* strokeWidth alto de propósito: traços finos somem no still/render
              deste projeto (Config.setVideoImageFormat('jpeg') comprime até
              desaparecer) — verificado empiricamente na Cena 1. */}
          <g stroke={COLOR_CAUSA.tea} strokeWidth={3} opacity={0.6}>
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={`h${i}`} x1={0} y1={200 + i * 160} x2={1080} y2={200 + i * 160} />
            ))}
            {Array.from({ length: 6 }).map((_, i) => (
              <line key={`v${i}`} x1={i * 216} y1={0} x2={i * 216} y2={1920} />
            ))}
          </g>
          <path d="M140,1500 L400,1100 L620,1250 L900,600" stroke={COLOR_CAUSA.tea} strokeWidth={10} fill="none" strokeLinecap="round" />
          <path d="M820,560 L900,600 L860,690" stroke={COLOR_CAUSA.tea} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </AbsoluteFill>

      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', transform: `translateY(${panY * 0.2}px)` }}>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontFamily: FONT.sans,
              fontWeight: 400,
              fontSize: 44,
              letterSpacing: 4,
              color: COLOR_CAUSA.textLight,
              opacity: defenderOp * c0.opacity,
              filter: `blur(${defenderBlur + c0.blur}px)`,
              transform: `scale(${c0.scale}) rotate(${c0.rotate}deg)`,
              marginBottom: 6,
            }}
          >
            DEFENDER
          </div>

          <div
            style={{
              fontFamily: FONT.sans,
              fontWeight: 900,
              fontSize: 168,
              letterSpacing: -6,
              lineHeight: 0.98,
              color: AMARELO,
              opacity: maisOp * c1.opacity,
              filter: `blur(${maisBlur + c1.blur}px)`,
              transform: `scale(${maisScale * c1.scale}) rotate(${c1.rotate}deg)`,
            }}
          >
            MAIS
          </div>

          <div
            style={{
              fontFamily: FONT.sans,
              fontWeight: 900,
              fontSize: 168,
              letterSpacing: -6,
              lineHeight: 1.02,
              color: AMARELO,
              opacity: recursosOp * c2.opacity,
              filter: `blur(${recursosBlur + c2.blur}px)`,
              transform: `scale(${recursosScale * c2.scale}) rotate(${c2.rotate}deg)`,
            }}
          >
            RECURSOS
          </div>

          <div
            style={{
              fontFamily: FONT.sans,
              fontWeight: 700,
              fontSize: 40,
              letterSpacing: 0.5,
              color: COLOR_CAUSA.tea,
              marginTop: 22,
              opacity: subtitleOp * c3.opacity,
              transform: `translateY(${subtitleY}px) scale(${c3.scale}) rotate(${c3.rotate}deg)`,
              filter: `blur(${c3.blur}px)`,
            }}
          >
            PARA TERAPIAS
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const interp = (v: number, from: number, to: number) => from + (to - from) * v;
