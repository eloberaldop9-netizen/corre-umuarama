import React from 'react';
import { AbsoluteFill, Easing, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ci, SPRING } from '../lib/motion';
import { VoidBackground } from '../lib/Background';
import { AssetImage } from '../lib/AssetImage';
import { COLOR, FONT } from '../lib/palette';
import type { AnaNovaesAssets } from '../VideoAnaNovaes';

// Cena 1 — A Manchete Histórica | frames locais 0–192 (6.4s)
// Transcrição real: "Em"@7 "2020,"@22 "Ana"@46 "Novais"@54 "fez"@63 "história"@71
//                    "mais"@138 "votada"@147
// Composição centralizada — retrato e nome no centro do quadro.
export const Scene1_Manchete: React.FC<{ assets: AnaNovaesAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const dollyScale = ci(frame, [0, 192], [0.92, 1.02], Easing.out(Easing.cubic));

  const bgOp = ci(frame, [0, 20], [0, 1], Easing.inOut(Easing.quad));

  const portraitBrightness = ci(frame, [10, 42], [0, 1.05]);
  const portraitBlur = ci(frame, [10, 42], [16, 0], Easing.out(Easing.cubic));
  const portraitOp = ci(frame, [10, 34], [0, 1]);

  const anaSp = spring({ frame, fps, config: SPRING.text, delay: 46 });
  const anaY = ci(anaSp, [0, 1], [26, 0]);
  const anaBl = ci(frame - 46, [0, 14], [10, 0]);

  const novaisSp = spring({ frame, fps, config: SPRING.text, delay: 54 });
  const novaisY = ci(novaisSp, [0, 1], [26, 0]);
  const novaisBl = ci(frame - 54, [0, 14], [10, 0]);

  const fezSp = spring({ frame, fps, config: { damping: 14, mass: 0.85 }, delay: 63 });
  const fezScale = ci(fezSp, [0, 1], [1.15, 1]);
  const fezBl = ci(frame - 63, [0, 14], [10, 0]);

  const historiaSp = spring({ frame, fps, config: { damping: 13, mass: 0.95 }, delay: 71 });
  const historiaScale = ci(historiaSp, [0, 1], [1.25, 1]);
  const historiaBl = ci(frame - 71, [0, 16], [14, 0]);
  const historiaOp = ci(frame, [71, 85], [0, 1]);

  const historiaGlow = 0.15 + Math.max(0, Math.sin(frame * 0.04)) * 0.3;

  // "Em 2020," — abertura, sincronizada com as primeiras palavras reais
  const emOp = ci(frame, [7, 21], [0, 1], Easing.out(Easing.cubic));
  const em2020Op = ci(frame, [22, 36], [0, 1], Easing.out(Easing.cubic));

  // "mais votada" — legenda secundária, sincronizada
  const maisOp = ci(frame, [138, 152], [0, 1], Easing.out(Easing.cubic));
  const maisY = ci(frame, [138, 152], [16, 0], Easing.out(Easing.cubic));
  const votadaOp = ci(frame, [147, 161], [0, 1], Easing.out(Easing.cubic));
  const votadaY = ci(frame, [147, 161], [16, 0], Easing.out(Easing.cubic));

  // ── Saída (165–192) — RASGA E ENGOLE ────────────────────
  const exitPortrait = ci(frame, [165, 187], [0, 1], Easing.in(Easing.exp));
  const portraitTX = exitPortrait * -1100;
  const portraitExitBlur = exitPortrait * 16;

  const exitAna = ci(frame, [168, 188], [0, 1], Easing.in(Easing.exp));
  const exitFez = ci(frame, [171, 190], [0, 1], Easing.in(Easing.exp));

  const exitHistoria = ci(frame, [175, 192], [0, 1], Easing.in(Easing.exp));
  const historiaExitScale = ci(exitHistoria, [0, 1], [1, 16]);
  const historiaExitOp = ci(exitHistoria, [0, 1], [1, 0]);
  const flashOp = ci(frame, [180, 192], [0, 0.85]);

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
                opacity: ci(frame, [46, 60], [0, 1]),
              }}
            >
              ANA
            </span>
            <span
              style={{
                display: 'inline-block',
                transform: `translateY(${novaisY}px)`,
                filter: `blur(${novaisBl}px)`,
                opacity: ci(frame, [54, 68], [0, 1]),
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
              opacity: (1 - exitFez) * ci(frame, [63, 77], [0, 1]),
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
