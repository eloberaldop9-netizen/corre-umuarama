import React from 'react';
import { AbsoluteFill, Easing, useCurrentFrame } from 'remotion';
import { ci } from '../lib/motion';
import { NoiseOverlay } from '../lib/Background';
import { AssetImage } from '../lib/AssetImage';
import { COLOR_CAUSA } from '../lib/palette-causa';
import { FONT } from '../lib/palette';
import type { CausaAssets } from '../VideoAnaNovaisCausa';

// Cena 3 — O Recurso (Impacto Tipográfico) | frames locais 0–130 (4.3s)
// A Cena 3 começa depois do card "apoio às famílias" da Cena 2 já ter tido
// tempo de leitura — por isso a entrada do texto usa timing local (não mais
// preso ao frame exato de "defender"/"mais"/"recursos" no áudio real, que
// cairia antes da cena nem existir). O fundo é a foto de moedas + seta
// ascendente (referência do usuário) — fica visível até o fim da cena e
// segue por baixo na Cena 4, pra nunca ficar tela preta na transição.
const AMARELO = '#F0C800';

export const Causa3_Recurso: React.FC<{ assets: CausaAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();

  const bgOp = ci(frame, [0, 18], [0, 1], Easing.out(Easing.quad));
  const bgScale = ci(frame, [0, 130], [1.08, 1.16], Easing.inOut(Easing.quad));

  // Saída — SUCÇÃO PARA O CENTRO (só o texto colapsa; o fundo continua)
  const collapse = (index: number) => {
    const start = 90 + index * 2;
    const p = ci(frame, [start, start + 22], [0, 1], Easing.in(Easing.exp));
    return {
      scale: interp(p, 1, 0),
      rotate: interp(p, 0, -15),
      blur: interp(p, 0, 30),
      opacity: interp(p, 1, 0),
    };
  };

  const defenderOp = ci(frame, [10, 24], [0, 1], Easing.out(Easing.cubic));
  const defenderBlur = ci(frame, [10, 28], [15, 0]);

  const maisOp = ci(frame, [22, 30], [0, 1]);
  const maisScale = ci(frame, [22, 38], [3, 1], Easing.out(Easing.cubic));
  const maisBlur = ci(frame, [22, 42], [20, 0], Easing.out(Easing.cubic));

  const recursosOp = ci(frame, [33, 41], [0, 1]);
  const recursosScale = ci(frame, [33, 49], [3, 1], Easing.out(Easing.cubic));
  const recursosBlur = ci(frame, [33, 53], [20, 0], Easing.out(Easing.cubic));

  const subtitleOp = ci(frame, [50, 64], [0, 1], Easing.out(Easing.cubic));
  const subtitleY = ci(frame, [50, 64], [40, 0], Easing.out(Easing.cubic));

  const c0 = collapse(0);
  const c1 = collapse(1);
  const c2 = collapse(2);
  const c3 = collapse(3);

  return (
    <AbsoluteFill style={{ opacity: bgOp, backgroundColor: COLOR_CAUSA.void }}>
      <AbsoluteFill style={{ transform: `scale(${bgScale})` }}>
        <AssetImage file={assets.moneyGraph} label="RECURSOS PARA TERAPIAS" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(10,10,12,0.55) 0%, rgba(10,10,12,0.78) 55%, rgba(10,10,12,0.55) 100%)' }} />
      <NoiseOverlay opacity={0.05} />

      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontFamily: FONT.sans,
              fontWeight: 400,
              fontSize: 44,
              letterSpacing: 4,
              color: COLOR_CAUSA.textLight,
              opacity: defenderOp * c0.opacity,
              filter: `blur(${defenderBlur + c0.blur}px)`,
              transform: `scale(${c0.scale}) rotate(${c0.rotate}deg)`,
              marginBottom: 6,
              textShadow: '0 4px 18px rgba(0,0,0,0.6)',
            }}
          >
            DEFENDER
          </div>

          <div
            style={{
              fontFamily: FONT.sans,
              fontWeight: 900,
              fontSize: 168,
              letterSpacing: -6,
              lineHeight: 0.98,
              color: AMARELO,
              opacity: maisOp * c1.opacity,
              filter: `blur(${maisBlur + c1.blur}px)`,
              transform: `scale(${maisScale * c1.scale}) rotate(${c1.rotate}deg)`,
              textShadow: '0 8px 30px rgba(0,0,0,0.7)',
            }}
          >
            MAIS
          </div>

          <div
            style={{
              fontFamily: FONT.sans,
              fontWeight: 900,
              fontSize: 168,
              letterSpacing: -6,
              lineHeight: 1.02,
              color: AMARELO,
              opacity: recursosOp * c2.opacity,
              filter: `blur(${recursosBlur + c2.blur}px)`,
              transform: `scale(${recursosScale * c2.scale}) rotate(${c2.rotate}deg)`,
              textShadow: '0 8px 30px rgba(0,0,0,0.7)',
            }}
          >
            RECURSOS
          </div>

          <div
            style={{
              fontFamily: FONT.sans,
              fontWeight: 700,
              fontSize: 40,
              letterSpacing: 0.5,
              color: COLOR_CAUSA.tea,
              marginTop: 22,
              opacity: subtitleOp * c3.opacity,
              transform: `translateY(${subtitleY}px) scale(${c3.scale}) rotate(${c3.rotate}deg)`,
              filter: `blur(${c3.blur}px)`,
              textShadow: '0 4px 18px rgba(0,0,0,0.6)',
            }}
          >
            PARA TERAPIAS
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const interp = (v: number, from: number, to: number) => from + (to - from) * v;
