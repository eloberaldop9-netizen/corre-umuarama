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
// "Política"@44 "Nacional"@61 "de" "Proteção"@80 "e"@98 "Inclusão"@100 das Pessoas
// com Transtorno do Espectro "Autista!"@162 (fala termina ~180)
const INFINITY_PATH =
  'M80,200 C80,100 160,40 240,40 C340,40 400,120 400,200 C400,120 460,40 560,40 C640,40 720,100 720,200 C720,300 640,360 560,360 C460,360 400,280 400,200 C400,280 340,360 240,360 C160,360 80,300 80,200 Z';

export const Causa1_ACausa: React.FC<{ assets: CausaAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOp = ci(frame, [0, 18], [0, 1], Easing.inOut(Easing.quad));

  // Câmera — Dolly In dramático (z -600 -> -200)
  const dollyZ = ci(frame, [0, 225], [-600, -200], Easing.out(Easing.cubic));
  const dollyScale = ci(dollyZ, [-600, -200], [0.72, 1]);

  // Símbolo TEA — surge no ar (fade + scale, sem stroke-dasharray:
  // esse binário headless_shell falha silenciosamente ao pintar paths com
  // stroke-dasharray, verificado empiricamente — ver histórico do commit)
  const symbolOp = ci(frame, [10, 55], [0, 1], Easing.out(Easing.sin));
  const symbolScale = ci(frame, [10, 65], [0.85, 1], Easing.out(Easing.cubic));
  const symbolGlow = 0.2 + Math.max(0, Math.sin(frame * 0.05)) * 0.4;

  // Retrato
  const portraitOp = ci(frame, [0, 24], [0, 1]);
  const portraitBlur = ci(frame, [0, 24], [20, 0], Easing.out(Easing.cubic));
  const portraitScale = ci(frame, [0, 24], [1.1, 1], Easing.out(Easing.cubic));
  const portraitMicro = 1 + Math.sin(frame * 0.03) * 0.01;

  // Textos
  const politicaSp = spring({ frame, fps, config: SPRING.text, delay: 44 });
  const nacionalSp = spring({ frame, fps, config: SPRING.text, delay: 61 });
  const protecaoSp = spring({ frame, fps, config: SPRING.text, delay: 80 });
  const inclusaoSp = spring({ frame, fps, config: SPRING.text, delay: 100 });
  const eOp = ci(frame, [98, 112], [0, 1], Easing.out(Easing.cubic));

  const autistaSp = spring({ frame, fps, config: { damping: 10, mass: 1.2, stiffness: 80 }, delay: 162 });
  const autistaScale = ci(autistaSp, [0, 1], [2, 1]);
  const autistaBlur = ci(frame - 162, [0, 20], [10, 0]);
  const autistaOp = ci(frame, [162, 170], [0, 1]);

  // Saída (195–225) — Z-DIVE + FLIP 3D "vira a mesa"
  const exitP = ci(frame, [195, 225], [0, 1], Easing.in(Easing.exp));
  const textExitZ = exitP * -1000;
  const textExitOp = ci(frame, [195, 218], [1, 0]);
  const portraitExitBlur = ci(frame, [198, 225], [0, 40], Easing.in(Easing.exp));
  const portraitExitScale = ci(frame, [198, 225], [1, 2], Easing.in(Easing.exp));
  const portraitExitOp = ci(frame, [198, 222], [1, 0]);
  const camRotateX = ci(frame, [195, 225], [0, 78], Easing.in(Easing.exp));
  const camZ = ci(frame, [195, 225], [-200, 500], Easing.in(Easing.exp));
  const camScale = 1 + camZ * 0.0006;

  return (
    <AbsoluteFill style={{ opacity: bgOp, backgroundColor: COLOR_CAUSA.void }}>
      <NoiseOverlay opacity={0.07} />
      <HalftoneOverlay opacity={0.02} dark />
      <DustParticles count={22} />

      <AbsoluteFill
        style={{
          transform: `perspective(1400px) rotateX(${camRotateX}deg) scale(${dollyScale * camScale})`,
          transformOrigin: '50% 60%',
        }}
      >
        {/* Símbolo TEA — infinito, atrás dela */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 820,
            height: 410,
            marginLeft: -410,
            marginTop: -205,
            opacity: symbolOp * (0.7 + symbolGlow * 0.3) * (1 - exitP),
            transform: `scale(${symbolScale}) translateZ(${textExitZ * 0.6}px)`,
            filter: `drop-shadow(0 0 ${22 + symbolGlow * 26}px rgba(52,131,250,0.7)) drop-shadow(0 0 36px rgba(201,169,98,0.35))`,
          }}
        >
          <svg width={820} height={410} viewBox="0 0 800 400">
            <defs>
              <linearGradient id="teaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={COLOR_CAUSA.tea} />
                <stop offset="100%" stopColor={COLOR_CAUSA.gold} />
              </linearGradient>
            </defs>
            {/* strokeWidth alto de propósito: um traço fino (~7px) some no
                still/render deste projeto — Config.setVideoImageFormat('jpeg')
                comprime traços finos e semi-transparentes até desaparecerem
                (verificado empiricamente). 30px sobrevive à compressão. */}
            <path d={INFINITY_PATH} fill="none" stroke="url(#teaGradient)" strokeWidth={30} strokeLinecap="round" />
          </svg>
        </div>

        {/* "POLÍTICA NACIONAL" — atrás dela, z negativo */}
        <div
          style={{
            position: 'absolute',
            top: 330,
            left: 0,
            right: 0,
            textAlign: 'center',
            opacity: (1 - exitP) * textExitOp,
            transform: `translateZ(${-120 + textExitZ}px)`,
            filter: 'blur(1px)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20 }}>
            <span
              style={{
                display: 'inline-block',
                fontFamily: FONT.sans,
                fontWeight: 900,
                fontSize: 60,
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
                fontSize: 60,
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

        {/* Retrato — Ana, centralizado */}
        <div
          style={{
            position: 'relative',
            width: 660,
            height: 840,
            margin: '0 auto',
            marginTop: 420,
            zIndex: 10,
            opacity: portraitOp * portraitExitOp,
            filter: `blur(${portraitBlur + portraitExitBlur}px)`,
            transform: `scale(${portraitScale * portraitMicro * portraitExitScale})`,
            transformOrigin: 'center center',
            boxShadow: '0 30px 110px rgba(0,0,0,0.85)',
            borderRadius: 8,
            overflow: 'hidden',
          }}
        >
          <AssetImage file={assets.retratoFrontal} label="RETRATO — ANA NOVAIS" style={{ width: '100%', height: '100%' }} />
        </div>

        {/* "PROTEÇÃO E INCLUSÃO" — na frente dela */}
        <div
          style={{
            position: 'absolute',
            top: 1130,
            left: 0,
            right: 0,
            textAlign: 'center',
            zIndex: 20,
            opacity: (1 - exitP) * textExitOp,
            transform: `translateZ(${80 + textExitZ}px)`,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap', padding: '0 40px' }}>
            <span
              style={{
                display: 'inline-block',
                fontFamily: FONT.sans,
                fontWeight: 800,
                fontSize: 52,
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
                fontSize: 52,
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
                fontSize: 52,
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

        {/* "AUTISTA" — hero, carimbo */}
        <div
          style={{
            position: 'absolute',
            top: 1230,
            left: 0,
            right: 0,
            textAlign: 'center',
            zIndex: 30,
            opacity: autistaOp * (1 - exitP) * textExitOp,
            transform: `scale(${autistaScale}) translateZ(${120 + textExitZ}px)`,
            filter: `blur(${autistaBlur}px)`,
          }}
        >
          <span
            style={{
              fontFamily: FONT.sans,
              fontWeight: 900,
              fontSize: 108,
              letterSpacing: -2,
              color: COLOR_CAUSA.accent,
              textShadow: `0 0 ${10 + symbolGlow * 20}px rgba(217,45,32,0.4)`,
            }}
          >
            AUTISTA
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
