import React from 'react';
import { AbsoluteFill, Easing, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ci, SPRING } from '../lib/motion';
import { NoiseOverlay, DustParticles } from '../lib/Background';
import { AnimatedText } from '../lib/AnimatedText';
import { AssetImage } from '../lib/AssetImage';
import { COLOR_COMBATE } from '../lib/palette-combate';
import { FONT } from '../lib/palette';
import type { CombateAssets } from '../VideoAnaNovaisCombate';

// Cena 1 — A Postura (O Combate) | frames locais 0–122 (4.1s)
// Transcrição real: "Ana"@6 "Novais"@12 ... "combate"@60 "à"@66 "violência"@72
// "contra"@87 "as"@96 "mulheres"@103 (fala termina ~115)
// v4: reconstruída sobre o MESMO esqueleto do Scene1_Manchete.tsx (vídeo "A
// Marca", já aprovado) — flex column centralizado (nada de `top` fixo em
// pixel espalhado), textos curtos, e saída com escala/opacidade presas à
// MESMA variável de progresso (nunca janelas separadas — foi isso que
// causou o texto vazando a margem antes).
export const Combate1_Postura: React.FC<{ assets: CombateAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOp = ci(frame, [0, 15], [0, 1]);
  const dollyScale = ci(frame, [0, 122], [0.94, 1.03], Easing.out(Easing.cubic));

  const portraitOp = ci(frame, [0, 24], [0, 1]);
  const portraitBlur = ci(frame, [0, 24], [18, 0], Easing.out(Easing.cubic));
  const symbolGlow = 0.3 + Math.max(0, Math.sin(frame * 0.15)) * 0.5;

  const anaSp = spring({ frame, fps, config: SPRING.text, delay: 6 });
  const novaisSp = spring({ frame, fps, config: SPRING.text, delay: 12 });

  // Saída (98–122) — mesmo verbo do Scene1: retrato desliza pra esquerda,
  // nome e hero saem em escala+blur+opacidade presos à MESMA variável.
  const exitP = ci(frame, [98, 122], [0, 1], Easing.in(Easing.exp));
  const portraitTX = exitP * -1100;
  const portraitExitBlur = exitP * 16;

  const exitName = ci(frame, [100, 120], [0, 1], Easing.in(Easing.exp));
  const exitHero = ci(frame, [104, 122], [0, 1], Easing.in(Easing.exp));

  const flashOp = ci(frame, [108, 122], [0, 0.9]);

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

      <AbsoluteFill
        style={{
          transform: `scale(${dollyScale})`,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Nome */}
        <div
          style={{
            display: 'flex',
            gap: 14,
            marginBottom: 22,
            transform: `translateX(${exitName * -1200}px) scale(${1 - exitName * 0.06})`,
            filter: `blur(${exitName * 16}px)`,
            opacity: 1 - exitName,
          }}
        >
          <span
            style={{
              fontFamily: FONT.sans,
              fontWeight: 700,
              fontSize: 46,
              letterSpacing: 4,
              color: COLOR_COMBATE.textLight,
              transform: `translateY(${ci(anaSp, [0, 1], [24, 0])}px)`,
              filter: `blur(${ci(frame - 6, [0, 14], [10, 0])}px)`,
              opacity: ci(frame, [6, 18], [0, 1]),
            }}
          >
            ANA
          </span>
          <span
            style={{
              fontFamily: FONT.sans,
              fontWeight: 700,
              fontSize: 46,
              letterSpacing: 4,
              color: COLOR_COMBATE.textLight,
              transform: `translateY(${ci(novaisSp, [0, 1], [24, 0])}px)`,
              filter: `blur(${ci(frame - 12, [0, 14], [10, 0])}px)`,
              opacity: ci(frame, [12, 24], [0, 1]),
            }}
          >
            NOVAIS
          </span>
        </div>

        {/* Retrato — Ana, jaqueta vermelha, mão com X */}
        <div
          style={{
            position: 'relative',
            width: 620,
            height: 780,
            opacity: portraitOp,
            filter: `blur(${portraitBlur + portraitExitBlur}px)`,
            transform: `translateX(${portraitTX}px)`,
            boxShadow: '0 20px 90px rgba(0,0,0,0.85)',
            borderRadius: 8,
            overflow: 'hidden',
          }}
        >
          <AssetImage
            file={assets.retratoStopX}
            label="RETRATO — ANA NOVAIS (jaqueta vermelha, mão com X)"
            style={{ width: '100%', height: '100%', filter: 'saturate(1.05) contrast(1.05)' }}
            objectFit="cover"
          />
          <div
            style={{
              position: 'absolute',
              top: '38%',
              left: '22%',
              width: 220,
              height: 220,
              marginLeft: -110,
              marginTop: -110,
              opacity: 0.5,
              background: `radial-gradient(circle, rgba(230,57,70,${symbolGlow}) 0%, transparent 70%)`,
              filter: 'blur(20px)',
              pointerEvents: 'none',
              mixBlendMode: 'screen',
            }}
          />
        </div>

        {/* "COMBATE À VIOLÊNCIA CONTRA AS MULHERES" — hero curto, duas linhas */}
        <div
          style={{
            marginTop: 30,
            textAlign: 'center',
            transform: `scale(${1 + exitHero * 0.1})`,
            filter: `blur(${exitHero * 24}px)`,
            opacity: 1 - exitHero,
          }}
        >
          <AnimatedText
            text="COMBATE À VIOLÊNCIA"
            wordDelays={[60, 66, 72]}
            style={{ justifyContent: 'center' }}
            wordStyle={{
              fontFamily: FONT.sans,
              fontWeight: 800,
              fontSize: 48,
              letterSpacing: -1,
              color: COLOR_COMBATE.yellow,
            }}
          />
          <AnimatedText
            text="CONTRA AS MULHERES"
            wordDelays={[87, 96, 103]}
            style={{ justifyContent: 'center', marginTop: 4 }}
            wordStyle={{
              fontFamily: FONT.sans,
              fontWeight: 800,
              fontSize: 48,
              letterSpacing: -1,
              color: COLOR_COMBATE.textLight,
            }}
          />
        </div>
      </AbsoluteFill>

      {/* Flash amarelo — transição ótica para a Cena 2, igual ao padrão aprovado */}
      <AbsoluteFill style={{ backgroundColor: COLOR_COMBATE.yellow, opacity: flashOp }} />
    </AbsoluteFill>
  );
};
