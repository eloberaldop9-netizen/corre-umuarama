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
// Transcrição real (forced alignment real sobre narracao-combate.mp3):
// "Ana"@6 "Novais"@12 "quer"@28 "fortalecer"@38 "o"@56 "combate"@60 "à"@66
// "violência"@72 "contra"@87 "as"@96 "mulheres"@103 (fala termina ~115)
// v3: só os LETTRINGS EM DESTAQUE pedidos — "Ana Novais" e "combate à
// violência contra as mulheres" — nada mais. Sem headline solta, sem texto
// cruzando a foto: um único bloco conectado (nome em cima, foto no meio,
// frase-hero embaixo), igual ao padrão já aprovado (spring + word-by-word,
// nunca letra-por-letra).
export const Combate1_Postura: React.FC<{ assets: CombateAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOp = ci(frame, [0, 15], [0, 1]);

  const dollyScale = ci(frame, [0, 122], [0.9, 1.06], Easing.out(Easing.cubic));

  const portraitOp = ci(frame, [0, 24], [0, 1]);
  const portraitBlur = ci(frame, [0, 24], [20, 0], Easing.out(Easing.cubic));
  const portraitScale = ci(frame, [0, 24], [1.1, 1], Easing.out(Easing.cubic));
  const symbolGlow = 0.3 + Math.max(0, Math.sin(frame * 0.15)) * 0.5;

  const nameSp = spring({ frame, fps, config: SPRING.text, delay: 6 });

  // Saída (100–122) — Z-DIVE RASGA: a foto rasga pra esquerda, o hero
  // explode em Z até o amarelo cobrir tudo.
  const exitStart = 100;
  const exitP = ci(frame, [exitStart, 122], [0, 1], Easing.in(Easing.exp));
  const portraitExitSkew = ci(frame, [exitStart, 122], [0, -15], Easing.in(Easing.exp));
  const portraitExitX = ci(frame, [exitStart, 122], [0, -1300], Easing.in(Easing.exp));
  const portraitExitBlur = ci(frame, [exitStart, 122], [0, 24], Easing.in(Easing.exp));
  const portraitExitOp = ci(frame, [exitStart + 6, 122], [1, 0]);

  const heroExitScale = ci(frame, [exitStart + 7, 122], [1, 18], Easing.in(Easing.exp));
  const heroExitOp = ci(frame, [exitStart + 7, 118], [1, 0]);

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
        {/* "Ana Novais" — tag de nome, conectado ao bloco (topo) */}
        <div style={{ position: 'absolute', top: 380, left: 0, right: 0, textAlign: 'center' }}>
          <span
            style={{
              display: 'inline-block',
              fontFamily: FONT.sans,
              fontWeight: 600,
              fontSize: 44,
              letterSpacing: 6,
              color: COLOR_COMBATE.textLight,
              transform: `translateY(${ci(nameSp, [0, 1], [30, 0])}px)`,
              filter: `blur(${ci(frame - 6, [0, 14], [10, 0])}px)`,
              opacity: ci(frame, [6, 20], [0, 1]) * portraitExitOp,
              textShadow: '0 6px 24px rgba(0,0,0,0.7)',
            }}
          >
            ANA NOVAIS
          </span>
        </div>

        {/* Retrato — Ana, jaqueta vermelha, mão com X (emergindo das sombras), sem texto por cima */}
        <div
          style={{
            position: 'absolute',
            top: 490,
            left: '50%',
            width: 640,
            height: 800,
            marginLeft: -320,
            opacity: portraitOp * portraitExitOp,
            filter: `blur(${portraitBlur + portraitExitBlur}px)`,
            transform: `scale(${portraitScale}) skewX(${portraitExitSkew}deg) translateX(${portraitExitX}px)`,
            transformOrigin: 'bottom center',
          }}
        >
          <AssetImage
            file={assets.retratoStopX}
            label="RETRATO — ANA NOVAIS (jaqueta vermelha, mão com X) — aguardando envio"
            style={{ width: '100%', height: '100%', filter: 'saturate(1.05) contrast(1.05)' }}
            objectFit="cover"
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(ellipse 58% 62% at 50% 40%, transparent 26%, ${COLOR_COMBATE.voidDeep} 76%)`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(180deg, ${COLOR_COMBATE.voidDeep} 0%, transparent 18%, transparent 78%, ${COLOR_COMBATE.voidDeep} 100%)`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '52%',
              left: '26%',
              width: 240,
              height: 240,
              marginLeft: -120,
              marginTop: -120,
              opacity: 0.55,
              background: `radial-gradient(circle, rgba(230,57,70,${symbolGlow}) 0%, transparent 70%)`,
              filter: 'blur(20px)',
              pointerEvents: 'none',
              mixBlendMode: 'screen',
            }}
          />
        </div>

        {/* "COMBATE À VIOLÊNCIA CONTRA AS MULHERES" — hero único, conectado, embaixo da foto */}
        <div
          style={{
            position: 'absolute',
            top: 1360,
            left: 50,
            right: 50,
            textAlign: 'center',
            transform: `scale(${heroExitScale})`,
            opacity: heroExitOp,
          }}
        >
          <AnimatedText
            text="COMBATE À VIOLÊNCIA"
            wordDelays={[60, 66, 72]}
            style={{ justifyContent: 'center' }}
            wordStyle={{
              fontFamily: FONT.sans,
              fontWeight: 900,
              fontSize: 78,
              letterSpacing: -2,
              color: COLOR_COMBATE.yellow,
              textShadow: '0 8px 30px rgba(0,0,0,0.7)',
            }}
          />
          <AnimatedText
            text="CONTRA AS MULHERES"
            wordDelays={[87, 96, 103]}
            style={{ justifyContent: 'center', marginTop: 4 }}
            wordStyle={{
              fontFamily: FONT.sans,
              fontWeight: 900,
              fontSize: 78,
              letterSpacing: -2,
              color: COLOR_COMBATE.textLight,
              textShadow: '0 8px 30px rgba(0,0,0,0.7)',
            }}
          />
        </div>
      </AbsoluteFill>

      {/* Rasgo amarelo — cobre a tela inteira ao final, entrega a bandeira pra Cena 2 */}
      <AbsoluteFill style={{ backgroundColor: COLOR_COMBATE.yellow, opacity: yellowWipeOp * exitP }} />
    </AbsoluteFill>
  );
};
