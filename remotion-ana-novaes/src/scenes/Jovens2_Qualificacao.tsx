import React from 'react';
import { AbsoluteFill, Easing, useCurrentFrame } from 'remotion';
import { ci } from '../lib/motion';
import { NoiseOverlay } from '../lib/Background';
import { ED, edIn } from '../lib/editorial';
import { LineIcon } from '../lib/LineIcon';
import { JOVENS_SCENES, WORD } from '../jovens-timing';

// Cena 2 — A Qualificação | frames locais 0–222
// "Como deputada federal, pretende defender mais qualificação profissional,
// inclusão digital e políticas que facilitem o acesso ao primeiro emprego!"
// Papel #F4EEF8 limpo com pan lateral lento, duas batidas no terço de cima
// (terço inferior LIVRE para a legenda):
//  A) pill COMO DEPUTADA FEDERAL; fita MAIS QUALIFICAÇÃO PROFISSIONAL com
//     o capelo se desenhando; bloco roxo INCLUSÃO DIGITAL com o notebook.
//  B) fita E POLÍTICAS; "que facilitem o acesso ao"; bloco PRIMEIRO
//     EMPREGO! com a maleta.
// Saída: WIPE roxo.
const S = JOVENS_SCENES.c2;
const L = (f: number) => f - S.from;
const B_AT = L(WORD.politicas) - 8;
const EXIT = 204;

