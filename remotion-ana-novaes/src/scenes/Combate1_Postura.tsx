import React from 'react';
import { AbsoluteFill, Easing, Img, staticFile, useCurrentFrame } from 'remotion';
import { ci } from '../lib/motion';
import { DustParticles, NoiseOverlay } from '../lib/Background';
import { ED, edIn, outP } from '../lib/editorial';
import { COMBATE_SCENES, WORD } from '../combate-timing';
import type { CombateAssets } from '../combate-timing';

// Cena 1 — A Postura | frames 0–122
// Capa de revista: roxo profundo, a Ana recortada emergindo da sombra.
// "ANA NOVAIS" delicado no topo quando ela diz o nome; "COMBATE" colossal
// em amarelo POR TRÁS dela e "À VIOLÊNCIA" em branco NA FRENTE — o
// lettering fatia a profundidade. Saída Z-DIVE RASGA (stagger 0/3/6/10f).
const S = COMBATE_SCENES.c1;
const L = (f: number) => f - S.from;
const EXIT = 97;

export const Combate1_Postura: React.FC<{ assets: CombateAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();

  // Câmera — dolly in lento (z -500 → -150)
  const dolly = ci(frame, [0, S.duration], [1, 1.1], Easing.out(Easing.cubic));
  const par = Math.sin(frame * 0.05) * 4; // parallax de COMBATE

  const pIn = ci(frame, [0, 30], [0, 1], Easing.out(Easing.cubic));

  // Saída quádrupla com stagger
  const rip = (d: number) => {
    const p = outP(frame, EXIT + d, 20);
    return {
      transform: `translateX(${-1200 * p}px) skewX(${-15 * p}deg) scale(${1 - 0.05 * p})`,
      filter: `blur(${20 * p}px)`,
      opacity: 1 - ci(p, [0.4, 1], [0, 1]),
    };
  };
  const dive = outP(frame, EXIT + 10, 15);
  const blind = ci(frame, [EXIT + 16, S.duration], [0, 1], Easing.in(Easing.cubic));

  return (
    <AbsoluteFill style={{ backgroundColor: ED.void, overflow: 'hidden' }}>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(122,75,148,0.3), transparent 70%)' }} />
      <NoiseOverlay opacity={0.08} />
      <DustParticles count={30} />

      <AbsoluteFill style={{ transform: `scale(${dolly})` }}>
        {/* ANA NOVAIS — topo, delicado */}
        <div style={{ position: 'absolute', top: 150, left: 0, right: 0, textAlign: 'center', ...rip(3) }}>
          <span
            style={{
              display: 'inline-block', fontFamily: ED.sans, fontWeight: 300, fontSize: 50, color: '#FFFFFF',
              ...edIn(frame, Math.max(8, L(WORD.ana)), { trackFrom: 0, trackTo: 4, y: 20, blur: 8 }),
            }}
          >
            ANA NOVAIS
          </span>
        </div>

        {/* COMBATE — atrás da Ana */}
        <div
          style={{
            position: 'absolute', top: 590, left: -60, right: -60, textAlign: 'center',
            transform: `translateX(${par}px) scale(${1 + 29 * dive})`, opacity: 1 - ci(dive, [0.6, 1], [0, 1]),
          }}
        >
          <span
            style={{
              display: 'inline-block', fontFamily: ED.sans, fontWeight: 900, fontSize: 178, lineHeight: 1, color: ED.yellow,
              ...edIn(frame, L(WORD.combate), { trackFrom: -12, trackTo: -6, y: 0 }),
            }}
          >
            COMBATE
          </span>
        </div>

        {/* Retrato recortado — halftone sutil nas sombras */}
        <div
          style={{
            position: 'absolute', left: 110, bottom: 0, width: 1000, height: 1250,
            transform: rip(0).transform,
            opacity: pIn * (rip(0).opacity as number),
            filter: `brightness(${pIn}) blur(${20 * (1 - pIn) + 20 * outP(frame, EXIT, 20)}px) drop-shadow(0 40px 100px rgba(0,0,0,0.9))`,
          }}
        >
          <Img src={staticFile(`assets/${assets.retratoStopX}`)} style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'bottom' }} />
          <div
            style={{
              position: 'absolute', inset: 0, mixBlendMode: 'multiply', opacity: 0.22,
              backgroundImage: 'radial-gradient(rgba(0,0,0,1) 1.2px, transparent 1.8px)', backgroundSize: '7px 7px',
              maskImage: `url(${staticFile(`assets/${assets.retratoStopX}`)})`, WebkitMaskImage: `url(${staticFile(`assets/${assets.retratoStopX}`)})`,
              maskSize: 'contain', WebkitMaskSize: 'contain', maskPosition: 'bottom', WebkitMaskPosition: 'bottom',
              maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat',
            }}
          />
          {/* base: funde a barra da foto no roxo */}
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 260, background: `linear-gradient(180deg, transparent, ${ED.void})` }} />
        </div>

        {/* À VIOLÊNCIA — na frente da Ana */}
        <div style={{ position: 'absolute', top: 1420, left: 0, right: 0, textAlign: 'center', ...rip(6) }}>
          <span
            style={{
              display: 'inline-block', fontFamily: ED.sans, fontWeight: 900, fontSize: 110, lineHeight: 1, color: '#FFFFFF',
              textShadow: '0 12px 50px rgba(0,0,0,0.85)',
              ...edIn(frame, L(WORD.violencia), { trackFrom: -9, trackTo: -4, y: 0 }),
            }}
          >
            À VIOLÊNCIA
          </span>
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ backgroundColor: ED.yellow, opacity: blind }} />
    </AbsoluteFill>
  );
};
