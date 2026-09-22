import React from 'react';
import { AbsoluteFill, Easing, Img, staticFile, useCurrentFrame } from 'remotion';
import { ci } from '../lib/motion';
import { NoiseOverlay } from '../lib/Background';
import { ED, edIn } from '../lib/editorial';
import { COMBATE_SCENES, WORD } from '../combate-timing';
import type { CombateAssets } from '../combate-timing';

// Cena 4 — O Recomeço | frames locais 0–240
// O buraco negro explode em luz: off-white lilás, light leaks quentes, a
// foto da sala de aula flutua ao fundo em sépia suave (60%). Crane Up.
// Sem blocos nem fitas: EMPREGO e CAPACITAÇÃO PROFISSIONAL em serifa leve,
// EMPREENDEDORISMO como hero amarelo sobre roxo. Saída: DISSOLVE SUJO.
const S = COMBATE_SCENES.c4;
const L = (f: number) => f - S.from;
const EXIT = 218;

export const Combate4_Recomeco: React.FC<{ assets: CombateAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();
  const light = ci(frame, [0, 16], [1, 0], Easing.out(Easing.cubic)); // explosão de luz
  const crane = ci(frame, [0, S.duration], [120, -90], Easing.inOut(Easing.cubic));
  const bgIn = ci(frame, [0, 20], [0, 1], Easing.out(Easing.cubic));
  const d = ci(frame, [EXIT, S.duration], [0, 1], Easing.in(Easing.cubic));
  const leak = Math.sin(frame * 0.02);

  const serif: React.CSSProperties = { fontFamily: ED.serifLight, fontWeight: 300, fontSize: 96, lineHeight: 1.02, color: ED.void };

  return (
    <AbsoluteFill style={{ backgroundColor: ED.paper, overflow: 'hidden' }}>
      <AbsoluteFill style={{ filter: `blur(${40 * d}px) brightness(${1 - d})` }}>
        {/* Foto flutuando ao fundo — parallax lento */}
        <div
          style={{
            position: 'absolute', top: 90, left: 90, right: 90, height: 1050, opacity: 0.6 * bgIn,
            transform: `translateY(${crane * 0.45}px)`, boxShadow: '0 40px 100px rgba(45,22,67,0.25)',
          }}
        >
          <Img
            src={staticFile(`assets/${assets.fotoCapacitacao}`)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 32%', filter: 'sepia(0.35) saturate(0.8) contrast(0.95)' }}
          />
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 380, background: `linear-gradient(180deg, transparent, ${ED.paper})` }} />
        </div>

        {/* Light leaks */}
        <AbsoluteFill
          style={{
            opacity: 0.4, filter: 'blur(60px)', mixBlendMode: 'screen',
            background: `radial-gradient(circle at ${6 + leak * 4}% 10%, rgba(255,150,60,1), transparent 32%),
              radial-gradient(circle at ${96 - leak * 4}% 70%, rgba(255,130,50,1), transparent 34%)`,
          }}
        />
        <NoiseOverlay opacity={0.035} />

        {/* Letterings — parallax rápido */}
        <div style={{ position: 'absolute', top: 1060, left: 60, right: 60, textAlign: 'center', transform: `translateY(${crane}px)` }}>
          <div><span style={{ ...serif, display: 'inline-block', ...edIn(frame, L(WORD.emprego), { y: 30, trackFrom: -4, trackTo: -1 }) }}>EMPREGO</span></div>
          <div style={{ marginTop: 10 }}>
            <span style={{ ...serif, fontSize: 82, display: 'inline-block', ...edIn(frame, L(WORD.capacitacao) + 4, { y: 30, trackFrom: -4, trackTo: -1 }) }}>
              CAPACITAÇÃO<br />PROFISSIONAL
            </span>
          </div>
          <div style={{ marginTop: 34 }}>
            <span
              style={{
                display: 'inline-block', background: ED.void, padding: '14px 34px 12px', fontFamily: ED.sans, fontWeight: 900, fontSize: 80,
                color: ED.yellow, boxShadow: '0 24px 60px rgba(45,22,67,0.35)',
                ...edIn(frame, L(WORD.empreendedorismo), { y: 40, blur: 20, trackFrom: -6, trackTo: -2 }),
              }}
            >
              EMPREENDEDORISMO
            </span>
          </div>
        </div>
      </AbsoluteFill>

      {/* afunda no roxo da cena final */}
      <AbsoluteFill style={{ backgroundColor: ED.void, opacity: ci(d, [0.5, 1], [0, 1]) }} />
      <AbsoluteFill style={{ backgroundColor: '#FFFFFF', opacity: light }} />
    </AbsoluteFill>
  );
};
