import React from 'react';
import { AbsoluteFill, Easing, useCurrentFrame } from 'remotion';
import { ci } from '../lib/motion';
import { ED, edIn } from '../lib/editorial';
import { LineIcon } from '../lib/LineIcon';
import { FEMININO_SCENES, WORD } from '../feminino-timing';
import { FemininoPurpleBg } from './Feminino2_Deputada';

// Cena 3 — A Infraestrutura | frames locais 0–201
// "com capacitação gratuita em gestão, marketing e vendas, incentivo à
// formalização e orientação jurídica e contábil!"
// Mesmo Roxo Profundo da cena 2 (o fundo entra em fade, sem corte). A tela
// vira um quadro de soluções: quatro cards grandes e centralizados, cada um
// com ícone de linha que se desenha no selo amarelo, entrando na palavra
// falada — gestão (gráfico), marketing e vendas (megafone), formalização
// (documento aprovado), jurídica e contábil (balança). Pan horizontal sutil.
// Saída: WIPE EDITORIAL off-white suave, que já é o papel da cena 4.
const S = FEMININO_SCENES.c3;
const L = (f: number) => f - S.from;
const EXIT = L(492); // "contábil!" termina em 488

const CARDS = [
  { icon: 'grafico', l1: 'CAPACITAÇÃO GRATUITA', l2: 'EM GESTÃO', at: WORD.capacitacao, at2: WORD.gestao, big1: false },
  { icon: 'megafone', l1: 'MARKETING', l2: 'E VENDAS', at: WORD.marketing, at2: WORD.vendas, big1: true },
  { icon: 'documento', l1: 'INCENTIVO À', l2: 'FORMALIZAÇÃO', at: WORD.incentivo, at2: WORD.formalizacao, big1: false },
  { icon: 'balanca', l1: 'ORIENTAÇÃO', l2: 'JURÍDICA E CONTÁBIL', at: WORD.orientacao, at2: WORD.juridica, big1: false },
];

export const Feminino3_Infra: React.FC = () => {
  const frame = useCurrentFrame();
  const bgIn = ci(frame, [8, 22], [0, 1]); // deixa a saída da cena 2 terminar por baixo
  const pan = ci(frame, [0, S.duration], [16, -16], Easing.inOut(Easing.sin));
  const wipe = ci(frame, [EXIT, S.duration], [2000, 0], Easing.inOut(Easing.cubic));

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <AbsoluteFill style={{ opacity: bgIn }}>
        <FemininoPurpleBg shift={pan} />
      </AbsoluteFill>

      <AbsoluteFill style={{ transform: `translateX(${pan}px)` }}>
        {CARDS.map((c, i) => {
          const at = Math.max(8, L(c.at) - 2);
          const p = ci(frame, [at, at + 22], [0, 1], Easing.out(Easing.cubic));
          return (
            <div key={c.icon} style={{ position: 'absolute', top: 430 + i * 232, left: 80, width: 920 }}>
              <div
                style={{
                  display: 'flex', alignItems: 'center', gap: 32, padding: '26px 36px', borderRadius: 30,
                  background: 'rgba(58,18,84,0.94)', border: `2px solid ${ED.yellow}`, boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
                  opacity: p, filter: `blur(${14 * (1 - p)}px)`, transform: `translateY(${60 * (1 - p)}px) translateX(${(i % 2 ? 14 : -14)}px)`,
                }}
              >
                <div style={{ flex: 'none', width: 136, height: 136, borderRadius: '50%', background: ED.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LineIcon name={c.icon} frame={frame} at={at + 4} size={84} color={ED.void} stroke={1.9} />
                </div>
                <div style={{ fontFamily: ED.sans, fontWeight: 900, lineHeight: 1.02, whiteSpace: 'nowrap' }}>
                  <div style={{ fontSize: c.big1 ? 64 : 44, color: '#FFFFFF', letterSpacing: -1 }}>{c.l1}</div>
                  <div style={{ marginTop: 6, fontSize: c.l2.length > 14 ? 50 : 64, color: ED.yellow, ...edIn(frame, Math.max(at + 6, L(c.at2) - 2), { y: 12, blur: 10, trackFrom: -5, trackTo: -2 }) }}>{c.l2}</div>
                </div>
              </div>
            </div>
          );
        })}
      </AbsoluteFill>

      <div style={{ position: 'absolute', top: -200, bottom: -200, left: -300, width: 1800, background: ED.paper, transform: `translateX(${wipe}px) rotate(-4deg)`, boxShadow: '-40px 0 80px rgba(0,0,0,0.35)' }} />
    </AbsoluteFill>
  );
};
