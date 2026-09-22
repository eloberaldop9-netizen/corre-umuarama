import React from 'react';
import { AbsoluteFill, Easing, useCurrentFrame } from 'remotion';
import { ci } from '../lib/motion';
import { NoiseOverlay } from '../lib/Background';
import { AnimatedText } from '../lib/AnimatedText';
import { AssetImage } from '../lib/AssetImage';
import { COLOR_COMBATE } from '../lib/palette-combate';
import { FONT } from '../lib/palette';
import type { CombateAssets } from '../VideoAnaNovaisCombate';

// Cena 4 — O Recomeço (A Luz) | frames locais 0–272 (9.1s)
// v2: transcrição corrigida trouxe a frase completa. Dois momentos:
// Beat A (0–209, com a foto de capacitação + lettering animado):
//   "Por"@14 "isso,"@29 "Ana"@54 "propõe"@74 "incentivar"@80 "emprego,"@84
//   "capacitação"@86 "profissional"@111 "e"@130 "empreendedorismo"@132
//   "para"@160 "mulheres"@171 (fim ~209)
// Beat B (209–257, SEM imagem — só texto, pedido explícito da usuária):
//   "em"@209 "situação"@220 "de"@237 "violência!"@240 (fim ~257)
const LETTER_STAGGER = 2;

const HeroWord: React.FC<{ text: string; startFrame: number; style?: React.CSSProperties }> = ({
  text,
  startFrame,
  style,
}) => {
  const frame = useCurrentFrame();
  return (
    <span style={{ display: 'inline-flex', ...style }}>
      {text.split('').map((ch, i) => {
        const ws = startFrame + i * LETTER_STAGGER;
        const p = ci(frame, [ws, ws + 14], [0, 1], Easing.out(Easing.cubic));
        const y = ci(frame, [ws, ws + 14], [30, 0], Easing.out(Easing.cubic));
        const bl = ci(frame, [ws, ws + 9], [10, 0]);
        return (
          <span
            key={i}
            style={{ display: 'inline-block', opacity: p, transform: `translateY(${y}px)`, filter: `blur(${bl}px)`, whiteSpace: 'pre' }}
          >
            {ch}
          </span>
        );
      })}
    </span>
  );
};

export const Combate4_Recomeco: React.FC<{ assets: CombateAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();

  const bgOp = ci(frame, [0, 18], [0, 1], Easing.out(Easing.quad));

  // Beat A — foto sobe com Crane Up, depois sai (blur+fade) antes do Beat B
  const photoY = ci(frame, [0, 30], [160, 0], Easing.out(Easing.cubic));
  const photoOp = ci(frame, [0, 24], [0, 1]);
  const beatAExitP = ci(frame, [186, 212], [0, 1], Easing.in(Easing.exp));
  const beatAOp = ci(frame, [186, 212], [1, 0]);
  const beatABlur = ci(beatAExitP, [0, 1], [0, 22]);
  const beatAY = ci(beatAExitP, [0, 1], [0, -50]);

  // Beat B — texto puro entra depois que o Beat A sai
  const beatBOp = ci(frame, [206, 222], [0, 1], Easing.out(Easing.cubic));

  // Saída (250–272) — DISSOLVE SUJO pro roxo da Cena 5
  const dissolveP = ci(frame, [250, 272], [0, 1], Easing.in(Easing.exp));
  const dissolveBlur = ci(dissolveP, [0, 1], [0, 40]);
  const dissolveOp = ci(frame, [254, 272], [1, 0]);
  const purpleInOp = ci(frame, [250, 272], [0, 1], Easing.in(Easing.exp));

  return (
    <AbsoluteFill style={{ opacity: bgOp, backgroundColor: COLOR_COMBATE.paperLight }}>
      <NoiseOverlay opacity={0.02} />

      <AbsoluteFill style={{ filter: `blur(${dissolveBlur}px)`, opacity: dissolveOp }}>
        {/* Beat A — imagem + legenda + lettering em destaque */}
        <AbsoluteFill
          style={{
            opacity: beatAOp,
            transform: `translateY(${beatAY}px)`,
            filter: `blur(${beatABlur}px)`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 220,
              left: 90,
              right: 90,
              height: 620,
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

          <div style={{ position: 'absolute', top: 900, left: 60, right: 60, textAlign: 'center' }}>
            <AnimatedText
              text="Por isso, Ana propõe incentivar emprego,"
              wordDelays={[14, 29, 54, 74, 80, 84]}
              style={{ justifyContent: 'center', flexWrap: 'wrap' }}
              wordStyle={{ fontFamily: FONT.sans, fontWeight: 300, fontSize: 40, letterSpacing: 2, color: COLOR_COMBATE.voidDeep }}
            />
          </div>

          <div style={{ position: 'absolute', top: 1030, left: 40, right: 40, textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0 16px' }}>
              <HeroWord
                text="CAPACITAÇÃO"
                startFrame={86}
                style={{ fontFamily: FONT.sans, fontWeight: 900, fontSize: 66, letterSpacing: -2, color: COLOR_COMBATE.voidDeep }}
              />
              <HeroWord
                text="PROFISSIONAL"
                startFrame={111}
                style={{ fontFamily: FONT.sans, fontWeight: 900, fontSize: 66, letterSpacing: -2, color: COLOR_COMBATE.voidDeep }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0 14px', marginTop: 6 }}>
              <HeroWord
                text="E"
                startFrame={130}
                style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 48, letterSpacing: -1, color: COLOR_COMBATE.brandCore }}
              />
              <HeroWord
                text="EMPREENDEDORISMO"
                startFrame={132}
                style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 48, letterSpacing: -1, color: COLOR_COMBATE.brandCore }}
              />
            </div>
          </div>

          <div style={{ position: 'absolute', top: 1360, left: 60, right: 60, textAlign: 'center' }}>
            <AnimatedText
              text="para mulheres"
              wordDelays={[160, 171]}
              style={{ justifyContent: 'center' }}
              wordStyle={{ fontFamily: FONT.sans, fontWeight: 300, fontSize: 40, letterSpacing: 2, color: COLOR_COMBATE.voidDeep }}
            />
          </div>
        </AbsoluteFill>

        {/* Beat B — só texto, sem imagem, pedido explícito: peso total na frase final */}
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', opacity: beatBOp }}>
          <div style={{ textAlign: 'center', padding: '0 70px' }}>
            <AnimatedText
              text="em situação de"
              wordDelays={[209, 220, 237]}
              style={{ justifyContent: 'center' }}
              wordStyle={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: 58, letterSpacing: -0.5, color: COLOR_COMBATE.brandCore }}
            />
            <AnimatedText
              text="VIOLÊNCIA!"
              wordDelays={[240]}
              style={{ justifyContent: 'center', marginTop: 10 }}
              wordStyle={{ fontFamily: FONT.sans, fontWeight: 900, fontSize: 108, letterSpacing: -3, color: COLOR_COMBATE.voidDeep }}
            />
          </div>
        </AbsoluteFill>
      </AbsoluteFill>

      {/* Roxo da identidade sobe por baixo, preparando a Cena 5 */}
      <AbsoluteFill style={{ backgroundColor: COLOR_COMBATE.brandCore, opacity: purpleInOp }} />
    </AbsoluteFill>
  );
};
