import React from 'react';
import { AbsoluteFill, Easing, Img, staticFile, useCurrentFrame } from 'remotion';
import { ci } from '../lib/motion';
import { NoiseOverlay } from '../lib/Background';
import { ED, edIn } from '../lib/editorial';
import { IDOSOS_SCENES, WORD } from '../idosos-timing';
import type { IdososAssets } from '../idosos-timing';

// Cena 4 — O Peso da Lei | frames locais 0–118
// "fortalecendo as leis e a proteção de quem já contribuiu tanto com a
// nossa sociedade!"
// Papel off-white limpo, duas batidas:
//  A) o martelo da Justiça como recorte de jornal (P&B + halftone) e
//     FORTALECENDO / AS LEIS / E A PROTEÇÃO palavra por palavra;
//  B) em "de quem já contribuiu tanto", a página troca: o idoso artesão
//     trabalhando (uma vida de trabalho) com QUEM JÁ CONTRIBUIU + TANTO.
// Terço inferior livre para a legenda. Saída: FLIP 3D de página.
const S = IDOSOS_SCENES.c4;
const L = (f: number) => f - S.from;
const EXIT = 100;
const B_AT = L(WORD.quem) - 4; // troca de batida

export const Idosos4_Leis: React.FC<{ assets: IdososAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();
  const pan = ci(frame, [0, S.duration], [-20, 20], Easing.inOut(Easing.sin));
  const clip = ci(frame, [4, 28], [0, 1], Easing.out(Easing.cubic));
  const aOut = ci(frame, [B_AT, B_AT + 14], [0, 1], Easing.in(Easing.cubic));
  const aStyle: React.CSSProperties = { opacity: 1 - aOut, transform: `translateY(${-140 * aOut}px) scale(${1 - 0.05 * aOut})`, filter: `blur(${20 * aOut}px)` };
  const bIn = ci(frame, [B_AT + 4, B_AT + 28], [0, 1], Easing.out(Easing.cubic));
  const flip = ci(frame, [EXIT, S.duration], [0, 1], Easing.in(Easing.cubic));

  const word = (text: string, at: number, size: number, color: string = ED.void) => (
    <span style={{ display: 'inline-block', fontFamily: ED.sans, fontWeight: 900, fontSize: size, lineHeight: 1, color, marginRight: size * 0.25, ...edIn(frame, at, { trackFrom: 4, trackTo: -1, y: 16, blur: 10 }) }}>
      {text}
    </span>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <AbsoluteFill style={{ transform: `perspective(1600px) rotateY(${90 * flip}deg)`, transformOrigin: 'left center', filter: `brightness(${1 - 0.8 * flip})` }}>
        <AbsoluteFill style={{ backgroundColor: ED.paper }}>
          <AbsoluteFill style={{ mixBlendMode: 'multiply', opacity: 0.5, backgroundImage: 'repeating-linear-gradient(118deg, rgba(60,30,80,0.05) 0 2px, transparent 2px 46px)' }} />
          <NoiseOverlay opacity={0.04} />
        </AbsoluteFill>

        <AbsoluteFill style={{ transform: `translateX(${pan}px)`, ...aStyle }}>
          <div style={{ position: 'absolute', top: 200, left: 90, opacity: clip, transform: `translateY(${50 * (1 - clip)}px) rotate(-1.5deg)`, filter: `blur(${10 * (1 - clip)}px)` }}>
            <div style={{ background: '#FFFFFF', padding: 16, boxShadow: '0 30px 70px rgba(45,22,67,0.35)' }}>
              <div style={{ position: 'relative', width: 868, height: 520, overflow: 'hidden' }}>
                <Img src={staticFile(`assets/${assets.leis}`)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '70% 50%', filter: 'grayscale(1) contrast(1.2)' }} />
                <div style={{ position: 'absolute', inset: 0, mixBlendMode: 'multiply', opacity: 0.25, backgroundImage: 'radial-gradient(rgba(0,0,0,1) 1.1px, transparent 1.7px)', backgroundSize: '6px 6px' }} />
              </div>
            </div>
          </div>

          <div style={{ position: 'absolute', top: 820, left: 90, right: 60 }}>
            <div>{word('FORTALECENDO', Math.max(3, L(WORD.fortalecendo)), 92)}</div>
            <div style={{ marginTop: 8 }}>
              {word('AS', L(WORD.leis) - 3, 190)}
              <span style={{ display: 'inline-block', background: ED.yellow, padding: '0 18px', ...edIn(frame, L(WORD.leis), { trackFrom: 4, trackTo: -1, y: 16, blur: 10 }) }}>
                <span style={{ fontFamily: ED.sans, fontWeight: 900, fontSize: 190, lineHeight: 1, color: ED.void }}>LEIS</span>
              </span>
            </div>
            <div style={{ marginTop: 18 }}>
              {word('E', L(WORD.protecao2) - 3, 72, ED.brandCore)}
              {word('A', L(WORD.protecao2) - 1, 72, ED.brandCore)}
              {word('PROTEÇÃO', L(WORD.protecao2), 72, ED.brandCore)}
            </div>
          </div>
        </AbsoluteFill>

        {/* Batida B — quem já contribuiu tanto */}
        <AbsoluteFill style={{ transform: `translateX(${pan}px)` }}>
          <div style={{ position: 'absolute', top: 200, left: 90, opacity: bIn, transform: `translateY(${80 * (1 - bIn)}px) rotate(1.5deg)`, filter: `blur(${12 * (1 - bIn)}px)` }}>
            <div style={{ background: '#FFFFFF', padding: 16, boxShadow: '0 30px 70px rgba(45,22,67,0.35)' }}>
              <div style={{ position: 'relative', width: 868, height: 579, overflow: 'hidden' }}>
                <Img src={staticFile(`assets/${assets.artesao}`)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '75% 40%', filter: 'grayscale(1) contrast(1.15)' }} />
                <div style={{ position: 'absolute', inset: 0, mixBlendMode: 'multiply', opacity: 0.22, backgroundImage: 'radial-gradient(rgba(0,0,0,1) 1.1px, transparent 1.7px)', backgroundSize: '6px 6px' }} />
              </div>
            </div>
          </div>
          <div style={{ position: 'absolute', top: 880, left: 90, right: 60 }}>
            <div>
              {word('QUEM', L(WORD.quem), 84)}
              {word('JÁ', L(WORD.quem) + 3, 84)}
              {word('CONTRIBUIU', L(WORD.quem) + 8, 84)}
            </div>
            <div style={{ marginTop: 14 }}>
              <span style={{ display: 'inline-block', background: ED.yellow, padding: '6px 24px 2px', ...edIn(frame, L(WORD.tanto), { trackFrom: 4, trackTo: -1, y: 16, blur: 10 }) }}>
                <span style={{ fontFamily: ED.sans, fontWeight: 900, fontSize: 170, lineHeight: 1, color: ED.void }}>TANTO</span>
              </span>
            </div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
