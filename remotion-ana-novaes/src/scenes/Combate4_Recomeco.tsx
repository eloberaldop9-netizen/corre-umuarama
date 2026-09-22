import React from 'react';
import { AbsoluteFill, Easing, Img, staticFile, useCurrentFrame } from 'remotion';
import { ci } from '../lib/motion';
import { NoiseOverlay } from '../lib/Background';
import { ED, edIn, outP } from '../lib/editorial';
import { COMBATE_SCENES, WORD } from '../combate-timing';
import type { CombateAssets } from '../combate-timing';

// Cena 4 — O Recomeço | frames locais 0–250
// A luz: papel off-white, light leaks quentes nas bordas, a foto da
// capacitação sobe imponente (Crane Up). As propostas entram como tinta
// absorvendo no papel — EMPREGO, CAPACITAÇÃO, EMPREENDEDORISMO (pill
// amarela suave) — e fecha com "em situação de violência" em serifa.
// Saída: dissolve sujo (blur + brilho caindo) rumo ao roxo do selo.
const S = COMBATE_SCENES.c4;
const L = (f: number) => f - S.from;
const EXIT = 226;

export const Combate4_Recomeco: React.FC<{ assets: CombateAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();
  const bgIn = ci(frame, [0, 14], [0, 1]);
  const crane = ci(frame, [0, S.duration], [40, -40], Easing.inOut(Easing.cubic));
  const ph = ci(frame, [5, 40], [0, 1], Easing.out(Easing.cubic));
  const d = ci(frame, [EXIT, S.duration], [0, 1], Easing.in(Easing.cubic));
  const leak = Math.sin(frame * 0.02);

  const word: React.CSSProperties = { fontFamily: ED.serif, fontWeight: 700, fontSize: 84, lineHeight: 1.08, color: ED.void, display: 'inline-block' };

  return (
    <AbsoluteFill style={{ backgroundColor: ED.paper, opacity: bgIn, overflow: 'hidden' }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${8 + leak * 3}% 12%, rgba(255,160,70,0.35), transparent 38%),
            radial-gradient(circle at ${94 - leak * 3}% 88%, rgba(255,140,60,0.28), transparent 40%)`,
          filter: 'blur(40px)',
        }}
      />
      <NoiseOverlay opacity={0.035} />

      <AbsoluteFill style={{ filter: `blur(${40 * d}px) brightness(${1 - 0.7 * d})`, transform: `translateY(${crane}px)` }}>
        {/* Foto — parallax mais lento que o texto */}
        <div
          style={{
            position: 'absolute', top: 150, left: 140, width: 800, height: 900, background: '#FFFFFF', padding: 16,
            boxSizing: 'border-box', boxShadow: '0 40px 80px rgba(45,22,67,0.35)',
            opacity: ph, transform: `translateY(${100 * (1 - ph) + crane * -0.4}px)`,
          }}
        >
          <Img src={staticFile(`assets/${assets.fotoCapacitacao}`)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 30%' }} />
        </div>

        <div style={{ position: 'absolute', top: 1140, left: 80, right: 80, textAlign: 'center' }}>
          <div><span style={{ ...word, ...edIn(frame, L(WORD.emprego)) }}>EMPREGO</span></div>
          <div><span style={{ ...word, ...edIn(frame, L(WORD.capacitacao) + 6) }}>CAPACITAÇÃO</span></div>
          <div style={{ marginTop: 14 }}>
            <span
              style={{
                ...word, fontSize: 72, background: 'rgba(252,227,0,0.55)', borderRadius: 14, padding: '6px 26px 10px',
                ...edIn(frame, L(WORD.empreendedorismo)),
              }}
            >
              EMPREENDEDORISMO
            </span>
          </div>
          <div style={{ marginTop: 34 }}>
            <span
              style={{
                display: 'inline-block', fontFamily: ED.serif, fontStyle: 'italic', fontWeight: 700, fontSize: 54, color: ED.brandCore,
                ...edIn(frame, L(WORD.situacao), { dur: 34, y: 0 }),
              }}
            >
              em situação de violência
            </span>
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ backgroundColor: ED.void, opacity: ci(d, [0.4, 1], [0, 1]) }} />
    </AbsoluteFill>
  );
};
