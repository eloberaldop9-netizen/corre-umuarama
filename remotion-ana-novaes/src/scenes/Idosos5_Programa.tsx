import React from 'react';
import { AbsoluteFill, Easing, useCurrentFrame } from 'remotion';
import { ci } from '../lib/motion';
import { DustParticles, NoiseOverlay } from '../lib/Background';
import { ED, edIn, outP } from '../lib/editorial';
import { IDOSOS_SCENES, WORD } from '../idosos-timing';

// Cena 5 — A Proposta (só lettering) | frames locais 0–138
// "Uma das propostas é criar um programa federal para ampliar a
// implantação de Centros-Dia,"
// Roxo profundo e liso, Z-push contínuo (1 → 1.15). UMA DAS PROPOSTAS
// discreto, PROGRAMA FEDERAL enorme em branco e CENTROS-DIA invade em
// amarelo por cima, com sombra densa. Saída: SUCÇÃO para o centro.
const S = IDOSOS_SCENES.c5;
const L = (f: number) => f - S.from;
const EXIT = 118;

export const Idosos5_Programa: React.FC = () => {
  const frame = useCurrentFrame();
  const push = ci(frame, [0, S.duration], [1, 1.15]);
  const sp = outP(frame, EXIT, 20);
  const big = (at: number) => {
    const p = ci(frame, [at, at + 24], [0, 1], Easing.out(Easing.cubic));
    return { opacity: p, filter: `blur(${20 * (1 - p)}px)`, transform: `scale(${1.1 - 0.1 * p})`, letterSpacing: -9 + 3 * p };
  };
  const cd = ci(frame, [L(WORD.centrosDia), L(WORD.centrosDia) + 22], [0, 1], Easing.out(Easing.cubic));

  return (
    <AbsoluteFill style={{ backgroundColor: ED.void, overflow: 'hidden' }}>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 42%, rgba(122,75,148,0.35), transparent 70%)' }} />
      <NoiseOverlay opacity={0.07} />
      <DustParticles count={24} />

      <AbsoluteFill style={{ transform: `scale(${push * (1 - sp)}) rotate(${-15 * sp}deg)`, filter: `blur(${30 * sp}px)`, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', paddingBottom: 280 }}>
        <div style={{ fontFamily: ED.sans, fontWeight: 800, fontSize: 44, color: ED.lilac, marginBottom: 30, ...edIn(frame, Math.max(3, L(WORD.uma)), { trackFrom: -3, trackTo: 2 }) }}>
          UMA DAS PROPOSTAS
        </div>
        <div style={{ fontFamily: ED.sans, fontWeight: 900, fontSize: 150, lineHeight: 0.95, color: '#FFFFFF', textAlign: 'center', whiteSpace: 'nowrap', ...big(L(WORD.programa)) }}>PROGRAMA</div>
        <div style={{ fontFamily: ED.sans, fontWeight: 900, fontSize: 150, lineHeight: 0.95, color: '#FFFFFF', textAlign: 'center', whiteSpace: 'nowrap', ...big(L(WORD.federal)) }}>FEDERAL</div>
        <div
          style={{
            marginTop: -20, background: ED.yellow, padding: '18px 44px 12px', transform: `translateY(${40 * (1 - cd)}px) rotate(-3deg)`, opacity: cd,
            boxShadow: '0 40px 90px rgba(0,0,0,0.75)', position: 'relative', zIndex: 2,
          }}
        >
          <span style={{ display: 'inline-block', fontFamily: ED.sans, fontWeight: 900, fontSize: 116, lineHeight: 1, color: ED.void, whiteSpace: 'nowrap', ...edIn(frame, L(WORD.centrosDia), { trackFrom: -9, trackTo: -5, y: 0, blur: 12 }) }}>
            CENTROS-DIA
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
