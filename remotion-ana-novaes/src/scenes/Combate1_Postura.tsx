import React from 'react';
import { AbsoluteFill, Easing, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ci, SPRING } from '../lib/motion';
import { NoiseOverlay, DustParticles } from '../lib/Background';
import { AssetImage } from '../lib/AssetImage';
import { COLOR_COMBATE } from '../lib/palette-combate';
import { FONT } from '../lib/palette';
import type { CombateAssets } from '../VideoAnaNovaisCombate';

// Cena 1 — A Postura (O Combate) | frames locais 0–122 (4.1s)
// Transcrição real (forced alignment real sobre narracao-combate.mp3):
// "Ana"@6 "Novais"@12 "quer"@28 "fortalecer"@38 "o"@56 "combate"@60 "à"@66
// "violência"@72 "contra"@87 "as"@96 "mulheres"@103 (fala termina ~115)
// A pausa real até "Como" (início da Cena 2) é de só 7 frames — por isso a
// saída (RASGA) é rápida e "morde" a própria palavra "mulheres", igual ao
// verbo de saída pedido na diretriz (Z-DIVE).
export const Combate1_Postura: React.FC<{ assets: CombateAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOp = ci(frame, [0, 15], [0, 1]);

  // Câmera — Dolly In Dramático (aproximação sutil ao longo da cena inteira)
  const dollyScale = ci(frame, [0, 122], [0.9, 1.06], Easing.out(Easing.cubic));

  // Retrato
  const portraitOp = ci(frame, [0, 24], [0, 1]);
  const portraitBlur = ci(frame, [0, 24], [20, 0], Easing.out(Easing.cubic));
  const portraitScale = ci(frame, [0, 24], [1.1, 1], Easing.out(Easing.cubic));
  const symbolGlow = 0.3 + Math.max(0, Math.sin(frame * 0.15)) * 0.5;

  // Textos — cravados nas palavras reais
  const fortalecerSp = spring({ frame, fps, config: SPRING.text, delay: 38 });
  const combateSp = spring({ frame, fps, config: { damping: 10, mass: 1.5, stiffness: 90 }, delay: 60 });
  const violenciaSp = spring({ frame, fps, config: SPRING.text, delay: 72 });

  // Saída (100–122) — Z-DIVE RASGA: a foto rasga pra esquerda, "O COMBATE"
  // explode em Z até o amarelo cobrir tudo.
  const exitStart = 100;
  const exitP = ci(frame, [exitStart, 122], [0, 1], Easing.in(Easing.exp));
  const portraitExitSkew = ci(frame, [exitStart, 122], [0, -15], Easing.in(Easing.exp));
  const portraitExitX = ci(frame, [exitStart, 122], [0, -1300], Easing.in(Easing.exp));
  const portraitExitBlur = ci(frame, [exitStart, 122], [0, 24], Easing.in(Easing.exp));
  const portraitExitOp = ci(frame, [exitStart + 6, 122], [1, 0]);

  const combateExitScale = ci(frame, [exitStart + 7, 122], [1, 30], Easing.in(Easing.exp));
  const combateExitOp = ci(frame, [exitStart + 7, 118], [1, 0]);

  const yellowWipeOp = ci(frame, [exitStart + 5, 122], [0, 1], Easing.in(Easing.exp));

  return (
    <AbsoluteFill style={{ opacity: bgOp, backgroundColor: COLOR_COMBATE.voidDeep }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 50% 32%, rgba(122,75,148,0.35), transparent 68%)`,
        }}
      />
      <NoiseOverlay opacity={0.07} />
      <DustParticles count={22} />

      <AbsoluteFill style={{ transform: `scale(${dollyScale})` }}>
        {/* "FORTALECER" — sobe atrás/acima do retrato */}
        <div style={{ position: 'absolute', top: 210, left: 0, right: 0, textAlign: 'center' }}>
          <span
            style={{
              display: 'inline-block',
              fontFamily: FONT.sans,
              fontWeight: 400,
              fontSize: 62,
              letterSpacing: 2,
              color: COLOR_COMBATE.textLight,
              transform: `translateY(${ci(fortalecerSp, [0, 1], [40, 0])}px)`,
              filter: `blur(${ci(frame - 38, [0, 16], [12, 0])}px)`,
              opacity: ci(frame, [38, 52], [0, 1]) * portraitExitOp,
              textShadow: '0 6px 24px rgba(0,0,0,0.7)',
            }}
          >
            FORTALECER
          </span>
        </div>

        {/* Retrato — Ana, jaqueta vermelha, mão com X (emergindo das sombras) */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            width: 900,
            height: 1300,
            marginLeft: -450,
            opacity: portraitOp * portraitExitOp,
            filter: `blur(${portraitBlur + portraitExitBlur}px) drop-shadow(0 30px 90px rgba(0,0,0,0.85))`,
            transform: `scale(${portraitScale}) skewX(${portraitExitSkew}deg) translateX(${portraitExitX}px)`,
            transformOrigin: 'bottom center',
          }}
        >
          <AssetImage
            file={assets.retratoStopX}
            label="RETRATO — ANA NOVAIS (jaqueta vermelha, mão com X) — aguardando envio"
            style={{ width: '100%', height: '100%' }}
            objectFit="contain"
          />
        </div>

        {/* Glow vermelho pulsante — reforça o X na mão (asset já traz o X desenhado) */}
        <div
          style={{
            position: 'absolute',
            bottom: 480,
            left: '50%',
            width: 260,
            height: 260,
            marginLeft: 40,
            opacity: portraitOp * 0.5 * portraitExitOp,
            background: `radial-gradient(circle, rgba(230,57,70,${symbolGlow}) 0%, transparent 70%)`,
            filter: 'blur(20px)',
            pointerEvents: 'none',
          }}
        />

        {/* "O COMBATE" — hero amarelo, cruza a foto (colagem editorial) */}
        <div style={{ position: 'absolute', top: 760, left: 0, right: 0, textAlign: 'center', zIndex: 20 }}>
          <span
            style={{
              display: 'inline-block',
              fontFamily: FONT.sans,
              fontWeight: 900,
              fontSize: 128,
              letterSpacing: -4,
              lineHeight: 0.95,
              color: COLOR_COMBATE.yellow,
              transform: `scale(${ci(combateSp, [0, 1], [2, 1]) * combateExitScale})`,
              filter: `blur(${ci(frame - 60, [0, 18], [15, 0])}px)`,
              opacity: ci(frame, [60, 74], [0, 1]) * combateExitOp,
              textShadow: '0 10px 40px rgba(0,0,0,0.8), 0 0 60px rgba(45,22,67,0.6)',
            }}
          >
            O COMBATE
          </span>
        </div>

        {/* "À VIOLÊNCIA" — abaixo do retrato, hero inferior */}
        <div style={{ position: 'absolute', bottom: 130, left: 0, right: 0, textAlign: 'center' }}>
          <span
            style={{
              display: 'inline-block',
              fontFamily: FONT.sans,
              fontWeight: 700,
              fontSize: 64,
              letterSpacing: -1,
              color: COLOR_COMBATE.textLight,
              transform: `translateX(${ci(violenciaSp, [0, 1], [-50, 0])}px)`,
              filter: `blur(${ci(frame - 72, [0, 16], [12, 0])}px)`,
              opacity: ci(frame, [72, 86], [0, 1]) * portraitExitOp,
              textShadow: '0 6px 24px rgba(0,0,0,0.7)',
            }}
          >
            À VIOLÊNCIA
          </span>
        </div>
      </AbsoluteFill>

      {/* Rasgo amarelo — cobre a tela inteira ao final, entrega a bandeira pra Cena 2 */}
      <AbsoluteFill style={{ backgroundColor: COLOR_COMBATE.yellow, opacity: yellowWipeOp * exitP }} />
    </AbsoluteFill>
  );
};
