import React from 'react';
import { AbsoluteFill, Easing, Img, staticFile, useCurrentFrame } from 'remotion';
import { ci } from '../lib/motion';
import { NoiseOverlay } from '../lib/Background';
import { ED, edIn, outP } from '../lib/editorial';
import { COMBATE_SCENES, WORD } from '../combate-timing';
import type { CombateAssets } from '../combate-timing';

// Cena 1 — A Postura | frames 0–122
// Roxo profundo, só a Ana (mão com o X) emergindo da sombra. Quando ela diz
// "combate à violência", o lettering amarelo monumental se revela ATRÁS dela
// (blur + tracking). Saída Z-DIVE: a foto desliza pra esquerda e o
// lettering explode em Z até o amarelo cegar a tela.
const S = COMBATE_SCENES.c1;
const L = (f: number) => f - S.from;

export const Combate1_Postura: React.FC<{ assets: CombateAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();

  // Câmera — dolly in lento (z -400 → -150 ≈ escala 1 → 1.08)
  const dolly = ci(frame, [0, S.duration], [1, 1.08], Easing.out(Easing.cubic));

  const pIn = ci(frame, [0, 34], [0, 1], Easing.out(Easing.cubic));
  const px = outP(frame, 100, 22);
  const tx = outP(frame, 104, 18);
  const blind = ci(frame, [110, S.duration], [0, 1], Easing.in(Easing.cubic));

  const hero: React.CSSProperties = {
    fontFamily: ED.sans, fontWeight: 900, fontSize: 118, lineHeight: 0.98, color: ED.yellow, display: 'block',
  };

  return (
    <AbsoluteFill style={{ backgroundColor: ED.void, overflow: 'hidden' }}>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(122,75,148,0.45), transparent 70%)' }} />
      <NoiseOverlay opacity={0.06} />

      <AbsoluteFill style={{ transform: `scale(${dolly})` }}>
        {/* Hero lettering — camada de trás (parallax mais lento que a foto) */}
        <div
          style={{
            position: 'absolute', top: 250, left: 0, right: 0, textAlign: 'center',
            transform: `scale(${1 + 29 * tx}) translateY(${ci(frame, [0, S.duration], [12, -12])}px)`,
            opacity: 1 - ci(tx, [0.6, 1], [0, 1]),
          }}
        >
          <span style={{ ...hero, ...edIn(frame, L(WORD.combate), { y: 0 }) }}>COMBATE À</span>
          <span style={{ ...hero, ...edIn(frame, L(WORD.violencia), { y: 0 }) }}>VIOLÊNCIA</span>
        </div>

        {/* Retrato — emerge da sombra, sombra densa separando do lettering */}
        <div
          style={{
            position: 'absolute', left: 60, right: 60, bottom: 0, height: 1340,
            opacity: pIn * (1 - ci(px, [0.3, 1], [0, 1])),
            filter: `brightness(${pIn}) blur(${20 * (1 - pIn) + 20 * px}px)`,
            transform: `translateX(${-1200 * px}px) translateY(${ci(frame, [0, S.duration], [0, -20])}px)`,
            maskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, #000 70%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, #000 70%, transparent 100%)',
          }}
        >
          <Img
            src={staticFile(`assets/${assets.retratoStopX}`)}
            style={{
              width: '100%', height: '100%', objectFit: 'cover', objectPosition: '55% 30%',
              filter: 'saturate(0.9) contrast(1.05)',
            }}
          />
          {/* Vinheta sólida na cor do fundo — a rua clara some e ela emerge da sombra */}
          <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 56% 54% at 52% 50%, transparent 38%, ${ED.void} 76%)` }} />
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${ED.void} 0%, rgba(45,22,67,0.55) 16%, transparent 34%, transparent 80%, ${ED.void} 100%)` }} />
        </div>
      </AbsoluteFill>

      {/* Amarelo cega a tela — ponte pra Cena 2 */}
      <AbsoluteFill style={{ backgroundColor: ED.yellow, opacity: blind }} />
    </AbsoluteFill>
  );
};