const IconBadge: React.FC<{ frame: number; at: number; name: string; size?: number; bg?: string; color?: string }> = ({ frame, at, name, size = 150, bg = ED.yellow, color = ED.void }) => {
  const p = ci(frame, [at - 4, at + 14], [0, 1], Easing.out(Easing.cubic));
  return (
    <div style={{ flex: 'none', width: size, height: size, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 40px rgba(45,22,67,0.3)', opacity: p, transform: `scale(${0.7 + 0.3 * p})`, filter: `blur(${8 * (1 - p)}px)` }}>
      <LineIcon name={name} frame={frame} at={at} size={size * 0.58} color={color} stroke={1.9} />
    </div>
  );
};

export const Jovens2_Qualificacao: React.FC = () => {
  const frame = useCurrentFrame();
  const flash = ci(frame, [0, 12], [1, 0], Easing.out(Easing.cubic));
  const pan = ci(frame, [0, S.duration], [24, -24], Easing.inOut(Easing.sin));
  const aOut = ci(frame, [B_AT, B_AT + 14], [0, 1], Easing.in(Easing.cubic));
  const aStyle: React.CSSProperties = { opacity: 1 - aOut, transform: `translateY(${-160 * aOut}px)`, filter: `blur(${20 * aOut}px)` };
  const wipe = ci(frame, [EXIT, S.duration], [2000, 0], Easing.in(Easing.exp));
  const tape = (at: number) => ci(frame, [at, at + 10], [0, 100], Easing.out(Easing.cubic));
  const block = (at: number) => {
    const p = ci(frame, [at - 4, at + 18], [0, 1], Easing.out(Easing.cubic));
    return { opacity: p, transform: `translateY(${60 * (1 - p)}px) rotate(-1.5deg)`, filter: `blur(${12 * (1 - p)}px)` };
  };

  const qTape = tape(L(WORD.qualificacao) - 4);
  const polTape = tape(L(WORD.politicas) + 6);

  return (
    <AbsoluteFill style={{ backgroundColor: ED.paper, overflow: 'hidden' }}>
      <AbsoluteFill style={{ mixBlendMode: 'multiply', opacity: 0.5, backgroundImage: 'repeating-linear-gradient(118deg, rgba(60,30,80,0.05) 0 2px, transparent 2px 46px)' }} />
      <NoiseOverlay opacity={0.04} />

      {/* Batida A */}
      <AbsoluteFill style={{ transform: `translateX(${pan}px)`, ...aStyle }}>
        <div style={{ position: 'absolute', top: 150, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ background: ED.void, borderRadius: 999, padding: '16px 42px', ...edIn(frame, Math.max(3, L(WORD.como)), { y: 16, trackFrom: 0, trackTo: 0 }), letterSpacing: undefined }}>
            <span style={{ display: 'inline-block', fontFamily: ED.sans, fontWeight: 800, fontSize: 42, color: '#FFFFFF', ...edIn(frame, Math.max(3, L(WORD.como)), { y: 0, blur: 0, trackFrom: -4, trackTo: -1 }) }}>
              COMO DEPUTADA FEDERAL
            </span>
          </div>
          <div style={{ marginTop: 18, fontFamily: ED.sans, fontWeight: 800, fontSize: 46, color: ED.brandCore, ...edIn(frame, L(WORD.pretende), { y: 12, trackFrom: -4, trackTo: -1 }) }}>
            pretende defender
          </div>
        </div>

        {/* MAIS QUALIFICAÇÃO PROFISSIONAL + capelo */}
        <div style={{ position: 'absolute', top: 440, left: 80, right: 60, display: 'flex', alignItems: 'center', gap: 34 }}>
          <IconBadge frame={frame} at={L(WORD.qualificacao)} name="diploma" />
          <div>
            <div style={{ fontFamily: ED.sans, fontWeight: 900, fontSize: 52, color: ED.void, ...edIn(frame, L(WORD.mais), { y: 12, trackFrom: -3, trackTo: -1 }) }}>MAIS</div>
            <div style={{ display: 'inline-block', marginTop: 6, background: ED.yellow, padding: '10px 22px 4px', opacity: qTape > 0 ? 1 : 0, clipPath: `inset(0 ${100 - qTape}% 0 0)`, transform: 'rotate(-2deg)', boxShadow: '0 10px 24px rgba(45,22,67,0.2)' }}>
              <span style={{ fontFamily: ED.sans, fontWeight: 900, fontSize: 78, lineHeight: 1, letterSpacing: -3, color: ED.void, whiteSpace: 'nowrap' }}>QUALIFICAÇÃO</span>
            </div>
            <div style={{ marginTop: 10, fontFamily: ED.sans, fontWeight: 900, fontSize: 60, color: ED.brandCore, ...edIn(frame, L(WORD.profissional), { y: 12, trackFrom: -4, trackTo: -2 }) }}>PROFISSIONAL</div>
          </div>
        </div>

        {/* INCLUSÃO DIGITAL + notebook */}
        <div style={{ position: 'absolute', top: 800, left: 70, right: 70, ...block(L(WORD.inclusao)) }}>
          <div style={{ background: ED.void, padding: '34px 40px', display: 'flex', alignItems: 'center', gap: 34, boxShadow: '0 30px 70px rgba(45,22,67,0.4)' }}>
            <IconBadge frame={frame} at={L(WORD.inclusao) + 4} name="laptop" size={140} />
            <div style={{ fontFamily: ED.sans, fontWeight: 900, fontSize: 80, lineHeight: 0.98, color: '#FFFFFF', letterSpacing: -3 }}>
              INCLUSÃO
              <div style={{ color: ED.yellow, ...edIn(frame, L(WORD.digital), { y: 10, blur: 10, trackFrom: -6, trackTo: -3 }) }}>DIGITAL</div>
            </div>
          </div>
        </div>
      </AbsoluteFill>

      {/* Batida B */}
      <AbsoluteFill style={{ transform: `translateX(${pan}px)` }}>
        <div style={{ position: 'absolute', top: 190, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
          <div style={{ background: ED.yellow, padding: '14px 36px 8px', opacity: polTape > 0 ? 1 : 0, clipPath: `inset(0 ${100 - polTape}% 0 0)`, transform: 'rotate(-2deg)', boxShadow: '0 10px 24px rgba(45,22,67,0.2)' }}>
            <span style={{ fontFamily: ED.sans, fontWeight: 900, fontSize: 96, lineHeight: 1, letterSpacing: -3, color: ED.void, whiteSpace: 'nowrap' }}>E POLÍTICAS</span>
          </div>
        </div>
        <div style={{ position: 'absolute', top: 370, left: 0, right: 0, textAlign: 'center', fontFamily: ED.sans, fontWeight: 800, fontSize: 54, color: ED.void }}>
          <span style={{ display: 'inline-block', marginRight: 16, ...edIn(frame, L(WORD.facilitem) - 3, { y: 12, trackFrom: -4, trackTo: -1 }) }}>que facilitem</span>
          <span style={{ display: 'inline-block', color: ED.brandCore, ...edIn(frame, L(WORD.acesso) - 3, { y: 12, trackFrom: -4, trackTo: -1 }) }}>o acesso ao</span>
        </div>
        <div style={{ position: 'absolute', top: 500, left: 70, right: 70, ...block(L(WORD.primeiro)) }}>
          <div style={{ background: ED.void, padding: '40px 44px', display: 'flex', alignItems: 'center', gap: 34, boxShadow: '0 40px 80px rgba(45,22,67,0.45)' }}>
            <IconBadge frame={frame} at={L(WORD.primeiro) + 2} name="briefcase" size={160} />
            <div style={{ fontFamily: ED.sans, fontWeight: 900, lineHeight: 0.95, whiteSpace: 'nowrap' }}>
              <div style={{ fontSize: 104, color: '#FFFFFF', ...edIn(frame, L(WORD.primeiro), { y: 10, blur: 10, trackFrom: -8, trackTo: -4 }) }}>PRIMEIRO</div>
              <div style={{ fontSize: 110, color: ED.yellow, ...edIn(frame, L(WORD.emprego), { y: 10, blur: 10, trackFrom: -8, trackTo: -4 }) }}>EMPREGO!</div>
            </div>
          </div>
        </div>
      </AbsoluteFill>

      <div style={{ position: 'absolute', top: -200, bottom: -200, left: -300, width: 1800, background: ED.void, transform: `translateX(${wipe}px) rotate(-4deg)`, boxShadow: '-40px 0 80px rgba(0,0,0,0.35)' }} />
      <AbsoluteFill style={{ backgroundColor: ED.yellow, opacity: flash }} />
    </AbsoluteFill>
  );
};
