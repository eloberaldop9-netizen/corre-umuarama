import React from 'react';
import { AbsoluteFill, Easing, useCurrentFrame } from 'remotion';
import { ci } from '../lib/motion';
import { NoiseOverlay } from '../lib/Background';
import { AnimatedText } from '../lib/AnimatedText';
import { AssetImage } from '../lib/AssetImage';
import { COLOR_COMBATE } from '../lib/palette-combate';
import { FONT } from '../lib/palette';
import type { CombateAssets } from '../VideoAnaNovaisCombate';

// Cena 4 — O Recomeço (A Luz) | frames locais 0–155 (5.2s)
// Transcrição real: "Por"@7 "isso,"@22 "Ana"@47 "propõe"@67 "incentivar"@72
// "emprego,"@83 "capacitação"@91 "profissional,"@104 (fala termina ~115)
export const Combate4_Recomeco: React.FC<{ assets: CombateAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();

  const bgOp = ci(frame, [0, 18], [0, 1], Easing.out(Easing.quad));

  // Câmera — Crane Up suave
  const craneY = ci(frame, [0, 155], [70, -20], Easing.inOut(Easing.quad));

  const photoY = ci(frame, [0, 30], [180, 0], Easing.out(Easing.cubic));
  const photoOp = ci(frame, [0, 24], [0, 1]);

  const heroOp = ci(frame, [91, 108], [0, 1], Easing.out(Easing.cubic));
  const heroScale = ci(frame, [91, 112], [0.9, 1], Easing.out(Easing.cubic));

  // Saída (128–155) — DISSOLVE SUJO: desfoca e perde brilho, derretendo pro
  // roxo da Cena 5 (que já sobe por baixo).
  const dissolveP = ci(frame, [128, 155], [0, 1], Easing.in(Easing.exp));
  const dissolveBlur = ci(dissolveP, [0, 1], [0, 40]);
  const dissolveOp = ci(frame, [132, 155], [1, 0]);
  const purpleInOp = ci(frame, [128, 155], [0, 1], Easing.in(Easing.exp));

  return (
    <AbsoluteFill style={{ opacity: bgOp, backgroundColor: COLOR_COMBATE.paperLight }}>
      <NoiseOverlay opacity={0.02} />

      <AbsoluteFill
        style={{
          transform: `translateY(${craneY}px)`,
          filter: `blur(${dissolveBlur}px)`,
          opacity: dissolveOp,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 260,
            left: 90,
            right: 90,
            height: 760,
            opacity: photoOp,
            transform: `translateY(${photoY}px)`,
            boxShadow: '0 40px 100px rgba(45,22,67,0.35)',
          }}
        >
          <AssetImage
            file={assets.fotoCapacitacao}
            label="SALA DE AULA — CAPACITAÇÃO PROFISSIONAL"
            tone="light"
            style={{ width: '100%', height: '100%' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(160deg, rgba(122,75,148,0.22) 0%, transparent 45%, rgba(252,227,0,0.10) 100%)',
              mixBlendMode: 'screen',
            }}
          />
        </div>

        <div style={{ position: 'absolute', top: 1090, left: 60, right: 60, textAlign: 'center' }}>
          <AnimatedText
            text="Por isso, Ana propõe"
            wordDelays={[7, 22, 47]}
            style={{ justifyContent: 'center' }}
            wordStyle={{
              fontFamily: FONT.sans,
              fontWeight: 300,
              fontSize: 48,
              letterSpacing: 4,
              color: COLOR_COMBATE.voidDeep,
            }}
          />
          <AnimatedText
            text="incentivar emprego,"
            wordDelays={[67, 83]}
            style={{ justifyContent: 'center', marginTop: 10 }}
            wordStyle={{
              fontFamily: FONT.sans,
              fontWeight: 300,
              fontSize: 48,
              letterSpacing: 4,
              color: COLOR_COMBATE.voidDeep,
            }}
          />
        </div>

        <div
          style={{
            position: 'absolute',
            top: 1330,
            left: 0,
            right: 0,
            textAlign: 'center',
            opacity: heroOp,
            transform: `scale(${heroScale})`,
          }}
        >
          <div
            style={{
              display: 'inline-block',
              backgroundColor: COLOR_COMBATE.voidDeep,
              padding: '20px 44px',
              boxShadow: '0 20px 50px rgba(45,22,67,0.4)',
            }}
          >
            <span
              style={{
                fontFamily: FONT.sans,
                fontWeight: 900,
                fontSize: 60,
                letterSpacing: -1,
                lineHeight: 1.1,
                color: COLOR_COMBATE.yellow,
              }}
            >
              CAPACITAÇÃO
              <br />
              PROFISSIONAL
            </span>
          </div>
        </div>
      </AbsoluteFill>

      {/* Roxo da identidade sobe por baixo, preparando a Cena 5 */}
      <AbsoluteFill style={{ backgroundColor: COLOR_COMBATE.brandCore, opacity: purpleInOp }} />
    </AbsoluteFill>
  );
};
