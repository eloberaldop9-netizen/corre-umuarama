import React from 'react';
import { AbsoluteFill, Easing, useCurrentFrame } from 'remotion';
import { ci } from '../lib/motion';
import { NoiseOverlay, DustParticles } from '../lib/Background';
import { AssetImage } from '../lib/AssetImage';
import { COLOR_COMBATE } from '../lib/palette-combate';
import { FONT } from '../lib/palette';
import type { CombateAssets } from '../VideoAnaNovaisCombate';

// Cena 1 — A Postura (O Combate) | frames locais 0–122 (4.1s)
// Corte Editorial — VERBO Motion O.S. v5.0. Sem texto espalhado: apenas a
// foto e, quando a fala pronuncia "combate à violência", um único hero
// lettering monumental. Zero spring/bounce — só blur + letter-spacing +
// opacity em Easing.out(Easing.cubic), estética de documentário adulto.
// Transcrição real (forced alignment sobre narracao-combate.mp3):
// "combate"@60 "à"@66 "violência"@72 (fala termina ~115).
export const Combate1_Postura: React.FC<{ assets: CombateAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();

  const bgOp = ci(frame, [0, 12], [0, 1]);
  const dollyScale = ci(frame, [0, 122], [1, 1.08], Easing.out(Easing.cubic));

  const portraitOp = ci(frame, [0, 22], [0, 1], Easing.out(Easing.cubic));
  const portraitBlur = ci(frame, [0, 22], [20, 0], Easing.out(Easing.cubic));

  // Glow vermelho contínuo — único elemento "vivo" fora do texto
  const xGlow = 0.5 + Math.max(0, Math.sin(frame * 0.35)) * 0.5;

  // Entrada do hero lettering — desfoque direcional + tracking, sem bounce
  const line1P = ci(frame, [54, 88], [0, 1], Easing.out(Easing.cubic));
  const line2P = ci(frame, [68, 102], [0, 1], Easing.out(Easing.cubic));

  // Saída (98–122) — Z-DIVE RASGA: o lettering expande em Z até cegar de
  // amarelo; a foto desliza pra fora. Escala e opacidade presas ao mesmo
  // progresso — nunca fica grande E visível ao mesmo tempo além da borda.
  const exitRetrato = ci(frame, [98, 120], [0, 1], Easing.in(Easing.exp));
  const exitText = ci(frame, [102, 122], [0, 1], Easing.in(Easing.exp));
  // Cega de amarelo ANTES do fim da cena — só assim o handoff pra Cena 2
  // (que já começa a entrar por cima aos 7 frames de overlap) é limpo, sem
  // as camadas se misturando num marrom sujo no meio da transição.
  const flashOp = ci(frame, [104, 114], [0, 1], Easing.in(Easing.exp));

  return (
    <AbsoluteFill style={{ opacity: bgOp, backgroundColor: COLOR_COMBATE.voidDeep }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 50% 40%, rgba(122,75,148,0.4), transparent 70%)`,
        }}
      />
      <NoiseOverlay opacity={0.06} />
      <DustParticles count={20} />

      <AbsoluteFill style={{ transform: `scale(${dollyScale})`, transformOrigin: '50% 50%' }}>
        {/* Retrato — Ana, jaqueta vermelha, mão com X (emergindo das sombras) */}
        <div
          style={{
            position: 'absolute',
            top: 460,
            left: '50%',
            width: 820,
            height: 1020,
            marginLeft: -410,
            zIndex: 1,
            opacity: portraitOp * (1 - exitRetrato),
            filter: `blur(${portraitBlur + exitRetrato * 20}px) brightness(${ci(frame, [0, 22], [0, 1], Easing.out(Easing.cubic))})`,
            transform: `translateX(${exitRetrato * -1200}px)`,
            boxShadow: '0 40px 100px rgba(0,0,0,0.9)',
            borderRadius: 8,
            overflow: 'hidden',
          }}
        >
          <AssetImage
            file={assets.retratoStopX}
            label="RETRATO — ANA NOVAIS (jaqueta vermelha, mão com X)"
            style={{ width: '100%', height: '100%', filter: 'saturate(1.08) contrast(1.08)' }}
            objectFit="cover"
          />
          {/* Glow vermelho pulsante — reforça o X já desenhado na foto (mão, ~29%/69% da caixa) */}
          <div
            style={{
              position: 'absolute',
              top: '69%',
              left: '29%',
              width: 260,
              height: 260,
              marginLeft: -130,
              marginTop: -130,
              opacity: 0.5 * xGlow,
              background: `radial-gradient(circle, rgba(230,57,70,0.9) 0%, transparent 70%)`,
              filter: 'blur(22px)',
              pointerEvents: 'none',
              mixBlendMode: 'screen',
            }}
          />
        </div>

        {/* Hero lettering — "COMBATE À VIOLÊNCIA", único texto da cena */}
        <div
          style={{
            position: 'absolute',
            top: 1120,
            left: 56,
            right: 56,
            textAlign: 'center',
            zIndex: 2,
            transform: `scale(${1 + exitText * 26})`,
            opacity: 1 - exitText,
          }}
        >
          <div
            style={{
              fontFamily: FONT.sans,
              fontWeight: 900,
              fontSize: 104,
              lineHeight: 0.98,
              color: COLOR_COMBATE.yellow,
              textShadow: '0 10px 40px rgba(0,0,0,0.85)',
              opacity: line1P,
              filter: `blur(${ci(line1P, [0, 1], [15, 0])}px)`,
              letterSpacing: ci(line1P, [0, 1], [-5, 0]),
            }}
          >
            COMBATE À
          </div>
          <div
            style={{
              fontFamily: FONT.sans,
              fontWeight: 900,
              fontSize: 104,
              lineHeight: 0.98,
              color: COLOR_COMBATE.yellow,
              textShadow: '0 10px 40px rgba(0,0,0,0.85)',
              opacity: line2P,
              filter: `blur(${ci(line2P, [0, 1], [15, 0])}px)`,
              letterSpacing: ci(line2P, [0, 1], [-5, 0]),
            }}
          >
            VIOLÊNCIA
          </div>
        </div>
      </AbsoluteFill>

      {/* Flash amarelo — Z-DIVE cega a tela, entrega a bandeira pra Cena 2 */}
      <AbsoluteFill style={{ backgroundColor: COLOR_COMBATE.yellow, opacity: flashOp }} />
    </AbsoluteFill>
  );
};
