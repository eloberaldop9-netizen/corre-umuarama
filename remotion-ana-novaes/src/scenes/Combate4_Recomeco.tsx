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
// Transcrição real (offset from=504): "incentivar"@80 "emprego,"@84
// "capacitação"@86 "profissional"@111 ... "empreendedorismo"@132 ...
// "em"@209 "situação"@220 "de"@237 "violência!"@240 (fim ~257)
//
// v4: reconstruída sobre o esqueleto do Scene4_Compromisso.tsx (vídeo "A
// Marca", aprovado) — Beat A empilha os 3 lettrings na MESMA caixa
// (position:absolute,inset compartilhado), cada um com seu próprio
// wordDelays + exitStart do AnimatedText cuidando da troca sozinho — sem
// gate manual por frame. Beat B (a única coisa elogiada) fica como estava.

export const Combate4_Recomeco: React.FC<{ assets: CombateAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();

  const bgOp = ci(frame, [0, 18], [0, 1], Easing.out(Easing.quad));

  const photoY = ci(frame, [0, 30], [160, 0], Easing.out(Easing.cubic));
  const photoOp = ci(frame, [0, 24], [0, 1]);
  const beatAExitP = ci(frame, [186, 212], [0, 1], Easing.in(Easing.exp));
  const beatAOp = ci(frame, [186, 212], [1, 0]);
  const beatABlur = ci(beatAExitP, [0, 1], [0, 22]);
  const beatAY = ci(beatAExitP, [0, 1], [0, -50]);

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
        {/* Beat A — imagem + lettings em destaque, um de cada vez */}
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

          <div style={{ position: 'absolute', top: 950, left: 70, right: 70, height: 140 }}>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 0, textAlign: 'center' }}>
              <AnimatedText
                text="INCENTIVAR EMPREGO"
                wordDelays={[80, 84]}
                exitStart={95}
                style={{ justifyContent: 'center' }}
                wordStyle={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 46, letterSpacing: -1, color: COLOR_COMBATE.voidDeep }}
              />
            </div>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 0, textAlign: 'center' }}>
              <AnimatedText
                text="CAPACITAÇÃO PROFISSIONAL"
                wordDelays={[86, 111]}
                exitStart={145}
                style={{ justifyContent: 'center', flexWrap: 'wrap' }}
                wordStyle={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 44, letterSpacing: -1, color: COLOR_COMBATE.voidDeep }}
              />
            </div>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 0, textAlign: 'center' }}>
              <AnimatedText
                text="EMPREENDEDORISMO"
                wordDelays={[132]}
                exitStart={175}
                style={{ justifyContent: 'center' }}
                wordStyle={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 42, letterSpacing: -1, color: COLOR_COMBATE.brandCore }}
              />
            </div>
          </div>
        </AbsoluteFill>

        {/* Beat B — só texto, sem imagem */}
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
