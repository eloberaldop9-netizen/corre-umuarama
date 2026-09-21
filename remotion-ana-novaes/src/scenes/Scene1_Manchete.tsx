import React from 'react';
import { AbsoluteFill, Easing, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ci, SPRING } from '../lib/motion';
import { VoidBackground } from '../lib/Background';
import { AssetImage } from '../lib/AssetImage';
import { COLOR, FONT } from '../lib/palette';
import type { AnaNovaesAssets } from '../VideoAnaNovaes';

// Cena 1 — A Manchete Histórica | frames locais 0–180 (6.0s)
// Câmera: Dolly In Dramático — z: -600 → -200 em [0,180], Easing.out(cubic)
export const Scene1_Manchete: React.FC<{ assets: AnaNovaesAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Dolly-in simulado: perspectiva aproxima o quadro suavemente ao longo de toda a cena.
  const dollyScale = ci(frame, [0, 180], [0.86, 1.04], Easing.out(Easing.cubic));

  // ── Entradas (frames 0–60) ──────────────────────────────────────────
  const bgOp = ci(frame, [0, 20], [0, 1], Easing.inOut(Easing.quad));

  const portraitBrightness = ci(frame, [5, 40], [0, 1.1]);
  const portraitBlur = ci(frame, [5, 40], [20, 0], Easing.out(Easing.cubic));
  const portraitOp = ci(frame, [5, 30], [0, 1]);

  const anaSp = spring({ frame, fps, config: SPRING.text, delay: 15 });
  const anaY = ci(anaSp, [0, 1], [50, 0]);
  const anaBl = ci(frame - 15, [0, 15], [10, 0]);

  const novaesSp = spring({ frame, fps, config: SPRING.text, delay: 19 });
  const novaesY = ci(novaesSp, [0, 1], [50, 0]);
  const novaesBl = ci(frame - 19, [0, 15], [10, 0]);

  const fezSp = spring({ frame, fps, config: { damping: 12, mass: 0.9 }, delay: 35 });
  const fezScale = ci(fezSp, [0, 1], [1.5, 1]);
  const fezBl = ci(frame - 35, [0, 15], [15, 0]);

  const historiaSp = spring({ frame, fps, config: { damping: 12, mass: 1.0 }, delay: 39 });
  const historiaScale = ci(historiaSp, [0, 1], [2.0, 1]);
  const historiaBl = ci(frame - 39, [0, 20], [20, 0]);
  const historiaOp = ci(frame, [39, 55], [0, 1]);

  // ── Hold — micro-animações (60–150) ─────────────────────────────────
  const historiaGlow = 0.2 + Math.max(0, Math.sin(frame * 0.05)) * 0.4;

  // ── Saída (155–180) — RASGA E ENGOLE ────────────────────────────────
  const exitPortrait = ci(frame, [155, 175], [0, 1], Easing.in(Easing.exp));
  const portraitSkew = interpolateSafe(exitPortrait, -15);
  const portraitTX = interpolateSafe(exitPortrait, -1200);
  const portraitExitBlur = interpolateSafe(exitPortrait, 20);

  const exitAna = ci(frame, [158, 178], [0, 1], Easing.in(Easing.exp));
  const exitFez = ci(frame, [161, 181], [0, 1], Easing.in(Easing.exp));

  const exitHistoria = ci(frame, [165, 180], [0, 1], Easing.in(Easing.exp));
  const historiaExitScale = ci(exitHistoria, [0, 1], [1, 30]);
  const historiaExitOp = ci(exitHistoria, [0, 1], [1, 0]);
  // Flash vermelho: enquanto HISTÓRIA devora a tela, um véu accent cobre tudo.
  const flashOp = ci(frame, [168, 180], [0, 0.9]);

  return (
    <AbsoluteFill style={{ opacity: bgOp }}>
      <VoidBackground />

      <AbsoluteFill style={{ transform: `scale(${dollyScale})`, transformOrigin: '50% 40%' }}>
        {/* Camada de trás: ANA NOVAES em serifa, cortada pelo retrato */}
        <div
          style={{
            position: 'absolute',
            top: '30%',
            left: 0,
            right: 0,
            textAlign: 'center',
            fontFamily: FONT.serif,
            fontWeight: 400,
            fontSize: 110,
            letterSpacing: -2,
            color: COLOR.textLight,
            zIndex: 1,
            transform: `translateY(${anaY + novaesY}px) translateX(${exitAna * -1300}px) scale(${1 - exitAna * 0.08})`,
            filter: `blur(${anaBl + novaesBl + exitAna * 20}px)`,
            opacity: (1 - exitAna) ** 0.6,
          }}
        >
          ANA NOVAES
        </div>

        {/* Retrato — camada intermediária */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            width: 760,
            height: 1350,
            marginLeft: -380,
            zIndex: 5,
            filter: `brightness(${portraitBrightness}) blur(${portraitBlur + portraitExitBlur}px)`,
            opacity: portraitOp * (1 - exitPortrait),
            transform: `skewX(${portraitSkew}deg) translateX(${portraitTX}px)`,
            boxShadow: '0 20px 100px rgba(0,0,0,0.9)',
          }}
        >
          <AssetImage
            file={assets.retratoAna}
            label="RETRATO — ANA NOVAES (PNG recortado, fundo transparente)"
            style={{ width: '100%', height: '100%', borderRadius: 12 }}
          />
        </div>

        {/* Camada da frente: FEZ + HISTÓRIA */}
        <div
          style={{
            position: 'absolute',
            bottom: '18%',
            left: 0,
            right: 0,
            textAlign: 'center',
            zIndex: 10,
          }}
        >
          <div
            style={{
              fontFamily: FONT.sans,
              fontWeight: 900,
              fontSize: 90,
              letterSpacing: -4,
              color: COLOR.textLight,
              transform: `scale(${fezScale}) translateX(${exitFez * -1300}px)`,
              filter: `blur(${fezBl + exitFez * 20}px)`,
              opacity: (1 - exitFez) ** 0.6,
            }}
          >
            FEZ
          </div>
          <div
            style={{
              fontFamily: FONT.sans,
              fontWeight: 900,
              fontSize: 140,
              letterSpacing: -6,
              color: COLOR.accent,
              opacity: historiaOp * historiaExitOp,
              transform: `scale(${historiaScale * (0.94 + 0.06 / Math.max(historiaExitScale, 1))})`,
              filter: `blur(${historiaBl}px)`,
              textShadow: `0 0 ${10 + historiaGlow * 30}px rgba(217,45,32,${historiaGlow})`,
            }}
          >
            HISTÓRIA
          </div>
        </div>
      </AbsoluteFill>

      {/* Flash vermelho que devora a tela — transição ótica para a Cena 2 */}
      <AbsoluteFill
        style={{
          backgroundColor: COLOR.accent,
          opacity: flashOp,
          transform: `scale(${1 + (historiaExitScale - 1) * 0.02})`,
        }}
      />
    </AbsoluteFill>
  );
};

function interpolateSafe(p: number, target: number) {
  return p * target;
}
