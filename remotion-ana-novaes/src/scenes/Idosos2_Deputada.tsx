import React from 'react';
import { AbsoluteFill, Easing, Img, staticFile, useCurrentFrame } from 'remotion';
import { ci } from '../lib/motion';
import { PaperPurple } from '../lib/PaperPurple';
import { ED, edIn, outP } from '../lib/editorial';
import { IDOSOS_SCENES, WORD } from '../idosos-timing';
import type { IdososAssets } from '../idosos-timing';

// Cena 2 — A Deputada | frames locais 0–70
// "Como deputada federal, pretende trabalhar pelo"
// O amarelo se abre sobre o papel roxo e a foto real da Ana abraçando uma
// idosa assenta como polaroid inteira; pill DEPUTADA FEDERAL em "deputada".
// Terço inferior livre para a legenda. Saída: desliza pra esquerda.
const S = IDOSOS_SCENES.c2;
const L = (f: number) => f - S.from;
const EXIT = 54;

export const Idosos2_Deputada: React.FC<{ assets: IdososAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();
  const flash = ci(frame, [0, 12], [1, 0], Easing.out(Easing.cubic));
  const inP = ci(frame, [2, 28], [0, 1], Easing.out(Easing.cubic));
  const xo = outP(frame, EXIT, 16);

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <PaperPurple shift={ci(frame, [0, S.duration], [-20, 20])} />
      <div
        style={{
          position: 'absolute', top: 230, left: 140, width: 800,
          opacity: inP * (1 - ci(xo, [0.4, 1], [0, 1])), filter: `blur(${10 * (1 - inP) + 20 * xo}px)`,
          transform: `translateY(${60 * (1 - inP) + ci(frame, [0, S.duration], [0, -20])}px) translateX(${-1400 * xo}px) rotate(2deg) scale(${1 - 0.05 * xo})`,
        }}
      >
        <div style={{ background: '#FFFFFF', padding: '18px 18px 70px', boxShadow: '0 40px 80px rgba(0,0,0,0.55)' }}>
          <Img src={staticFile(`assets/${assets.anaAbraco}`)} style={{ display: 'block', width: 764, height: 764, objectFit: 'cover' }} />
        </div>
        <div style={{ position: 'absolute', bottom: -28, left: 60, background: ED.yellow, borderRadius: 999, padding: '16px 40px', boxShadow: '0 16px 40px rgba(0,0,0,0.4)', transform: 'rotate(-2deg)', opacity: ci(frame, [L(WORD.deputada), L(WORD.deputada) + 10], [0, 1]) }}>
          <span style={{ display: 'inline-block', fontFamily: ED.sans, fontWeight: 800, fontSize: 44, color: ED.void, ...edIn(frame, L(WORD.deputada), { y: 8, blur: 10, trackFrom: -4, trackTo: -1 }) }}>
            DEPUTADA FEDERAL
          </span>
        </div>
      </div>
      <AbsoluteFill style={{ backgroundColor: ED.yellow, opacity: flash }} />
    </AbsoluteFill>
  );
};
