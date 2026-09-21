import React from 'react';
import { AbsoluteFill, Easing, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ci, SPRING } from '../lib/motion';
import { VoidBackground } from '../lib/Background';
import { AssetImage } from '../lib/AssetImage';
import { COLOR, FONT } from '../lib/palette';
import type { AnaNovaesAssets } from '../VideoAnaNovaes';

// Cena 1 — A Manchete Histórica | frames locais 0–210 (7.0s)
// Transcrição real (forced alignment real, não estimativa):
// "Em"@0 "2020,"@13 "Ana"@42 "Novais"@47 "fez"@60 "história"@70
//                    "mais"@136 "votada"@146 "cidade."@159–177
// Composição centralizada — retrato e nome no centro do quadro.
export const Scene1_Manchete: React.FC<{ assets: AnaNovaesAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const dollyScale = ci(frame, [0, 210], [0.92, 1.02], Easing.out(Easing.cubic));

  const bgOp = ci(frame, [0, 20], [0, 1], Easing.inOut(Easing.quad));

  const portraitBrightness = ci(frame, [10, 42], [0, 1.05]);
  const portraitBlur = ci(frame, [10, 42], [16, 0], Easing.out(Easing.cubic));
  const portraitOp = ci(frame, [10, 34], [0, 1]);

  const anaSp = spring({ frame, fps, config: SPRING.text, delay: 42 });
  const anaY = ci(anaSp, [0, 1], [26, 0]);
  const anaBl = ci(frame - 42, [0, 14], [10, 0]);

  const novaisSp = spring({ frame, fps, config: SPRING.text, delay: 47 });
  const novaisY = ci(novaisSp, [0, 1], [26, 0]);
  const novaisBl = ci(frame - 47, [0, 14], [10, 0]);

  const fezSp = spring({ frame, fps, config: { damping: 14, mass: 0.85 }, delay: 60 });
  const fezScale = ci(fezSp, [0, 1], [1.15, 1]);
  const fezBl = ci(frame - 60, [0, 14], [10, 0]);

  const historiaSp = spring({ frame, fps, config: { damping: 13, mass: 0.95 }, delay: 70 });
  const historiaScale = ci(historiaSp, [0, 1], [1.25, 1]);
  const historiaBl = ci(frame - 70, [0, 16], [14, 0]);
  const historiaOp = ci(frame, [70, 84], [0, 1]);

  const historiaGlow = 0.15 + Math.max(0, Math.sin(frame * 0.04)) * 0.3;

  // "Em 2020," — abertura, sincronizada com as primeiras palavras reais
  const emOp = ci(frame, [0, 14], [0, 1], Easing.out(Easing.cubic));
  const em2020Op = ci(frame, [13, 27], [0, 1], Easing.out(Easing.cubic));

  // "mais votada" — legenda secundária, sincronizada (real: mais@136 votada@146)
  const maisOp = ci(frame, [136, 150], [0, 1], Easing.out(Easing.cubic));
  const maisY = ci(frame, [136, 150], [16, 0], Easing.out(Easing.cubic));
  const votadaOp = ci(frame, [146, 160], [0, 1], Easing.out(Easing.cubic));
  const votadaY = ci(frame, [146, 160], [16, 0], Easing.out(Easing.cubic));

  // ── Saída (178–210) — segura "votada" até "cidade." terminar (177), depois RASGA E ENGOLE ──
  const exitPortrait = ci(frame, [178, 202], [0, 1], Easing.in(Easing.exp));
  const portraitTX = exitPortrait * -1100;
  const portraitExitBlur = exitPortrait * 16;

  const exitAna = ci(frame, [181, 203], [0, 1], Easing.in(Easing.exp));
  const exitFez = ci(frame, [184, 205], [0, 1], Easing.in(Easing.exp));

  const exitHistoria = ci(frame, [188, 210], [0, 1], Easing.in(Easing.exp));
  const historiaExitScale = ci(exitHistoria, [0, 1], [1, 16]);
  const historiaExitOp = ci(exitHistoria, [0, 1], [1, 0]);
  const flashOp = ci(frame, [196, 210], [0, 0.85]);

  return (
    <AbsoluteFill style={{ opacity: bgOp }}>
      <VoidBackground />

      <AbsoluteFill
        style={{
          transform: `scale(${dollyScale})`,
          transformOrigin: '50% 50%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Em 2020, — abertura */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 10,
            marginBottom: 10,
            zIndex: 10,
            opacity: (1 - exitAna),
          }}
        >
          <span
            style={{
              fontFamily: FONT.sans,
              fontWeight: 600,
              fontSize: 34,
              letterSpacing: -1,
              color: COLOR.textLight,
              opacity: emOp,
            }}
          >
            EM
          </span>
          <span
            style={{
              fontFamily: FONT.sans,
              fontWeight: 700,
              fontSize: 34,
              letterSpacing: -1,
              color: COLOR.gold,
              opacity: em2020Op,
            }}
          >
            2020,
          </span>
        </div>

        {/* Nome */}
        <div
          style={{
            textAlign: 'center',
            zIndex: 10,
            marginBottom: 18,
            transform: `translateX(${exitAna * -1200}px) scale(${1 - exitAna * 0.06})`,
            filter: `blur(${exitAna * 18}px)`,
            opacity: 1 - exitAna,
          }}
        >
          <div
            style={{
              fontFamily: FONT.sans,
              fontWeight: 800,
              fontSize: 76,
              letterSpacing: -1,
              color: COLOR.textLight,
              lineHeight: 1.05,
              display: 'flex',
              justifyContent: 'center',
              gap: 16,
            }}
          >
            <span
              style={{
                display: 'inline-block',
                transform: `translateY(${anaY}px)`,
                filter: `blur(${anaBl}px)`,
                opacity: ci(frame, [42, 56], [0, 1]),
              }}
            >
              ANA
            </span>
            <span
              style={{
                display: 'inline-block',
                transform: `translateY(${novaisY}px)`,
                filter: `blur(${novaisBl}px)`,
                opacity: ci(frame, [47, 61], [0, 1]),
              }}
            >
              NOVAIS
            </span>
          </div>
        </div>

        {/* Retrato */}
        <div
          style={{
            position: 'relative',
            width: 620,
            height: 780,
            zIndex: 5,
            filter: `brightness(${portraitBrightness}) blur(${portraitBlur + portraitExitBlur}px)`,
            opacity: portraitOp * (1 - exitPortrait),
            transform: `translateX(${portraitTX}px)`,
            boxShadow: '0 20px 90px rgba(0,0,0,0.85)',
            borderRadius: 8,
            overflow: 'hidden',
          }}
        >
          <AssetImage
            file={assets.retratoAna}
            label="RETRATO — ANA NOVAIS"
            style={{ width: '100%', height: '100%' }}
          />
        </div>

        {/* FEZ + HISTÓRIA + mais votada */}
        <div style={{ textAlign: 'center', zIndex: 10, marginTop: 20 }}>
          <div
            style={{
              fontFamily: FONT.sans,
              fontWeight: 800,
              fontSize: 76,
              letterSpacing: -1,
              color: COLOR.textLight,
              transform: `scale(${fezScale}) translateX(${exitFez * -1200}px)`,
              filter: `blur(${fezBl + exitFez * 18}px)`,
              opacity: (1 - exitFez) * ci(frame, [60, 74], [0, 1]),
            }}
          >
            FEZ
          </div>
          <div
            style={{
              fontFamily: FONT.sans,
              fontWeight: 900,
              fontSize: 118,
              letterSpacing: -2,
              color: COLOR.accent,
              opacity: historiaOp * historiaExitOp,
              transform: `scale(${historiaScale})`,
              filter: `blur(${historiaBl}px)`,
              textShadow: `0 0 ${8 + historiaGlow * 22}px rgba(240,201,61,${historiaGlow})`,
            }}
          >
            HISTÓRIA
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 10,
              marginTop: 14,
              opacity: (1 - exitFez),
            }}
          >
            <span
              style={{
                fontFamily: FONT.sans,
                fontWeight: 600,
                fontSize: 32,
                letterSpacing: -1,
                color: COLOR.textLight,
                opacity: maisOp,
                transform: `translateY(${maisY}px)`,
              }}
            >
              mais
            </span>
            <span
              style={{
                fontFamily: FONT.sans,
                fontWeight: 700,
                fontSize: 32,
                letterSpacing: -1,
                color: COLOR.gold,
                opacity: votadaOp,
                transform: `translateY(${votadaY}px)`,
              }}
            >
              votada
            </span>
          </div>
        </div>
      </AbsoluteFill>

      {/* Flash roxo — transição ótica para a Cena 2 */}
      <AbsoluteFill
        style={{
          backgroundColor: COLOR.purple,
          opacity: flashOp,
          transform: `scale(${1 + (historiaExitScale - 1) * 0.015})`,
        }}
      />
    </AbsoluteFill>
  );
};
