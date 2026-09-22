import React from 'react';
import { AbsoluteFill, Easing, useCurrentFrame } from 'remotion';
import { ci } from '../lib/motion';
import { NoiseOverlay } from '../lib/Background';
import { AssetImage } from '../lib/AssetImage';
import { COLOR_CAUSA } from '../lib/palette-causa';
import { FONT } from '../lib/palette';
import { lf, PROTECAO_SCENES } from '../protecao-timing';
import type { ProtecaoAssets } from '../VideoAnaNovaisProtecao';

// Cena 3 — As Leis (Impacto Tipográfico) | frames locais 0–160
// "Também quer trabalhar pelo fortalecimento das leis, dos canais de denúncia"
// Mesma cena do "MAIS RECURSOS" do vídeo aprovado: foto escura ao fundo
// (prédio da Câmara — onde as leis nascem), kicker branco, hero amarelo
// gigante e complemento lilás. Saída: sucção pro centro, fundo continua.
const S = PROTECAO_SCENES.c3;
const W = (i: number) => lf(i, S);

export const Protecao3_Leis: React.FC<{ assets: ProtecaoAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();

  const bgOp = ci(frame, [0, 18], [0, 1], Easing.out(Easing.quad));
  const bgScale = ci(frame, [0, S.duration], [1.08, 1.16], Easing.inOut(Easing.quad));

  const collapse = (index: number) => {
    const start = 136 + index * 2;
    const p = ci(frame, [start, start + 22], [0, 1], Easing.in(Easing.exp));
    return { scale: 1 - p, rotate: -15 * p, blur: 30 * p, opacity: 1 - p };
  };
  const c0 = collapse(0);
  const c1 = collapse(1);
  const c2 = collapse(2);

  const kAt = W(35);
  const kickerOp = ci(frame, [kAt, kAt + 14], [0, 1], Easing.out(Easing.cubic));
  const kickerBlur = ci(frame, [kAt, kAt + 18], [15, 0]);

  const lAt = W(37);
  const leisOp = ci(frame, [lAt, lAt + 8], [0, 1]);
  const leisScale = ci(frame, [lAt, lAt + 16], [3, 1], Easing.out(Easing.cubic));
  const leisBlur = ci(frame, [lAt, lAt + 20], [20, 0], Easing.out(Easing.cubic));

  const sub = (i: number) => {
    const at = W(i);
    return {
      display: 'inline-block' as const,
      opacity: ci(frame, [at, at + 12], [0, 1], Easing.out(Easing.cubic)),
      transform: `translateY(${ci(frame, [at, at + 14], [30, 0], Easing.out(Easing.cubic))}px)`,
    };
  };

  return (
    <AbsoluteFill style={{ opacity: bgOp, backgroundColor: COLOR_CAUSA.void }}>
      <AbsoluteFill style={{ transform: `scale(${bgScale})` }}>
        <AssetImage file={assets.fundoCamara} label="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(0.6)' }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(10,10,12,0.6) 0%, rgba(10,10,12,0.82) 55%, rgba(10,10,12,0.6) 100%)' }} />
      <NoiseOverlay opacity={0.05} />

      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontFamily: FONT.sans, fontWeight: 400, fontSize: 44, letterSpacing: -1, color: COLOR_CAUSA.textLight,
              opacity: kickerOp * c0.opacity, filter: `blur(${kickerBlur + c0.blur}px)`,
              transform: `scale(${c0.scale}) rotate(${c0.rotate}deg)`, marginBottom: 6, textShadow: '0 4px 18px rgba(0,0,0,0.6)',
            }}
          >
            FORTALECIMENTO DAS
          </div>
          <div
            style={{
              fontFamily: FONT.sans, fontWeight: 900, fontSize: 250, letterSpacing: -8, lineHeight: 1, color: COLOR_CAUSA.gold,
              opacity: leisOp * c1.opacity, filter: `blur(${leisBlur + c1.blur}px)`,
              transform: `scale(${leisScale * c1.scale}) rotate(${c1.rotate}deg)`, textShadow: '0 8px 30px rgba(0,0,0,0.7)',
            }}
          >
            LEIS
          </div>
          <div
            style={{
              display: 'flex', gap: 12, justifyContent: 'center', marginTop: 22,
              fontFamily: FONT.sans, fontWeight: 700, fontSize: 44, letterSpacing: -1, color: COLOR_CAUSA.tea,
              opacity: c2.opacity, transform: `scale(${c2.scale}) rotate(${c2.rotate}deg)`, filter: `blur(${c2.blur}px)`,
              textShadow: '0 4px 18px rgba(0,0,0,0.6)',
            }}
          >
            <span style={sub(39)}>CANAIS</span>
            <span style={sub(40)}>DE</span>
            <span style={sub(41)}>DENÚNCIA</span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
