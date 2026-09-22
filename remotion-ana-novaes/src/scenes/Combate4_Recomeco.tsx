import React from 'react';
import { AbsoluteFill, Easing, Img, staticFile, useCurrentFrame } from 'remotion';
import { ci } from '../lib/motion';
import { NoiseOverlay } from '../lib/Background';
import { ED, edIn } from '../lib/editorial';
import { COMBATE_SCENES, WORD } from '../combate-timing';
import type { CombateAssets } from '../combate-timing';

// Cena 4 — O Recomeço | frames locais 0–215
// "Por isso, Ana propõe incentivar emprego, capacitação profissional e
// empreendedorismo para mulheres em situação de violência." A escuridão explode em luz lilás. A sala de aula
// ocupa a tela inteira (mesmo formato 9:16 da foto, nada cortado) com
// máscara de gradiente na base. Letterings sans-serif entram de baixo como
// tinta: #EMPREGO, #CAPACITAÇÃO, #EMPREENDEDORISMO e fecha com PARA
// MULHERES EM SITUAÇÃO DE VIOLÊNCIA. Crane Up.
// Saída: DISSOLVE SUJO rumo ao roxo do selo.
const S = COMBATE_SCENES.c4;
const L = (f: number) => f - S.from;
const EXIT = 200;

export const Combate4_Recomeco: React.FC<{ assets: CombateAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();
  const light = ci(frame, [0, 16], [1, 0], Easing.out(Easing.cubic));
  const bgIn = ci(frame, [0, 24], [0, 1], Easing.out(Easing.cubic));
  const crane = ci(frame, [0, S.duration], [90, -70], Easing.inOut(Easing.cubic));
  const d = ci(frame, [EXIT, S.duration], [0, 1], Easing.in(Easing.cubic));
  const leak = Math.sin(frame * 0.02);

  const tag: React.CSSProperties = { fontFamily: ED.sans, fontWeight: 900, fontSize: 104, lineHeight: 1.05, color: ED.void, display: 'inline-block' };

  return (
    <AbsoluteFill style={{ backgroundColor: '#EDE3F4', overflow: 'hidden' }}>
      <AbsoluteFill style={{ filter: `blur(${40 * d}px) brightness(${1 - d})` }}>
        {/* Foto — parallax lento */}
        <AbsoluteFill
          style={{
            opacity: bgIn, transform: `translateY(${crane * 0.35}px) scale(1.06)`,
            maskImage: 'linear-gradient(to bottom, black 45%, transparent 82%)', WebkitMaskImage: 'linear-gradient(to bottom, black 45%, transparent 82%)',
          }}
        >
          <Img src={staticFile(`assets/${assets.fotoCapacitacao}`)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 0%' }} />
        </AbsoluteFill>
        <AbsoluteFill
          style={{
            opacity: 0.35, filter: 'blur(60px)', mixBlendMode: 'screen',
            background: `radial-gradient(circle at ${6 + leak * 4}% 8%, rgba(255,150,60,1), transparent 30%),
              radial-gradient(circle at ${96 - leak * 4}% 60%, rgba(255,130,50,1), transparent 32%)`,
          }}
        />
        <NoiseOverlay opacity={0.035} />

        {/* Letterings — parallax rápido */}
        <div style={{ position: 'absolute', top: 1130, left: 60, right: 60, transform: `translateY(${crane}px)` }}>
          <div><span style={{ ...tag, ...edIn(frame, L(WORD.emprego), { y: 30, blur: 10, trackFrom: -6, trackTo: -3 }) }}>#EMPREGO</span></div>
          <div><span style={{ ...tag, ...edIn(frame, L(WORD.capacitacao) + 6, { y: 30, blur: 10, trackFrom: -6, trackTo: -3 }) }}>#CAPACITAÇÃO</span></div>
          <div style={{ marginTop: 18 }}>
            <span
              style={{
                ...tag, fontSize: 74, color: ED.yellow, background: ED.void, padding: '16px 28px 12px', boxShadow: '0 24px 60px rgba(45,22,67,0.4)',
                ...edIn(frame, L(WORD.empreendedorismo), { y: 40, blur: 15, trackFrom: -7, trackTo: -3 }),
              }}
            >
              #EMPREENDEDORISMO
            </span>
          </div>
          <div style={{ marginTop: 26, fontFamily: ED.sans, fontWeight: 800, fontSize: 46, lineHeight: 1.1, color: ED.brandCore, ...edIn(frame, L(WORD.mulheresFim), { y: 20, blur: 10, trackFrom: -4, trackTo: -1 }) }}>
            PARA MULHERES EM
            <br />
            SITUAÇÃO DE VIOLÊNCIA
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ backgroundColor: ED.void, opacity: ci(d, [0.5, 1], [0, 1]) }} />
      <AbsoluteFill style={{ backgroundColor: '#FFFFFF', opacity: light }} />
    </AbsoluteFill>
  );
};
