import React from 'react';
import { AbsoluteFill, Easing, useCurrentFrame } from 'remotion';
import { ci } from '../lib/motion';
import { PaperPurple } from '../lib/PaperPurple';
import { ED, edIn, outP } from '../lib/editorial';
import { COMBATE_SCENES, WORD } from '../combate-timing';

// Cena 2b — Os Recursos | frames locais 0–70
// "mais recursos e políticas públicas"
// Só tipografia, na ordem da fala: MAIS → fita RECURSOS → bloco E POLÍTICAS
// PÚBLICAS. Composição na metade de cima; terço inferior livre para a
// legenda. Saída: sobe com blur (quádrupla), stagger 2f.
const S = COMBATE_SCENES.c2b;
const L = (f: number) => f - S.from;
const EXIT = 52;

export const Combate2b_Recursos: React.FC = () => {
  const frame = useCurrentFrame();
  const pan = ci(frame, [0, S.duration], [-30, 30], Easing.inOut(Easing.sin));
  const out = (d: number): React.CSSProperties => {
    const p = outP(frame, EXIT + d, 16);
    return { transform: `translateY(${-160 * p}px) scale(${1 - 0.05 * p})`, filter: `blur(${20 * p}px)`, opacity: 1 - ci(p, [0.4, 1], [0, 1]) };
  };
  const inF = ci(frame, [0, 8], [0, 1]);

  const aR = L(WORD.recursos);
  const tapeW = ci(frame, [aR - 2, aR + 14], [0, 1], Easing.out(Easing.cubic));
  const pP = ci(frame, [L(WORD.politicas), L(WORD.politicas) + 18], [0, 1], Easing.out(Easing.cubic));

  return (
    <AbsoluteFill style={{ overflow: 'hidden', opacity: inF }}>
      <PaperPurple shift={pan * 0.3} />

      <div style={{ position: 'absolute', top: 330, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `translateX(${pan}px)` }}>
        <div style={out(0)}>
          <div style={{ fontFamily: ED.sans, fontWeight: 900, fontSize: 210, lineHeight: 0.9, color: '#FFFFFF', textShadow: '0 20px 60px rgba(0,0,0,0.45)', ...edIn(frame, Math.max(3, L(WORD.mais)), { trackFrom: -12, trackTo: -6, y: 30 }) }}>
            MAIS
          </div>
        </div>
        <div style={{ marginTop: 34, ...out(2) }}>
          <div
            style={{
              background: ED.yellow, padding: '22px 46px 16px', transform: `rotate(-2deg) scaleX(${tapeW})`, transformOrigin: 'left',
              boxShadow: '20px 20px 60px rgba(0,0,0,0.4)',
              clipPath: 'polygon(0% 6%, 2% 0%, 98% 4%, 100% 0%, 99% 50%, 100% 96%, 97% 100%, 2% 95%, 0% 100%, 1% 50%)',
            }}
          >
            <span style={{ display: 'inline-block', fontFamily: ED.sans, fontWeight: 900, fontSize: 132, lineHeight: 1, color: ED.textDark, ...edIn(frame, aR + 4, { trackFrom: -8, trackTo: -4, y: 0, blur: 10 }) }}>
              RECURSOS
            </span>
          </div>
        </div>
        <div style={{ marginTop: 50, ...out(4) }}>
          <div style={{ background: ED.paper, padding: '20px 38px 16px', boxShadow: '20px 20px 60px rgba(0,0,0,0.4)', opacity: pP, transform: `translateY(${40 * (1 - pP)}px) rotate(1.5deg)` }}>
            <span style={{ fontFamily: ED.sans, fontWeight: 900, fontSize: 68, lineHeight: 1, letterSpacing: -2, color: ED.void }}>E POLÍTICAS PÚBLICAS</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
