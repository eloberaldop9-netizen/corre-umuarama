import React from 'react';
import { AbsoluteFill, Easing, useCurrentFrame } from 'remotion';
import { ci } from '../lib/motion';
import { NoiseOverlay } from '../lib/Background';
import { ED } from '../lib/editorial';
import { COMBATE_SCENES } from '../combate-timing';

// Cena 5 — O Selo | frames locais 0–150
// Limpeza absoluta: gradiente institucional roxo → lilás. Pill, nome e
// número assentam como um bloco único (translateY 30→0, 3f entre eles),
// micro-zoom quase imperceptível e fade solene para o preto no fim.
const S = COMBATE_SCENES.c5;

export const Combate5_Lockup: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = ci(frame, [0, S.duration], [1, 1.025]);
  const fade = ci(frame, [S.duration - 20, S.duration], [1, 0]);
  const up = (at: number): React.CSSProperties => {
    const p = ci(frame, [at, at + 30], [0, 1], Easing.out(Easing.cubic));
    return { opacity: p, transform: `translateY(${30 * (1 - p)}px)`, filter: `blur(${8 * (1 - p)}px)` };
  };

  return (
    <AbsoluteFill style={{ opacity: fade, backgroundColor: '#000' }}>
      <AbsoluteFill style={{ background: `linear-gradient(170deg, ${ED.void} 0%, ${ED.brandCore} 60%, ${ED.lilac} 100%)` }} />
      <NoiseOverlay opacity={0.04} />
      <AbsoluteFill style={{ transform: `scale(${zoom})`, alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <div style={{ background: ED.yellow, borderRadius: 999, padding: '16px 46px', ...up(12) }}>
          <span style={{ fontFamily: ED.sans, fontWeight: 800, fontSize: 36, letterSpacing: -1, color: ED.void }}>DEPUTADA FEDERAL</span>
        </div>
        <div style={{ marginTop: 26, fontFamily: ED.sans, fontWeight: 800, fontSize: 120, letterSpacing: -1, color: '#FFFFFF', ...up(15) }}>
          Ana Novais
        </div>
        <div style={{ marginTop: 10, fontFamily: ED.sans, fontWeight: 900, fontSize: 240, letterSpacing: -4, lineHeight: 1, color: ED.yellow, ...up(18) }}>
          2010
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
