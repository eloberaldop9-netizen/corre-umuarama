import React from 'react';
import { AbsoluteFill, Easing, Img, staticFile, useCurrentFrame } from 'remotion';
import { ci } from '../lib/motion';
import { PaperPurple } from '../lib/PaperPurple';
import { ED, edIn, outP } from '../lib/editorial';
import { COMBATE_SCENES, WORD } from '../combate-timing';
import type { CombateAssets } from '../combate-timing';

// Cena 2a — A Deputada | frames locais 0–78
// "Como deputada federal, pretende defender"
// O amarelo do Z-dive se abre sobre o papel roxo e o retrato institucional
// da Ana assenta como foto de capa (inteira, moldura branca), com a pill
// DEPUTADA FEDERAL em "deputada". O terço inferior fica LIVRE para a
// legenda da edição final. Saída: desliza pra esquerda com blur.
const S = COMBATE_SCENES.c2a;
const L = (f: number) => f - S.from;
const EXIT = 62;

export const Combate2a_Deputada: React.FC<{ assets: CombateAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();
  const flash = ci(frame, [0, 12], [1, 0], Easing.out(Easing.cubic));
  const inP = ci(frame, [2, 30], [0, 1], Easing.out(Easing.cubic));
  const drift = ci(frame, [0, S.duration], [0, -24]);
  const xo = outP(frame, EXIT, 16);

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <PaperPurple shift={ci(frame, [0, S.duration], [-20, 20])} />

      <div
        style={{
          position: 'absolute', top: 170, left: 150, width: 780,
          opacity: inP * (1 - ci(xo, [0.4, 1], [0, 1])), filter: `blur(${10 * (1 - inP) + 20 * xo}px)`,
          transform: `translateY(${60 * (1 - inP) + drift}px) translateX(${-1400 * xo}px) rotate(-2deg) scale(${1 - 0.05 * xo})`,
        }}
      >
        <div style={{ background: '#FFFFFF', padding: 18, boxShadow: '0 40px 80px rgba(0,0,0,0.55)' }}>
          <Img src={staticFile(`assets/${assets.retratoOficial}`)} style={{ display: 'block', width: 744, height: 1116, objectFit: 'cover', objectPosition: '50% 20%' }} />
        </div>
        <div style={{ position: 'absolute', bottom: -30, left: 40, background: ED.yellow, borderRadius: 999, padding: '16px 40px', boxShadow: '0 16px 40px rgba(0,0,0,0.4)', transform: 'rotate(2deg)', opacity: ci(frame, [L(WORD.deputada), L(WORD.deputada) + 10], [0, 1]) }}>
          <span style={{ display: 'inline-block', fontFamily: ED.sans, fontWeight: 800, fontSize: 44, color: ED.void, ...edIn(frame, L(WORD.deputada), { y: 8, blur: 10, trackFrom: -4, trackTo: -1 }) }}>
            DEPUTADA FEDERAL
          </span>
        </div>
      </div>

      <AbsoluteFill style={{ backgroundColor: ED.yellow, opacity: flash }} />
    </AbsoluteFill>
  );
};
