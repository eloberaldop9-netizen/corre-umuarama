import React from 'react';
import { AbsoluteFill, Easing, useCurrentFrame } from 'remotion';
import { ci } from '../lib/motion';
import { NoiseOverlay, DustParticles } from '../lib/Background';
import { AssetImage } from '../lib/AssetImage';
import { COLOR_CAUSA } from '../lib/palette-causa';
import { FONT } from '../lib/palette';
import { lf, PROTECAO_SCENES } from '../protecao-timing';
import type { ProtecaoAssets } from '../VideoAnaNovaisProtecao';

// Cena 4 — A Rede Integrada | frames locais 0–270
// "e da atuação integrada entre Conselho Tutelar, saúde, assistência social,
// segurança e Justiça."
// Mesmo fechamento do vídeo aprovado "A Causa": kicker amarelo + pílulas
// empilhadas, uma por instituição, no frame exato em que é falada. O fundo
// da Cena 3 continua por baixo (sem corte seco pra preto) e o vídeo termina
// num fade.
const S = PROTECAO_SCENES.c4;
const W = (i: number) => lf(i, S);

export const Protecao4_Rede: React.FC<{ assets: ProtecaoAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();

  const bgOp = ci(frame, [0, 24], [0, 1], Easing.out(Easing.quad));
  const microZoom = ci(frame, [0, S.duration], [1.16, 1.28], Easing.inOut(Easing.quad));

  const finalFade = ci(frame, [S.duration - 25, S.duration], [1, 0]);

  const kAt = W(44);
  const kickerOp = ci(frame, [kAt, kAt + 16], [0, 1], Easing.out(Easing.cubic));
  const kickerY = ci(frame, [kAt, kAt + 16], [16, 0], Easing.out(Easing.cubic));

  const lineScale = ci(frame, [W(45), W(45) + 16], [0, 1], Easing.inOut(Easing.cubic));

  const pill = (label: string, delay: number) => {
    const op = ci(frame, [delay, delay + 18], [0, 1], Easing.out(Easing.cubic));
    const scale = ci(frame, [delay, delay + 18], [0.8, 1], Easing.out(Easing.cubic));
    const blur = ci(frame, [delay, delay + 14], [10, 0], Easing.out(Easing.cubic));
    return (
      <div
        style={{
          opacity: op,
          transform: `scale(${scale})`,
          filter: `blur(${blur}px)`,
          border: `2px solid ${COLOR_CAUSA.gold}`,
          borderRadius: 999,
          padding: '16px 38px',
          backgroundColor: 'rgba(10,10,12,0.55)',
          boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
        }}
      >
        <span style={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: 40, letterSpacing: -1, color: COLOR_CAUSA.textLight }}>
          {label}
        </span>
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ opacity: bgOp * finalFade, backgroundColor: COLOR_CAUSA.cinematic }}>
      {/* Fundo — continuação da foto da Câmara da Cena 3, agora mais escura/desfocada,
          pra nunca haver corte seco pra tela preta entre as cenas. */}
      <AbsoluteFill style={{ transform: `scale(${microZoom})`, filter: 'blur(3px)' }}>
        <AssetImage file={assets.fundoCamara} label="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(0.6)' }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 45%, rgba(10,10,12,0.72) 0%, rgba(10,10,12,0.94) 70%)' }} />
      <NoiseOverlay opacity={0.05} />
      <DustParticles count={22} />

      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div
          style={{
            opacity: kickerOp,
            transform: `translateY(${kickerY}px)`,
            marginBottom: 26,
            textAlign: 'center',
          }}
        >
          <span style={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: 34, letterSpacing: -1, color: COLOR_CAUSA.gold }}>
            ATUAÇÃO INTEGRADA
          </span>
          <div
            style={{
              width: 120,
              height: 2,
              backgroundColor: COLOR_CAUSA.gold,
              margin: '14px auto 0',
              transform: `scaleX(${lineScale})`,
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center' }}>
          {pill('CONSELHO TUTELAR', W(47))}
          {pill('SAÚDE', W(49))}
          {pill('ASSISTÊNCIA SOCIAL', W(50))}
          {pill('SEGURANÇA', W(52))}
          {pill('JUSTIÇA', W(54))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
