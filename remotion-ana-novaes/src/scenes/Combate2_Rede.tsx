import React from 'react';
import { AbsoluteFill, Easing, Img, staticFile, useCurrentFrame } from 'remotion';
import { ci } from '../lib/motion';
import { NoiseOverlay } from '../lib/Background';
import { ED, edIn, HEAVY_SHADOW, landIn, outP } from '../lib/editorial';
import { COMBATE_SCENES, WORD } from '../combate-timing';
import type { CombateAssets } from '../combate-timing';

// Cena 2 — A Rede | frames locais 0–250
// Mesa editorial roxa. Só três peças caem na mesa, no frame em que são
// faladas: MAIS RECURSOS, ACOLHIMENTO e PATRULHA. Sombras de 80px fazem os
// cards flutuarem sobre o papel. Pan horizontal contínuo (parallax: mesa
// mais lenta que os cards). Saída: bloco roxo varre tudo pra esquerda.
const S = COMBATE_SCENES.c2;
const L = (f: number) => f - S.from;
const EXIT = 226;

const Tape: React.FC<{ children: React.ReactNode; rot: number; frame: number; at: number; style?: React.CSSProperties }> = ({ children, rot, frame, at, style }) => (
  <div
    style={{
      position: 'absolute', background: ED.yellow, padding: '14px 30px 10px', transform: `rotate(${rot}deg)`,
      boxShadow: '0 8px 18px rgba(0,0,0,0.25)', ...style,
    }}
  >
    <span style={{ display: 'inline-block', fontFamily: ED.sans, fontWeight: 900, fontSize: 44, color: ED.textDark, ...edIn(frame, at, { y: 8, blur: 10 }) }}>
      {children}
    </span>
  </div>
);

export const Combate2_Rede: React.FC<{ assets: CombateAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();
  const flash = ci(frame, [0, 12], [1, 0], Easing.out(Easing.cubic));
  const pan = ci(frame, [0, S.duration], [-80, 80], Easing.inOut(Easing.sin));
  const xo = outP(frame, EXIT + 4, 20);
  const wipe = ci(frame, [EXIT, S.duration], [1500, 0], Easing.in(Easing.exp));

  const photo = (file: string, w: number, h: number, pos = '50% 50%') => (
    <div style={{ width: w, height: h, background: '#FFFFFF', padding: 16, paddingBottom: 56, boxShadow: HEAVY_SHADOW, boxSizing: 'border-box' }}>
      <Img src={staticFile(`assets/${file}`)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos }} />
    </div>
  );

  const aR = L(WORD.recursos) - 6;
  const aA = L(WORD.acolhimento) - 6;
  const aP = L(WORD.patrulhas) - 6;

  return (
    <AbsoluteFill style={{ backgroundColor: ED.deskPurple, overflow: 'hidden' }}>
      {/* Mesa: papel amassado (parallax lento) */}
      <AbsoluteFill style={{ transform: `translateX(${pan * 0.35}px) scale(1.1)` }}>
        <div
          style={{
            position: 'absolute', inset: 0, mixBlendMode: 'multiply', opacity: 0.55,
            backgroundImage: `radial-gradient(ellipse at 20% 30%, rgba(255,255,255,0.18), transparent 40%),
              radial-gradient(ellipse at 80% 70%, rgba(0,0,0,0.35), transparent 45%),
              repeating-linear-gradient(118deg, rgba(0,0,0,0.10) 0 2px, transparent 2px 38px),
              repeating-linear-gradient(28deg, rgba(255,255,255,0.05) 0 2px, transparent 2px 54px)`,
          }}
        />
        <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 45%, rgba(176,132,193,0.25), transparent 70%)' }} />
      </AbsoluteFill>
      <NoiseOverlay opacity={0.07} />

      {/* Cards (parallax rápido) */}
      <AbsoluteFill style={{ transform: `translateX(${pan + -1500 * xo}px)`, filter: `blur(${20 * xo}px)` }}>
        {/* Card 1 — MAIS RECURSOS */}
        <div style={{ position: 'absolute', top: 210, left: 90, ...landIn(frame, aR, -4) }}>
          <div
            style={{
              width: 600, height: 340, background: ED.paper, boxShadow: HEAVY_SHADOW, display: 'flex',
              alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
            }}
          >
            <span style={{ fontFamily: ED.serif, fontWeight: 700, fontStyle: 'italic', fontSize: 44, color: ED.brandCore, ...edIn(frame, aR + 8, { y: 6 }) }}>
              defender
            </span>
            <span style={{ fontFamily: ED.serif, fontWeight: 900, fontSize: 104, color: ED.textDark, lineHeight: 1.05, ...edIn(frame, aR + 12) }}>
              Mais
            </span>
          </div>
          <Tape frame={frame} at={aR + 16} rot={3} style={{ bottom: -30, left: 40 }}>RECURSOS</Tape>
        </div>

        {/* Card 2 — ACOLHIMENTO */}
        <div style={{ position: 'absolute', top: 600, left: 410, ...landIn(frame, aA, 3) }}>
          {photo(assets.fotoAcolhimento, 520, 640, '50% 55%')}
          <Tape frame={frame} at={aA + 14} rot={-3} style={{ bottom: 20, right: 30 }}>ACOLHIMENTO</Tape>
        </div>

        {/* Card 3 — PATRULHA */}
        <div style={{ position: 'absolute', top: 1140, left: 80, ...landIn(frame, aP, -6) }}>
          {photo(assets.fotoPatrulha, 500, 620, '55% 40%')}
          <Tape frame={frame} at={aP + 14} rot={4} style={{ bottom: 24, left: 150, whiteSpace: 'nowrap' }}>PATRULHA</Tape>
        </div>
      </AbsoluteFill>

      {/* WIPE VARRE — bloco roxo */}
      <div style={{ position: 'absolute', top: -100, bottom: -100, left: -200, width: 1600, background: ED.void, transform: `translateX(${wipe}px) skewX(-8deg)` }} />

      <AbsoluteFill style={{ backgroundColor: ED.yellow, opacity: flash }} />
    </AbsoluteFill>
  );
};
