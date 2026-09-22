import React from 'react';
import { AbsoluteFill, Easing, useCurrentFrame } from 'remotion';
import { ci } from '../lib/motion';
import { NoiseOverlay } from '../lib/Background';
import { ED, edIn, outP } from '../lib/editorial';
import { COMBATE_SCENES, WORD } from '../combate-timing';

// Cena 2 — A Trincheira de Recursos | frames locais 0–115
// "Como deputada federal, pretende defender mais recursos"
// Só tipografia sobre papel amassado roxo, pan horizontal suave: kicker
// COMO DEPUTADA FEDERAL, "MAIS" gigante e a fita amarela RECURSOS abrindo
// em wipe. Saída: WIPE EDITORIAL — bloco off-white varre da direita e vira
// o papel da Cena 3.
const S = COMBATE_SCENES.c2;
const L = (f: number) => f - S.from;
const EXIT = 95;

export const Combate2_Rede: React.FC = () => {
  const frame = useCurrentFrame();
  const flash = ci(frame, [0, 12], [1, 0], Easing.out(Easing.cubic));
  const pan = ci(frame, [0, S.duration], [-150, 150], Easing.inOut(Easing.sin));
  const xo = outP(frame, EXIT, 20);
  const wipe = ci(frame, [EXIT, S.duration], [2000, 0], Easing.in(Easing.exp));

  const aR = L(WORD.recursos);
  const tapeW = ci(frame, [aR - 2, aR + 16], [0, 1], Easing.out(Easing.cubic));

  return (
    <AbsoluteFill style={{ backgroundColor: ED.deskPurple, overflow: 'hidden' }}>
      {/* Papel amassado roxo — camada lenta do pan */}
      <AbsoluteFill style={{ transform: `translateX(${pan * 0.3}px) scale(1.15)` }}>
        <AbsoluteFill
          style={{
            mixBlendMode: 'multiply', opacity: 0.6,
            backgroundImage: `radial-gradient(ellipse at 20% 25%, rgba(255,255,255,0.16), transparent 40%),
              radial-gradient(ellipse at 78% 72%, rgba(0,0,0,0.4), transparent 45%),
              repeating-linear-gradient(118deg, rgba(0,0,0,0.10) 0 2px, transparent 2px 40px),
              repeating-linear-gradient(28deg, rgba(255,255,255,0.05) 0 2px, transparent 2px 56px)`,
          }}
        />
        <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(176,132,193,0.22), transparent 70%)' }} />
      </AbsoluteFill>
      <NoiseOverlay opacity={0.07} />

      {/* Tipografia — camada rápida do pan */}
      <AbsoluteFill
        style={{
          transform: `translateX(${pan + -1500 * xo}px) scale(${1 - 0.05 * xo})`, filter: `blur(${20 * xo}px)`,
          opacity: 1 - ci(xo, [0.5, 1], [0, 1]), justifyContent: 'center', alignItems: 'center', flexDirection: 'column',
        }}
      >
        <div style={{ fontFamily: ED.sans, fontWeight: 800, fontSize: 46, color: ED.lilac, ...edIn(frame, Math.max(4, L(WORD.como)), { trackFrom: -3, trackTo: 1 }) }}>
          COMO DEPUTADA FEDERAL
        </div>
        <div style={{ marginTop: 40, fontFamily: ED.sans, fontWeight: 900, fontSize: 230, lineHeight: 0.9, color: '#FFFFFF', textShadow: '0 20px 60px rgba(0,0,0,0.45)', ...edIn(frame, L(WORD.mais), { trackFrom: -12, trackTo: -6, y: 30 }) }}>
          MAIS
        </div>
        <div
          style={{
            marginTop: 30, background: ED.yellow, padding: '22px 46px 16px', transform: `rotate(-2deg) scaleX(${tapeW})`, transformOrigin: 'left',
            boxShadow: '20px 20px 60px rgba(0,0,0,0.4)',
            clipPath: 'polygon(0% 6%, 2% 0%, 98% 4%, 100% 0%, 99% 50%, 100% 96%, 97% 100%, 2% 95%, 0% 100%, 1% 50%)',
          }}
        >
          <span style={{ display: 'inline-block', fontFamily: ED.sans, fontWeight: 900, fontSize: 150, lineHeight: 1, color: ED.textDark, ...edIn(frame, aR + 4, { trackFrom: -8, trackTo: -4, y: 0, blur: 10 }) }}>
            RECURSOS
          </span>
        </div>
      </AbsoluteFill>

      {/* WIPE EDITORIAL — bloco off-white */}
      <div style={{ position: 'absolute', top: -200, bottom: -200, left: -300, width: 1800, background: ED.paper, transform: `translateX(${wipe}px) rotate(-4deg)`, boxShadow: '-40px 0 80px rgba(0,0,0,0.35)' }} />

      <AbsoluteFill style={{ backgroundColor: ED.yellow, opacity: flash }} />
    </AbsoluteFill>
  );
};
