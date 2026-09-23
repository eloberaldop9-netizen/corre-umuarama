import React from 'react';
import { AbsoluteFill, Easing, useCurrentFrame } from 'remotion';
import { ci } from '../lib/motion';
import { NoiseOverlay } from '../lib/Background';
import { ED, edIn } from '../lib/editorial';
import { IDOSOS_SCENES, WORD } from '../idosos-timing';

// Cena 6 — A Entrega | frames locais 0–170
// "oferecendo atendimento especializado, acompanhamento, convivência e
// apoio às famílias."
// A sucção explode em lilás claro com light leaks; Crane Up lento. As 4
// ofertas sobem como tiras editoriais (branco, sombra 40px, borda fina),
// uma por palavra falada, CENTRALIZADAS na composição (bloco no meio da
// tela, leve zigue-zague simétrico). Cada tira tem um ícone de linha no
// selo amarelo.
// Saída: DISSOLVE SUJO (blur 0→40, brilho → 0).
const S = IDOSOS_SCENES.c6;
const L = (f: number) => f - S.from;
const EXIT = 150;

const ICONS: Record<string, React.ReactNode> = {
  atendimento: <path d="M12 6v12M6 12h12" />, // cruz de saúde
  acompanhamento: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19c.8-3 3-4.5 5.5-4.5s4.7 1.5 5.5 4.5" />
      <path d="M16 11l2 2 3.5-3.5" />
    </>
  ),
  convivencia: (
    <>
      <circle cx="7" cy="8" r="2.6" />
      <circle cx="17" cy="8" r="2.6" />
      <path d="M2.5 18c.6-2.6 2.4-4 4.5-4s3.9 1.4 4.5 4M12.5 18c.6-2.6 2.4-4 4.5-4s3.9 1.4 4.5 4" />
    </>
  ),
  apoio: (
    <>
      <path d="M3 11l9-7 9 7" />
      <path d="M5 10v9h14v-9" />
      <path d="M12 17s-3-1.8-3-3.6a1.6 1.6 0 0 1 3-.8 1.6 1.6 0 0 1 3 .8c0 1.8-3 3.6-3 3.6z" />
    </>
  ),
};

const ITEMS = [
  { key: 'atendimento', label: 'ATENDIMENTO', sub: 'ESPECIALIZADO', at: WORD.atendimento },
  { key: 'acompanhamento', label: 'ACOMPANHAMENTO', sub: '', at: WORD.acompanhamento },
  { key: 'convivencia', label: 'CONVIVÊNCIA', sub: '', at: WORD.convivencia },
  { key: 'apoio', label: 'APOIO ÀS', sub: 'FAMÍLIAS', at: WORD.apoio },
];

export const Idosos6_Lista: React.FC = () => {
  const frame = useCurrentFrame();
  const light = ci(frame, [0, 14], [1, 0], Easing.out(Easing.cubic));
  const crane = ci(frame, [0, S.duration], [40, -30], Easing.inOut(Easing.cubic));
  const d = ci(frame, [EXIT, S.duration], [0, 1], Easing.in(Easing.cubic));
  const leak = Math.sin(frame * 0.02);

  return (
    <AbsoluteFill style={{ backgroundColor: '#EDE3F4', overflow: 'hidden' }}>
      <AbsoluteFill style={{ filter: `blur(${40 * d}px) brightness(${1 - d})` }}>
        <AbsoluteFill
          style={{
            opacity: 0.4, filter: 'blur(70px)',
            background: `radial-gradient(circle at ${8 + leak * 4}% 10%, rgba(255,150,60,1), transparent 30%),
              radial-gradient(circle at ${94 - leak * 4}% 75%, rgba(255,130,50,0.9), transparent 32%)`,
          }}
        />
        <NoiseOverlay opacity={0.035} />

        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column', transform: `translateY(${crane}px)` }}>
          <div style={{ fontFamily: ED.sans, fontWeight: 900, fontSize: 64, color: ED.brandCore, marginBottom: 36, ...edIn(frame, Math.max(3, L(WORD.oferecendo)), { trackFrom: -5, trackTo: 0 }) }}>
            OFERECENDO
          </div>
          {ITEMS.map((it, i) => {
            const at = Math.max(4, L(it.at)) - 2;
            const p = ci(frame, [at, at + 24], [0, 1], Easing.out(Easing.cubic));
            return (
              <div
                key={it.key}
                style={{
                  transform: `translateX(${(i % 2 ? 22 : -22)}px) translateY(${120 * (1 - p)}px)`, marginBottom: 28, width: 860, display: 'flex', alignItems: 'center', gap: 28,
                  background: '#FFFFFF', border: `2px solid rgba(45,22,67,0.12)`, padding: '28px 32px',
                  boxShadow: '0 20px 40px rgba(45,22,67,0.22)',
                  opacity: p, filter: `blur(${12 * (1 - p)}px)`,
                }}
              >
                <div style={{ flex: 'none', width: 96, height: 96, borderRadius: '50%', background: ED.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="58" height="58" viewBox="0 0 24 24" fill="none" stroke={ED.void} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {ICONS[it.key]}
                  </svg>
                </div>
                <div style={{ fontFamily: ED.sans, fontWeight: 900, fontSize: 60, lineHeight: 1.02, letterSpacing: -2, color: ED.void }}>
                  {it.label}
                  {it.sub ? <div style={{ fontSize: 40, fontWeight: 800, color: ED.brandCore, letterSpacing: -1 }}>{it.sub}</div> : null}
                </div>
              </div>
            );
          })}
        </AbsoluteFill>
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: ED.void, opacity: ci(d, [0.5, 1], [0, 1]) }} />
      <AbsoluteFill style={{ backgroundColor: '#FFFFFF', opacity: light }} />
    </AbsoluteFill>
  );
};
