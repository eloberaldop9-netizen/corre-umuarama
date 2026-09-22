import React from 'react';
import { AbsoluteFill, Easing, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ci, SPRING } from '../lib/motion';
import { NoiseOverlay, DustParticles, HalftoneOverlay } from '../lib/Background';
import { AssetImage } from '../lib/AssetImage';
import { COLOR_CAUSA } from '../lib/palette-causa';
import { FONT } from '../lib/palette';
import type { CausaAssets } from '../VideoAnaNovaisCausa';

// Cena 1 — A Causa | frames locais 0–225 (7.5s)
// Transcrição real (forced alignment real sobre narracao-causa.mp3):
// "Política"@44 "Nacional"@61 "de" "Proteção"@80 "e"@98 "Inclusão"@100 "das"
// "Pessoas" "com" "Transtorno"@131 "do" "Espectro"@149 "Autista!"@162 (fala termina ~180)
// Composição: manchete no topo, retrato emoldurado (estilo recorte de
// jornal) no centro, texto SEMPRE fora da foto (acima/abaixo, nunca por
// cima) — legibilidade em primeiro lugar.
export const Causa1_ACausa: React.FC<{ assets: CausaAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOp = ci(frame, [0, 18], [0, 1], Easing.inOut(Easing.quad));

  // Câmera — Dolly In sutil
  const dollyScale = ci(frame, [0, 225], [0.96, 1.03], Easing.out(Easing.cubic));

  // Retrato emoldurado
  const portraitOp = ci(frame, [0, 24], [0, 1]);
  const portraitBlur = ci(frame, [0, 24], [20, 0], Easing.out(Easing.cubic));
  const portraitScale = ci(frame, [0, 24], [1.1, 1], Easing.out(Easing.cubic));

  // Textos
  const politicaSp = spring({ frame, fps, config: SPRING.text, delay: 44 });
  const nacionalSp = spring({ frame, fps, config: SPRING.text, delay: 61 });
  const protecaoSp = spring({ frame, fps, config: SPRING.text, delay: 80 });
  const inclusaoSp = spring({ frame, fps, config: SPRING.text, delay: 100 });
  const eOp = ci(frame, [98, 112], [0, 1], Easing.out(Easing.cubic));

  // Símbolo do autismo — surge exatamente quando ela diz "Transtorno do Espectro..."
  const ribbonSp = spring({ frame, fps, config: { damping: 11, mass: 1, stiffness: 110 }, delay: 125 });
  const ribbonScale = ci(ribbonSp, [0, 1], [0.5, 1]);
  const ribbonOp = ci(frame, [125, 140], [0, 1]);

  const autistaSp = spring({ frame, fps, config: { damping: 10, mass: 1.2, stiffness: 80 }, delay: 162 });
  const autistaScale = ci(autistaSp, [0, 1], [1.6, 1]);
  const autistaBlur = ci(frame - 162, [0, 20], [10, 0]);
  const autistaOp = ci(frame, [162, 170], [0, 1]);
  const symbolGlow = 0.2 + Math.max(0, Math.sin(frame * 0.05)) * 0.4;

  // Saída (195–225) — dissolve + engole em Z
  const exitP = ci(frame, [195, 225], [0, 1], Easing.in(Easing.exp));
  const exitBlur = ci(frame, [195, 222], [0, 30], Easing.in(Easing.exp));
  const exitScale = ci(frame, [195, 225], [1, 1.12], Easing.in(Easing.exp));
  const exitOp = ci(frame, [198, 222], [1, 0]);

  return (
    <AbsoluteFill style={{ opacity: bgOp, backgroundColor: COLOR_CAUSA.void }}>
      <NoiseOverlay opacity={0.07} />
      <HalftoneOverlay opacity={0.02} dark />
      <DustParticles count={22} />

      <AbsoluteFill
        style={{
          transform: `scale(${dollyScale * exitScale})`,
          filter: `blur(${exitBlur}px)`,
          opacity: exitOp,
        }}
      >
        {/* "POLÍTICA NACIONAL" — manchete, topo, nunca sobre a foto */}
        <div style={{ position: 'absolute', top: 150, left: 0, right: 0, textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 18 }}>
            <span
              style={{
                display: 'inline-block',
                fontFamily: FONT.sans,
                fontWeight: 900,
                fontSize: 58,
                letterSpacing: -1,
                color: COLOR_CAUSA.textLight,
                transform: `translateY(${ci(politicaSp, [0, 1], [40, 0])}px)`,
                filter: `blur(${ci(frame - 44, [0, 16], [12, 0])}px)`,
                opacity: ci(frame, [44, 58], [0, 1]),
              }}
            >
              POLÍTICA
            </span>
            <span
              style={{
                display: 'inline-block',
                fontFamily: FONT.sans,
                fontWeight: 900,
                fontSize: 58,
                letterSpacing: -1,
                color: COLOR_CAUSA.textLight,
                transform: `translateY(${ci(nacionalSp, [0, 1], [40, 0])}px)`,
                filter: `blur(${ci(frame - 61, [0, 16], [12, 0])}px)`,
                opacity: ci(frame, [61, 75], [0, 1]),
              }}
            >
              NACIONAL
            </span>
          </div>
        </div>

        {/* Retrato — moldura estilo recorte de jornal (borda branca + sombra) */}
        <div
          style={{
            position: 'absolute',
            top: 300,
            left: '50%',
            width: 540,
            height: 756,
            marginLeft: -270,
            opacity: portraitOp,
            filter: `blur(${portraitBlur}px)`,
            transform: `scale(${portraitScale})`,
            transformOrigin: 'center center',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              border: '14px solid #FFFFFF',
              boxShadow: '0 30px 90px rgba(0,0,0,0.85)',
              overflow: 'hidden',
            }}
          >
            <AssetImage file={assets.retratoFrontal} label="RETRATO — ANA NOVAIS" style={{ width: '100%', height: '100%' }} />
          </div>
          {/* "carimbo" de jornal no canto — reforça a moldura editorial */}
          <div
            style={{
              position: 'absolute',
              bottom: -18,
              right: -18,
              width: 84,
              height: 84,
              borderRadius: '50%',
              border: `2px solid ${COLOR_CAUSA.gold}`,
              backgroundColor: 'rgba(10,10,12,0.85)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: 'rotate(-8deg)',
            }}
          >
            <span style={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: 12, letterSpacing: 1, color: COLOR_CAUSA.gold, textAlign: 'center', lineHeight: 1.2 }}>
              ANA
              <br />
              NOVAIS
            </span>
          </div>
        </div>

        {/* "PROTEÇÃO E INCLUSÃO" — abaixo da foto */}
        <div style={{ position: 'absolute', top: 1105, left: 0, right: 0, textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap', padding: '0 40px' }}>
            <span
              style={{
                display: 'inline-block',
                fontFamily: FONT.sans,
                fontWeight: 800,
                fontSize: 48,
                letterSpacing: -1,
                color: COLOR_CAUSA.tea,
                transform: `translateY(${ci(protecaoSp, [0, 1], [40, 0])}px)`,
                filter: `blur(${ci(frame - 80, [0, 16], [12, 0])}px)`,
                opacity: ci(frame, [80, 94], [0, 1]),
              }}
            >
              PROTEÇÃO
            </span>
            <span
              style={{
                display: 'inline-block',
                fontFamily: FONT.sans,
                fontWeight: 600,
                fontSize: 48,
                color: COLOR_CAUSA.textLight,
                opacity: eOp,
              }}
            >
              E
            </span>
            <span
              style={{
                display: 'inline-block',
                fontFamily: FONT.sans,
                fontWeight: 800,
                fontSize: 48,
                letterSpacing: -1,
                color: COLOR_CAUSA.tea,
                transform: `translateY(${ci(inclusaoSp, [0, 1], [40, 0])}px)`,
                filter: `blur(${ci(frame - 100, [0, 16], [12, 0])}px)`,
                opacity: ci(frame, [100, 114], [0, 1]),
              }}
            >
              INCLUSÃO
            </span>
          </div>
        </div>

        {/* Símbolo do autismo + "AUTISTA" — surge com "Transtorno do Espectro Autista" */}
        <div style={{ position: 'absolute', top: 1230, left: 0, right: 0, textAlign: 'center' }}>
          <div
            style={{
              width: 150,
              height: 210,
              margin: '0 auto',
              opacity: ribbonOp,
              transform: `scale(${ribbonScale})`,
              filter: `drop-shadow(0 0 ${16 + symbolGlow * 18}px rgba(107,47,160,0.55))`,
            }}
          >
            <AssetImage file={assets.simboloAutismo} label="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div
            style={{
              marginTop: 18,
              opacity: autistaOp,
              transform: `scale(${autistaScale})`,
              filter: `blur(${autistaBlur}px)`,
            }}
          >
            <span
              style={{
                fontFamily: FONT.sans,
                fontWeight: 900,
                fontSize: 96,
                letterSpacing: -2,
                color: COLOR_CAUSA.accent,
                textShadow: `0 0 ${10 + symbolGlow * 20}px rgba(107,47,160,0.45)`,
              }}
            >
              AUTISTA
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
