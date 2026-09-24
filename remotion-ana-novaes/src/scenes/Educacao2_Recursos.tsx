import React from 'react';
import { AbsoluteFill, Easing, useCurrentFrame } from 'remotion';
import { ci } from '../lib/motion';
import { DustParticles, NoiseOverlay } from '../lib/Background';
import { ED, edIn } from '../lib/editorial';
import { LineIcon } from '../lib/LineIcon';
import { EDUCACAO_SCENES, WORD } from '../educacao-timing';

// Cena 2 — A Estrutura Federal | frames locais 0–355
// "Como deputada federal, pretende defender mais investimentos da União,
// fiscalização rigorosa dos recursos públicos, valorização dos professores e
// condições para o cumprimento do piso salarial do magistério."
// O wipe deixa a tela no Roxo Profundo com grid sutil; pan horizontal suave.
// COMO DEPUTADA FEDERAL / pretende defender no topo e quatro blocos grandes
// e centralizados que deslizam alternando esquerda/direita na palavra falada,
// cada um com ícone de linha que se desenha: moeda (investimentos da União),
// lupa (fiscalização), quadro (VALORIZAÇÃO DOS PROFESSORES — bloco amarelo de
// destaque) e holerite (piso salarial do magistério).
// Saída: SUCÇÃO suave para o centro, depois de "magistério" lido.
const S = EDUCACAO_SCENES.c2;
const L = (f: number) => f - S.from;
const EXIT = L(570); // "magistério." termina em 567

type Card = { icon: string; pre?: string; l1: string; l2: string; at: number; at1?: number; at2: number; hl?: boolean; s1: number; s2: number };
const CARDS: Card[] = [
  { icon: 'moeda', l1: 'MAIS INVESTIMENTOS', l2: 'DA UNIÃO', at: WORD.mais, at2: WORD.uniao, s1: 50, s2: 66 },
  { icon: 'lupa', l1: 'FISCALIZAÇÃO RIGOROSA', l2: 'DOS RECURSOS PÚBLICOS', at: WORD.fiscalizacao, at2: WORD.recursos2, s1: 46, s2: 44 },
  { icon: 'quadro', l1: 'VALORIZAÇÃO', l2: 'DOS PROFESSORES', at: WORD.valorizacao, at2: WORD.professores, hl: true, s1: 66, s2: 54 },
  { icon: 'holerite', pre: 'CONDIÇÕES PARA O CUMPRIMENTO DO', l1: 'PISO SALARIAL', l2: 'DO MAGISTÉRIO', at: WORD.condicoes, at1: WORD.piso, at2: WORD.magisterio, s1: 62, s2: 46 },
];

export const Educacao2_Recursos: React.FC = () => {
  const frame = useCurrentFrame();
  const pan = ci(frame, [0, S.duration], [18, -18], Easing.inOut(Easing.sin));
  const sp = ci(frame, [EXIT, S.duration], [0, 1], Easing.inOut(Easing.cubic));

  return (
    <AbsoluteFill style={{ backgroundColor: ED.void, overflow: 'hidden' }}>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 42%, rgba(122,75,148,0.45), transparent 70%)' }} />
      <AbsoluteFill
        style={{
          opacity: 0.16, transform: `translateX(${pan}px)`,
          backgroundImage: 'linear-gradient(rgba(176,132,193,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(176,132,193,0.6) 1px, transparent 1px)',
          backgroundSize: '90px 90px', maskImage: 'radial-gradient(ellipse at 50% 45%, black 25%, transparent 78%)', WebkitMaskImage: 'radial-gradient(ellipse at 50% 45%, black 25%, transparent 78%)',
        }}
      />
      <NoiseOverlay opacity={0.07} />
      <DustParticles count={22} />

      <AbsoluteFill style={{ transform: `translateX(${pan}px) scale(${1 - sp}) rotate(${-10 * sp}deg)`, filter: `blur(${30 * sp}px)` }}>
        <div style={{ position: 'absolute', top: 270, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontFamily: ED.sans, fontWeight: 900, fontSize: 60, color: '#FFFFFF', ...edIn(frame, 3, { y: 16, trackFrom: -5, trackTo: -2 }) }}>COMO DEPUTADA FEDERAL,</div>
          <div style={{ marginTop: 6, fontFamily: ED.sans, fontWeight: 800, fontSize: 52, color: ED.lilac, ...edIn(frame, L(WORD.pretende), { y: 12, trackFrom: -4, trackTo: -1 }) }}>pretende defender</div>
        </div>

        {CARDS.map((c, i) => {
          const at = L(c.at) - 2;
          const p = ci(frame, [at, at + 22], [0, 1], Easing.out(Easing.cubic));
          const dir = i % 2 ? 1 : -1;
          const fg = c.hl ? ED.void : '#FFFFFF';
          const accent = c.hl ? ED.brandCore : ED.yellow;
          return (
            <div key={c.icon} style={{ position: 'absolute', top: 470 + i * 236, left: 80, width: 920 }}>
              <div
                style={{
                  display: 'flex', alignItems: 'center', gap: 30, padding: '24px 34px', borderRadius: 28,
                  background: c.hl ? ED.yellow : 'rgba(58,18,84,0.94)', border: `2px solid ${ED.yellow}`, boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
                  opacity: p, filter: `blur(${12 * (1 - p)}px)`, transform: `translateX(${100 * dir * (1 - p)}px)`,
                }}
              >
                <div style={{ flex: 'none', width: 132, height: 132, borderRadius: '50%', background: c.hl ? ED.void : ED.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LineIcon name={c.icon} frame={frame} at={at + 4} size={82} color={c.hl ? ED.yellow : ED.void} stroke={1.9} />
                </div>
                <div style={{ fontFamily: ED.sans, fontWeight: 900, lineHeight: 1.02, whiteSpace: 'nowrap' }}>
                  {c.pre ? <div style={{ fontSize: 27, fontWeight: 800, color: ED.lilac, marginBottom: 6 }}>{c.pre}</div> : null}
                  <div style={{ fontSize: c.s1, color: fg, letterSpacing: -1.5, ...(c.at1 ? edIn(frame, L(c.at1) - 2, { y: 10, blur: 10, trackFrom: -5, trackTo: -1.5 }) : {}) }}>{c.l1}</div>
                  <div style={{ marginTop: 4, fontSize: c.s2, color: accent, ...edIn(frame, Math.max(at + 6, L(c.at2) - 2), { y: 10, blur: 10, trackFrom: -5, trackTo: -1.5 }) }}>{c.l2}</div>
                </div>
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
