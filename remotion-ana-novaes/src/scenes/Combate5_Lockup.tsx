import React from 'react';
import { AbsoluteFill, Easing, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ci, SPRING } from '../lib/motion';
import { NoiseOverlay } from '../lib/Background';
import { AssetImage } from '../lib/AssetImage';
import { COLOR_COMBATE } from '../lib/palette-combate';
import { FONT } from '../lib/palette';
import type { CombateAssets } from '../VideoAnaNovaisCombate';

// Cena 5 — Lockup Institucional | frames locais 0–180 (6.0s)
// A fala real segue fora de quadro de legenda (trecho final da narração não
// está na diretriz textual) — por isso esta cena não tem legenda cravada
// palavra a palavra: é o lockup fixo da campanha (igual ao material oficial),
// que sobe do roxo da Cena 4 e sustenta o áudio até o fim real (25,39s) mais
// o fade final. O retrato institucional da Ana entra como fundo, com o
// degradê da marca por cima (scrim) garantindo legibilidade da pílula/nome.
export const Combate5_Lockup: React.FC<{ assets: CombateAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const microZoom = ci(frame, [0, 180], [1, 1.03], Easing.inOut(Easing.quad));
  const photoOp = ci(frame, [0, 20], [0, 1]);

  const pillScale = ci(frame, [15, 33], [0, 1], Easing.out(Easing.cubic));
  const pillOp = ci(frame, [15, 25], [0, 1]);

  const nameY = ci(frame, [25, 45], [20, 0], Easing.out(Easing.cubic));
  const nameBlur = ci(frame, [25, 45], [15, 0], Easing.out(Easing.cubic));
  const nameOp = ci(frame, [25, 40], [0, 1]);

  const baseY = ci(frame, [40, 62], [220, 0], Easing.out(Easing.cubic));
  const baseOp = ci(frame, [40, 52], [0, 1]);

  const numSp = spring({ frame, fps, config: { damping: 12, mass: 1 }, delay: 50 });
  const numScale = ci(numSp, [0, 1], [0.8, 1]);
  const numBlur = ci(frame - 50, [0, 20], [20, 0]);
  const numOp = ci(frame, [50, 62], [0, 1]);

  // Fade final — últimos 20 frames globais (cena termina no fim real do vídeo)
  const finalFade = ci(frame, [160, 180], [1, 0]);

  return (
    <AbsoluteFill style={{ opacity: finalFade }}>
      <AbsoluteFill style={{ backgroundColor: COLOR_COMBATE.brandCore }} />
      <AbsoluteFill style={{ transform: `scale(${microZoom * 1.04})`, opacity: photoOp }}>
        <AssetImage
          file={assets.retratoOficial}
          label="RETRATO INSTITUCIONAL — ANA NOVAIS"
          style={{ width: '100%', height: '100%', objectPosition: '50% 22%' }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `linear-gradient(175deg, ${COLOR_COMBATE.lilacLight}E6 0%, #9868B0E6 45%, ${COLOR_COMBATE.brandCore}F2 100%)`,
          transform: `scale(${microZoom})`,
        }}
      />
      <NoiseOverlay opacity={0.04} />

      <AbsoluteFill style={{ transform: `scale(${microZoom})` }}>
        <div style={{ position: 'absolute', top: 560, left: 0, right: 0, textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-block',
              backgroundColor: COLOR_COMBATE.yellow,
              borderRadius: 999,
              padding: '16px 44px',
              opacity: pillOp,
              transform: `scaleX(${pillScale})`,
              boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
            }}
          >
            <span style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 34, letterSpacing: 3, color: COLOR_COMBATE.voidDeep }}>
              DEPUTADA FEDERAL
            </span>
          </div>
        </div>

        <div style={{ position: 'absolute', top: 660, left: 0, right: 0, textAlign: 'center' }}>
          <span
            style={{
              fontFamily: FONT.sans,
              fontWeight: 800,
              fontSize: 108,
              letterSpacing: -3,
              color: COLOR_COMBATE.lilacLight,
              opacity: nameOp,
              transform: `translateY(${nameY}px)`,
              filter: `blur(${nameBlur}px)`,
              textShadow: '0 10px 40px rgba(45,22,67,0.5)',
            }}
          >
            Ana Novais
          </span>
        </div>

        {/* Base curva — abriga o número */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 620,
            opacity: baseOp,
            transform: `translateY(${baseY}px)`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: COLOR_COMBATE.voidDeep,
              borderTopLeftRadius: '52% 90px',
              borderTopRightRadius: '52% 90px',
              boxShadow: '0 -30px 80px rgba(0,0,0,0.35)',
            }}
          />
          <div style={{ position: 'absolute', top: 140, left: 0, right: 0, textAlign: 'center' }}>
            <span
              style={{
                fontFamily: FONT.sans,
                fontWeight: 900,
                fontSize: 220,
                letterSpacing: -4,
                color: COLOR_COMBATE.textLight,
                opacity: numOp,
                transform: `scale(${numScale})`,
                filter: `blur(${numBlur}px)`,
              }}
            >
              2010
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
