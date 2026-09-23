import React from 'react';
import { AbsoluteFill, Easing, useCurrentFrame } from 'remotion';
import { ci } from '../lib/motion';
import { NoiseOverlay } from '../lib/Background';
import { ED, edIn } from '../lib/editorial';
import { LineIcon } from '../lib/LineIcon';
import { JOVENS_SCENES, WORD } from '../jovens-timing';

// Cena 4 — Novos Negócios | frames locais 0–108
// "para transformar boas ideias em novos negócios!"
// A sucção explode em off-white com light leaks; Crane Up lento. Só
// lettering: para TRANSFORMAR · a lâmpada se desenha e acende em "boas
// ideias" · EM NOVOS NEGÓCIOS! crava no bloco amarelo de borda roxa.
// Terço inferior livre para a legenda. No fim, dissolve direto no selo
// (cena 5 entra por cima com o gradiente roxo).
const S = JOVENS_SCENES.c4;
const L = (f: number) => f - S.from;

export const Jovens4_Negocios: React.FC = () => {
  const frame = useCurrentFrame();
  const light = ci(frame, [0, 14], [1, 0], Easing.out(Easing.cubic));
  const crane = ci(frame, [0, S.duration], [50, -30], Easing.inOut(Easing.cubic));
  const leak = Math.sin(frame * 0.02);
  const bulbAt = L(WORD.boas) - 4;
  const glow = ci(frame, [L(WORD.ideias), L(WORD.ideias) + 12], [0, 1], Easing.out(Easing.cubic));
  const bulbIn = ci(frame, [bulbAt - 4, bulbAt + 14], [0, 1], Easing.out(Easing.cubic));
  const blk = ci(frame, [L(WORD.novos) - 4, L(WORD.novos) + 18], [0, 1], Easing.out(Easing.cubic));

  return (
    <AbsoluteFill style={{ backgroundColor: '#F4EEF8', overflow: 'hidden' }}>
      <AbsoluteFill
        style={{
          opacity: 0.4, filter: 'blur(70px)',
          background: `radial-gradient(circle at ${8 + leak * 4}% 12%, rgba(255,150,60,1), transparent 30%),
            radial-gradient(circle at ${92 - leak * 4}% 70%, rgba(255,130,50,0.9), transparent 32%)`,
        }}
      />
      <NoiseOverlay opacity={0.035} />

      <AbsoluteFill style={{ transform: `translateY(${crane}px)` }}>
        <div style={{ position: 'absolute', top: 260, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontFamily: ED.sans, fontWeight: 800, fontSize: 56, color: ED.brandCore, ...edIn(frame, 2, { y: 12, trackFrom: -4, trackTo: -1 }) }}>para</div>
          <div style={{ fontFamily: ED.sans, fontWeight: 900, fontSize: 112, lineHeight: 1, color: ED.void, whiteSpace: 'nowrap', ...edIn(frame, Math.max(3, L(WORD.transformar)), { y: 20, trackFrom: 4, trackTo: -4 }) }}>
            TRANSFORMAR
          </div>

          {/* boas ideias + lâmpada */}
          <div style={{ marginTop: 50, display: 'flex', alignItems: 'center', gap: 30 }}>
            <div style={{ position: 'relative', width: 160, height: 160, opacity: bulbIn, transform: `scale(${0.75 + 0.25 * bulbIn})` }}>
              <div style={{ position: 'absolute', inset: -60, borderRadius: '50%', background: 'radial-gradient(circle, rgba(252,227,0,0.9), transparent 65%)', opacity: glow, transform: `scale(${0.6 + 0.4 * glow})` }} />
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: glow > 0 ? ED.yellow : '#FFFFFF', boxShadow: '0 20px 40px rgba(45,22,67,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LineIcon name="lampada" frame={frame} at={bulbAt} size={100} color={ED.void} stroke={1.9} />
              </div>
              {/* raios */}
              <svg width={160} height={160} viewBox="0 0 160 160" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
                {[...Array(8)].map((_, i) => {
                  const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
                  const r1 = 92 + 6 * glow;
                  const r2 = r1 + 26 * glow;
                  return <line key={i} x1={80 + Math.cos(a) * r1} y1={80 + Math.sin(a) * r1} x2={80 + Math.cos(a) * r2} y2={80 + Math.sin(a) * r2} stroke={ED.brandCore} strokeWidth={6} strokeLinecap="round" opacity={glow} />;
                })}
              </svg>
            </div>
            <div style={{ fontFamily: ED.sans, fontWeight: 900, fontSize: 96, lineHeight: 1, color: ED.brandCore, whiteSpace: 'nowrap' }}>
              <span style={{ display: 'inline-block', marginRight: 22, ...edIn(frame, L(WORD.boas), { y: 14, trackFrom: -6, trackTo: -3 }) }}>boas</span>
              <span style={{ display: 'inline-block', ...edIn(frame, L(WORD.ideias), { y: 14, trackFrom: -6, trackTo: -3 }) }}>ideias</span>
            </div>
          </div>

          <div style={{ marginTop: 56, fontFamily: ED.sans, fontWeight: 900, fontSize: 64, color: ED.void, ...edIn(frame, L(WORD.novos) - 5, { y: 12, trackFrom: -3, trackTo: -1 }) }}>EM</div>
          <div
            style={{
              marginTop: 12, background: ED.yellow, border: `8px solid ${ED.void}`, padding: '20px 44px 12px', textAlign: 'center',
              boxShadow: '0 40px 80px rgba(45,22,67,0.45)', opacity: blk, filter: `blur(${14 * (1 - blk)}px)`, transform: `translateY(${60 * (1 - blk)}px) rotate(-2deg) scale(${1.08 - 0.08 * blk})`,
            }}
          >
            <div style={{ fontFamily: ED.sans, fontWeight: 900, fontSize: 116, lineHeight: 0.95, letterSpacing: -4, color: ED.void, whiteSpace: 'nowrap' }}>NOVOS</div>
            <div style={{ fontFamily: ED.sans, fontWeight: 900, fontSize: 116, lineHeight: 0.95, color: ED.void, whiteSpace: 'nowrap', ...edIn(frame, L(WORD.negocios), { y: 0, blur: 10, trackFrom: -8, trackTo: -4 }) }}>
              NEGÓCIOS!
            </div>
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ backgroundColor: '#FFFFFF', opacity: light }} />
    </AbsoluteFill>
  );
};
